/**
 * Server-side permissions helpers
 * Uses server Supabase client for SSR
 */

import { createClient } from '@/lib/supabase/server'
import type { OrgRole } from './roles'

/**
 * Get user's role in an organization (server-side)
 */
export async function getUserOrgRoleServer(organizationId: string): Promise<OrgRole | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return null
  }

  const { data, error } = await supabase
    .rpc('get_user_org_role', { org_id: organizationId })
    .single()

  if (error) {
    // If function doesn't exist yet, fallback to querying organization_members
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
