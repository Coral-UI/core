/**
 * API for managing organization members and invitations
 */

import type { Database } from '@/lib/supabase/database.types'
import type { OrgRole } from '@/lib/supabase/types'
import { canManageMembers } from '@/lib/permissions/ability'
import { getUserOrgRole } from '@/lib/permissions/use-permissions'
import { supabase } from '@/lib/supabase/client'
import { extractArray, isSupabaseError } from '@/lib/supabase/helpers'

type OrganizationMemberRow = Database['public']['Tables']['organization_members']['Row']
type OrganizationMemberInsert = Database['public']['Tables']['organization_members']['Insert']
type OrganizationMemberUpdate = Database['public']['Tables']['organization_members']['Update']

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: OrgRole
  invitedBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrganizationMemberInput {
  organizationId: string
  userId: string
  role: OrgRole
}

export interface UpdateOrganizationMemberInput {
  role?: OrgRole
}

/**
 * Get all members for an organization
 */
export async function getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  // Check permissions
  const role = await getUserOrgRole(organizationId)
  if (!canManageMembers(role)) {
    throw new Error('Insufficient permissions to view organization members')
  }

  const { data, error } = await supabase.from('organization_members').select('*').eq('organization_id', organizationId)

  if (error) {
    throw new Error(`Failed to fetch organization members: ${error.message}`)
  }

  const rows = extractArray(data, error) as OrganizationMemberRow[]
  return rows.map((row) => ({
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    role: row.role,
    invitedBy: row.invited_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

/**
 * Get a single organization member
 */
export async function getOrganizationMember(
  organizationId: string,
  userId: string,
): Promise<OrganizationMember | null> {
  // Check permissions
  const role = await getUserOrgRole(organizationId)
  if (!canManageMembers(role)) {
    throw new Error('Insufficient permissions to view organization members')
  }

  const { data, error } = await supabase
    .from('organization_members')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch organization member: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as OrganizationMemberRow
  return {
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    role: row.role,
    invitedBy: row.invited_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Add a member to an organization
 */
export async function createOrganizationMember(input: CreateOrganizationMemberInput): Promise<OrganizationMember> {
  // Check permissions
  const role = await getUserOrgRole(input.organizationId)
  if (!canManageMembers(role)) {
    throw new Error('Insufficient permissions to add organization members')
  }

  // Get current user
  const { data: session } = await supabase.auth.getSession()
  if (!session.session?.user?.id) {
    throw new Error('User not authenticated')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('organization_members') as any)
    .insert({
      organization_id: input.organizationId,
      user_id: input.userId,
      role: input.role,
      invited_by: session.session.user.id,
    } as OrganizationMemberInsert)
    .select()
    .single()) as { data: OrganizationMemberRow | null; error: { message: string; code?: string } | null }

  if (error) {
    if (isSupabaseError(error) && error.code === '23505') {
      // Unique constraint violation
      throw new Error('User is already a member of this organization')
    }
    throw new Error(`Failed to add organization member: ${error.message}`)
  }

  const row = data as OrganizationMemberRow
  return {
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    role: row.role,
    invitedBy: row.invited_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Update an organization member's role
 */
export async function updateOrganizationMember(
  organizationId: string,
  userId: string,
  input: UpdateOrganizationMemberInput,
): Promise<OrganizationMember> {
  // Check permissions
  const role = await getUserOrgRole(organizationId)
  if (!canManageMembers(role)) {
    throw new Error('Insufficient permissions to update organization members')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('organization_members') as any)
    .update({
      role: input.role,
      updated_at: new Date().toISOString(),
    } as OrganizationMemberUpdate)
    .eq('organization_id', organizationId)
    .eq('user_id', userId)
    .select()
    .single()) as { data: OrganizationMemberRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to update organization member: ${error.message}`)
  }

  const row = data as OrganizationMemberRow
  return {
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    role: row.role,
    invitedBy: row.invited_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Remove a member from an organization
 */
export async function deleteOrganizationMember(organizationId: string, userId: string): Promise<void> {
  // Check permissions
  const role = await getUserOrgRole(organizationId)
  if (!canManageMembers(role)) {
    throw new Error('Insufficient permissions to remove organization members')
  }

  const { error } = await supabase
    .from('organization_members')
    .delete()
    .eq('organization_id', organizationId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to remove organization member: ${error.message}`)
  }
}
