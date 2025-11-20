import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/lib/supabase/database.types'
import type { OrgRole } from '../src/lib/supabase/types'
import { InvitationEmail } from '../src/lib/emails/InvitationEmail'
import { renderEmail } from '../src/lib/emails/render-email'

const inviteRequestSchema = z.object({
  organizationId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']),
})

async function getUserOrgRole(supabase: ReturnType<typeof createClient>, organizationId: string): Promise<OrgRole | null> {
  const { data, error } = await supabase.rpc('get_user_org_role', { org_id: organizationId }).single()

  if (error) {
    // Fallback to querying organization_members
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: member } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .maybeSingle()

    return (member?.role as OrgRole) ?? null
  }

  return (data as OrgRole) ?? null
}

function canManageMembers(role: OrgRole | null): boolean {
  return role === 'admin'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validate environment variables
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    console.error('RESEND_API_KEY environment variable is not set')
    return res.status(500).json({ error: 'Email service is not configured' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are not set')
    return res.status(500).json({ error: 'Database service is not configured' })
  }

  // Authenticate user
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.substring(7)
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  // Verify user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid authentication token' })
  }

  try {
    // Validate request body
    const validationResult = inviteRequestSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid request',
        details: validationResult.error.errors,
      })
    }

    const { organizationId, email, role } = validationResult.data

    // Check permissions
    const userRole = await getUserOrgRole(supabase, organizationId)
    if (!canManageMembers(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions to create invitations' })
    }

    // Get organization to verify it exists and get name
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single()

    if (orgError || !orgData) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    // Generate secure token
    const invitationToken = crypto.randomUUID() + '-' + crypto.randomUUID()

    const now = new Date().toISOString()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    // Create invitation in database
    const { data: invitationData, error: inviteError } = await supabase
      .from('organization_invitations')
      .insert({
        organization_id: organizationId,
        email: email.toLowerCase().trim(),
        role,
        invited_by: user.id,
        token: invitationToken,
        expires_at: expiresAt.toISOString(),
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (inviteError) {
      if (inviteError.code === '23505') {
        return res.status(400).json({ error: 'A pending invitation already exists for this email' })
      }
      throw inviteError
    }

    // Get inviter information
    const inviterName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Someone'
    const inviterEmail = user.email || ''

    // Generate acceptance URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173'
    const acceptUrl = `${baseUrl}/invite/accept?token=${invitationToken}`

    // Render email template
    const emailHtml = renderEmail(
      InvitationEmail({
        organizationName: orgData.name,
        inviterName,
        inviterEmail,
        role,
        acceptUrl,
      }),
    )

    // Send email via Resend
    const resend = new Resend(resendApiKey)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `You've been invited to join ${orgData.name} on Coral`,
      html: emailHtml,
    })

    if (emailError) {
      console.error('Failed to send invitation email:', emailError)
      // Don't fail the request - invitation was created successfully
      return res.status(200).json({
        success: true,
        invitationId: invitationData.id,
        message: 'Invitation created, but email sending failed. You can resend the invitation later.',
        emailError: emailError.message,
      })
    }

    return res.status(200).json({
      success: true,
      invitationId: invitationData.id,
      emailId: emailData?.id,
    })
  } catch (error) {
    console.error('Error creating invitation:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return res.status(500).json({
      error: 'Failed to create invitation',
      message: errorMessage,
    })
  }
}
