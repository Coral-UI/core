/**
 * API for managing organizations
 */

import type { Database } from '@/lib/supabase/database.types'
import type { CreateOrganizationInput, Organization, UpdateOrganizationInput } from '@/types'
import { canManageOrganization } from '@/lib/permissions/ability'
import { getUserOrgRole } from '@/lib/permissions/use-permissions'
import { supabase } from '@/lib/supabase/client'
import { extractArray } from '@/lib/supabase/helpers'

type OrganizationRow = Database['public']['Tables']['organizations']['Row']
type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
type OrganizationUpdate = Database['public']['Tables']['organizations']['Update']
type OrganizationMemberRow = Database['public']['Tables']['organization_members']['Row']

/**
 * Get all organizations for the current user
 */
export async function getOrganizations(): Promise<Organization[]> {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const userId = session.session.user.id

  // Get organizations where user is creator
  const { data: createdOrgs, error: createdError } = await supabase
    .from('organizations')
    .select('*')
    .eq('created_by', userId)

  if (createdError) {
    throw new Error(`Failed to fetch organizations: ${createdError.message}`)
  }

  // Get organization IDs where user is a member
  const { data: memberRows, error: memberError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId)

  if (memberError) {
    throw new Error(`Failed to fetch organization members: ${memberError.message}`)
  }

  const memberRowsArray = extractArray(memberRows, null) as OrganizationMemberRow[]
  const memberOrgIds = memberRowsArray.map((row) => row.organization_id)

  // Get member organizations
  let memberOrgs: Organization[] = []
  if (memberOrgIds.length > 0) {
    const { data: memberOrgsData, error: memberOrgsError } = await supabase
      .from('organizations')
      .select('*')
      .in('id', memberOrgIds)

    if (memberOrgsError) {
      throw new Error(`Failed to fetch member organizations: ${memberOrgsError.message}`)
    }

    const memberOrgsRows = extractArray(memberOrgsData, null) as OrganizationRow[]
    memberOrgs = memberOrgsRows.map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  }

  // Combine both lists, deduplicate by id
  const orgMap = new Map<string, Organization>()

  // Add created organizations
  const createdOrgsRows = extractArray(createdOrgs, null) as OrganizationRow[]
  createdOrgsRows.forEach((row) => {
    orgMap.set(row.id, {
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
  })

  // Add member organizations
  memberOrgs.forEach((org) => {
    if (!orgMap.has(org.id)) {
      orgMap.set(org.id, org)
    }
  })

  return Array.from(orgMap.values())
}

/**
 * Get a single organization by ID
 */
export async function getOrganization(id: string): Promise<Organization | null> {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session?.user?.id) {
    throw new Error('User not authenticated')
  }

  // Get organization
  const { data, error } = await supabase.from('organizations').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch organization: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as OrganizationRow

  // Check if user has access (created by or member)
  const userId = session.session.user.id
  const isCreator = row.created_by === userId

  if (!isCreator) {
    // Check if user is a member
    const { data: member } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', id)
      .eq('user_id', userId)
      .maybeSingle()

    if (!member) {
      // User doesn't have access
      return null
    }
  }

  return {
    id: row.id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Create a new organization
 */
export async function createOrganization(input: CreateOrganizationInput): Promise<Organization> {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session?.user?.id) {
    throw new Error('User not authenticated')
  }

  // Try using the database function first (if it exists)
  // This bypasses RLS issues by using SECURITY DEFINER
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: orgId, error: functionError } = (await (supabase.rpc as any)('create_organization_with_creator', {
    org_name: input.name,
    creator_user_id: session.session.user.id,
  })) as { data: string | null; error: { message: string } | null }

  if (!functionError && orgId) {
    // Function succeeded, fetch the created organization
    const org = await getOrganization(orgId)
    if (!org) {
      throw new Error('Failed to fetch created organization')
    }
    return org
  }

  // Fallback to direct insert if function doesn't exist or fails
  // This will work once the RLS policies are correctly configured
  const now = new Date().toISOString()

  // Create organization
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: orgData, error: orgError } = (await (supabase.from('organizations') as any)
    .insert({
      name: input.name,
      created_by: session.session.user.id,
      created_at: now,
      updated_at: now,
    } as OrganizationInsert)
    .select()
    .single()) as { data: OrganizationRow | null; error: { message: string } | null }

  if (orgError) {
    throw new Error(`Failed to create organization: ${orgError.message}`)
  }

  const orgRow = orgData as OrganizationRow

  // Automatically add creator as admin member
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: memberError } = (await (supabase.from('organization_members') as any).insert({
    organization_id: orgRow.id,
    user_id: session.session.user.id,
    role: 'admin',
    invited_by: session.session.user.id,
    created_at: now,
    updated_at: now,
  })) as { error: { message: string } | null }

  if (memberError) {
    // If member creation fails, try to clean up organization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('organizations') as any).delete().eq('id', orgRow.id)
    throw new Error(`Failed to create organization member: ${memberError.message}`)
  }

  return {
    id: orgRow.id,
    name: orgRow['name'],
    createdAt: orgRow.created_at,
    updatedAt: orgRow.updated_at,
  }
}

/**
 * Update an organization
 */
export async function updateOrganization(id: string, input: UpdateOrganizationInput): Promise<Organization> {
  // Check permissions
  const role = await getUserOrgRole(id)
  if (!canManageOrganization(role)) {
    throw new Error('Insufficient permissions to update organization')
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (input.name !== undefined) {
    updateData['name'] = input.name
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('organizations') as any)
    .update(updateData as OrganizationUpdate)
    .eq('id', id)
    .select()
    .single()) as { data: OrganizationRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to update organization: ${error.message}`)
  }

  const row = data as OrganizationRow
  return {
    id: row.id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Delete an organization
 */
export async function deleteOrganization(id: string): Promise<void> {
  // Check permissions
  const role = await getUserOrgRole(id)
  if (!canManageOrganization(role)) {
    throw new Error('Insufficient permissions to delete organization')
  }

  // Delete organization (cascade will handle related records if foreign keys are set up)
  const { error } = await supabase.from('organizations').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete organization: ${error.message}`)
  }
}
