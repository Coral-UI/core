/**
 * API for managing organization invitations
 */

import type { Database } from '@/lib/supabase/database.types'
import type { OrgRole } from '@/lib/supabase/types'
import type { AcceptInvitationInput, CreateInvitationInput, OrganizationInvitation } from '@/types/invitation'
import { canManageMembers } from '@/lib/permissions/ability'
import { getUserOrgRole } from '@/lib/permissions/use-permissions'
import { supabase } from '@/lib/supabase/client'
import { extractArray, isSupabaseError } from '@/lib/supabase/helpers'

type OrganizationInvitationRow = Database['public']['Tables']['organization_invitations']['Row']
type OrganizationInvitationInsert = Database['public']['Tables']['organization_invitations']['Insert']
type OrganizationInvitationUpdate = Database['public']['Tables']['organization_invitations']['Update']

/**
 * Get all pending invitations for an organization
 */
export async function getInvitations(organizationId: string): Promise<OrganizationInvitation[]> {
  // Check permissions
  const role = await getUserOrgRole(organizationId)
  if (!canManageMembers(role)) {
    throw new Error('Insufficient permissions to view organization invitations')
  }

  const { data, error } = await supabase
    .from('organization_invitations')
    .select('*')
    .eq('organization_id', organizationId)
    .is('accepted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch invitations: ${error.message}`)
  }

  const rows = extractArray(data, error) as OrganizationInvitationRow[]
  return rows.map((row) => ({
    id: row.id,
    organizationId: row.organization_id,
    email: row.email,
    role: row.role,
    invitedBy: row.invited_by,
    token: row.token,
    expiresAt: row.expires_at,
    acceptedAt: row.accepted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

/**
 * Get an invitation by token
 */
export async function getInvitationByToken(token: string): Promise<OrganizationInvitation | null> {
  const { data, error } = await supabase
    .from('organization_invitations')
    .select('*')
    .eq('token', token)
    .is('accepted_at', null)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch invitation: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as OrganizationInvitationRow

  // Check if invitation has expired
  const expiresAt = new Date(row.expires_at)
  if (expiresAt < new Date()) {
    return null
  }

  return {
    id: row.id,
    organizationId: row.organization_id,
    email: row.email,
    role: row.role,
    invitedBy: row.invited_by,
    token: row.token,
    expiresAt: row.expires_at,
    acceptedAt: row.accepted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Create a new invitation
 */
export async function createInvitation(input: CreateInvitationInput): Promise<OrganizationInvitation> {
  // Check permissions
  const role = await getUserOrgRole(input.organizationId)
  if (!canManageMembers(role)) {
    throw new Error('Insufficient permissions to create invitations')
  }

  // Get current user
  const { data: session } = await supabase.auth.getSession()
  if (!session.session?.user?.id) {
    throw new Error('User not authenticated')
  }

  // Generate secure token
  const token = crypto.randomUUID() + '-' + crypto.randomUUID()

  const now = new Date().toISOString()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

  const insertData: OrganizationInvitationInsert = {
    organization_id: input.organizationId,
    email: input.email.toLowerCase().trim(),
    role: input.role,
    invited_by: session.session.user.id,
    token,
    expires_at: expiresAt.toISOString(),
    created_at: now,
    updated_at: now,
  }

  const { data, error } = await supabase
    .from('organization_invitations')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    if (isSupabaseError(error) && error.code === '23505') {
      // Unique constraint violation - pending invitation already exists
      throw new Error('A pending invitation already exists for this email')
    }
    throw new Error(`Failed to create invitation: ${error.message}`)
  }

  const row = data as OrganizationInvitationRow
  return {
    id: row.id,
    organizationId: row.organization_id,
    email: row.email,
    role: row.role,
    invitedBy: row.invited_by,
    token: row.token,
    expiresAt: row.expires_at,
    acceptedAt: row.accepted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Accept an invitation
 */
export async function acceptInvitation(input: AcceptInvitationInput): Promise<void> {
  // Get invitation
  const invitation = await getInvitationByToken(input.token)
  if (!invitation) {
    throw new Error('Invalid or expired invitation')
  }

  // Get current user
  const { data: session } = await supabase.auth.getSession()
  if (!session.session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const userId = session.session.user.id

  // Verify email matches
  if (session.session.user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
    throw new Error('Invitation email does not match your account email')
  }

  // Check if user is already a member
  const { data: existingMember } = await supabase
    .from('organization_members')
    .select('id')
    .eq('organization_id', invitation.organizationId)
    .eq('user_id', userId)
    .maybeSingle()

  if (existingMember) {
    // Mark invitation as accepted even though user is already a member
    await supabase
      .from('organization_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.id)
    throw new Error('You are already a member of this organization')
  }

  // Use a transaction-like approach: create member and mark invitation as accepted
  const now = new Date().toISOString()

  // Create organization member
  const { error: memberError } = await supabase.from('organization_members').insert({
    organization_id: invitation.organizationId,
    user_id: userId,
    role: invitation.role,
    invited_by: invitation.invitedBy,
    created_at: now,
    updated_at: now,
  })

  if (memberError) {
    if (isSupabaseError(memberError) && memberError.code === '23505') {
      // User became a member between check and insert
      await supabase
        .from('organization_invitations')
        .update({ accepted_at: now })
        .eq('id', invitation.id)
      throw new Error('You are already a member of this organization')
    }
    throw new Error(`Failed to accept invitation: ${memberError.message}`)
  }

  // Mark invitation as accepted
  const { error: updateError } = await supabase
    .from('organization_invitations')
    .update({ accepted_at: now })
    .eq('id', invitation.id)

  if (updateError) {
    // Member was created but invitation update failed - log but don't fail
    console.error('Failed to mark invitation as accepted:', updateError)
  }
}

/**
 * Delete an invitation
 */
export async function deleteInvitation(invitationId: string): Promise<void> {
  // Get invitation to check organization
  const { data: invitation, error: fetchError } = await supabase
    .from('organization_invitations')
    .select('organization_id')
    .eq('id', invitationId)
    .single()

  if (fetchError || !invitation) {
    throw new Error('Invitation not found')
  }

  // Check permissions
  const role = await getUserOrgRole(invitation.organization_id)
  if (!canManageMembers(role)) {
    throw new Error('Insufficient permissions to delete invitations')
  }

  const { error } = await supabase.from('organization_invitations').delete().eq('id', invitationId)

  if (error) {
    throw new Error(`Failed to delete invitation: ${error.message}`)
  }
}
