'use server'

import type { Database } from '@/lib/supabase/database.types'
import type { CreateOrganizationInput, Organization, UpdateOrganizationInput } from '@/types'
import { canManageOrganization } from '@/lib/permissions/ability'
import { getUserOrgRoleServer } from '@/lib/permissions/server-permissions'
import { createClient } from '@/lib/supabase/server'

type OrganizationRow = Database['public']['Tables']['organizations']['Row']
type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
type OrganizationUpdate = Database['public']['Tables']['organizations']['Update']
type OrganizationMemberInsert = Database['public']['Tables']['organization_members']['Insert']

/**
 * Create a new organization (server action)
 */
export async function createOrganizationAction(input: CreateOrganizationInput): Promise<Organization> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    throw new Error('User not authenticated')
  }

  const now = new Date().toISOString()

  const insertData: OrganizationInsert = {
    name: input.name,
    created_by: user.id,
    created_at: now,
    updated_at: now,
  }

  // Create organization
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    // @ts-expect-error - Supabase type inference issue with Database generic, but types are correct at runtime
    .insert(insertData)
    .select()
    .single()

  if (orgError) {
    throw new Error(`Failed to create organization: ${orgError.message}`)
  }

  const orgRow = orgData as OrganizationRow

  // Automatically add creator as admin member
  const memberInsertData: OrganizationMemberInsert = {
    organization_id: orgRow.id,
    user_id: user.id,
    role: 'admin',
    invited_by: user.id,
    created_at: now,
    updated_at: now,
  }

  const { error: memberError } = await supabase
    .from('organization_members')
    // @ts-expect-error - Supabase type inference issue with Database generic, but types are correct at runtime
    .insert(memberInsertData)

  if (memberError) {
    // If member creation fails, try to clean up organization
    await supabase.from('organizations').delete().eq('id', orgRow.id)
    throw new Error(`Failed to create organization member: ${memberError.message}`)
  }

  return {
    id: orgRow.id,
    name: orgRow.name,
    createdAt: orgRow.created_at,
    updatedAt: orgRow.updated_at,
  }
}

/**
 * Update an organization (server action)
 */
export async function updateOrganizationAction(id: string, input: UpdateOrganizationInput): Promise<Organization> {
  const supabase = await createClient()

  // Check permissions
  const role = await getUserOrgRoleServer(id)
  if (!canManageOrganization(role)) {
    throw new Error('Insufficient permissions to update organization')
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (input.name !== undefined) {
    updateData['name'] = input.name
  }

  const { data, error } = await supabase
    .from('organizations')
    // @ts-expect-error - Supabase type inference issue with Database generic, but types are correct at runtime
    .update(updateData as OrganizationUpdate)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update organization: ${error.message}`)
  }

  const row = data as OrganizationRow
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Delete an organization (server action)
 */
export async function deleteOrganizationAction(id: string): Promise<void> {
  const supabase = await createClient()

  // Check permissions
  const role = await getUserOrgRoleServer(id)
  if (!canManageOrganization(role)) {
    throw new Error('Insufficient permissions to delete organization')
  }

  const { error } = await supabase.from('organizations').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete organization: ${error.message}`)
  }
}
