import type { Database } from '@/lib/supabase/database.types'
import { InvitationEmail } from '@/lib/emails/InvitationEmail'
import { renderEmail } from '@/lib/emails/render-email'
import { canManageMembers } from '@/lib/permissions/ability'
import { getUserOrgRoleServer } from '@/lib/permissions/server-permissions'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resendApiKey = process.env['RESEND_API_KEY']
const resend = resendApiKey ? new Resend(resendApiKey) : null

type OrganizationInvitationInsert = Database['public']['Tables']['organization_invitations']['Insert']

const inviteRequestSchema = z.object({
  organizationId: z.uuid(),
  email: z.email(),
  role: z.enum(['admin', 'editor', 'viewer']),
})

export async function POST(request: Request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  // Validate environment variables
  if (!resend) {
    console.error('RESEND_API_KEY environment variable is not set')
    return Response.json({ error: 'Email service is not configured' }, { status: 500 })
  }

  const supabase = await createClient()

  // Verify user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return Response.json({ error: 'Invalid authentication token' }, { status: 401 })
  }

  try {
    // Validate request body
    const body = await request.json()
    const validationResult = inviteRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return Response.json(
        {
          error: 'Invalid request body',
          details: validationResult.error.issues,
        },
        { status: 400 },
      )
    }

    const { organizationId, email, role } = validationResult.data

    // Check permissions
    const userRole = await getUserOrgRoleServer(organizationId)
    if (!canManageMembers(userRole)) {
      return Response.json({ error: 'Insufficient permissions to invite members' }, { status: 403 })
    }

    // Get organization name
    const { data: orgRaw } = await supabase.from('organizations').select('name').eq('id', organizationId).single()

    if (!orgRaw) {
      return Response.json({ error: 'Organization not found' }, { status: 404 })
    }

    const org = orgRaw as { name: string }

    // Generate secure token
    const invitationToken = crypto.randomUUID() + '-' + crypto.randomUUID()

    const now = new Date().toISOString()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    // Store invitation in database
    const insertData: OrganizationInvitationInsert = {
      organization_id: organizationId,
      email: email.toLowerCase().trim(),
      role,
      token: invitationToken,
      invited_by: user.id,
      expires_at: expiresAt.toISOString(),
      created_at: now,
      updated_at: now,
    }

    const { data: invitationDataRaw, error: inviteError } = await supabase
      .from('organization_invitations')
      // @ts-expect-error - Supabase type inference issue with Database generic, but types are correct at runtime
      .insert(insertData)
      .select()
      .single()

    if (!invitationDataRaw) {
      return Response.json({ error: 'Failed to create invitation' }, { status: 500 })
    }

    const invitationData = invitationDataRaw as { id: string }

    if (inviteError) {
      const error = inviteError as { code?: string; message?: string }
      if (error.code === '23505') {
        return Response.json({ error: 'A pending invitation already exists for this email' }, { status: 400 })
      }
      console.error('Failed to create invitation:', inviteError)
      return Response.json({ error: 'Failed to create invitation' }, { status: 500 })
    }

    // Get inviter information
    const inviterName = user.user_metadata?.['full_name'] || user.email?.split('@')[0] || 'Someone'
    const inviterEmail = user.email || ''

    // Generate acceptance URL
    const baseUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'
    const acceptUrl = `${baseUrl}/invite/accept?token=${invitationToken}`

    // Render email template
    const emailHtml = renderEmail(
      InvitationEmail({
        organizationName: org.name,
        inviterName,
        inviterEmail,
        role,
        acceptUrl,
      }) as React.ReactElement,
    )

    const fromEmail = process.env['RESEND_FROM_EMAIL'] || 'onboarding@resend.dev'
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `You've been invited to join ${org.name} on Coral`,
      html: emailHtml,
    })

    if (emailError) {
      console.error('Failed to send invitation email:', emailError)
      // Don't fail the request - invitation was created successfully
      return Response.json({
        success: true,
        invitationId: invitationData.id,
        message: 'Invitation created, but email sending failed. You can resend the invitation later.',
        emailError: emailError.message,
      })
    }

    return Response.json({
      success: true,
      invitationId: invitationData.id,
      emailId: emailData?.id,
    })
  } catch (err) {
    console.error('Error processing invitation:', err)
    const errorMessage = err instanceof Error ? err.message : 'Failed to process invitation'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
