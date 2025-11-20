/**
 * Hook for checking user permissions for an organization
 */

import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase/client'

import * as ability from './ability'
import type { OrgRole } from './roles'

interface UsePermissionsResult {
  role: OrgRole | null | undefined
  isLoading: boolean
  canCreateLibrary: boolean
  canUpdateLibrary: boolean
  canDeleteLibrary: boolean
  canCreateComponent: boolean
  canUpdateComponent: boolean
  canDeleteComponent: boolean
  canViewOrganization: boolean
  canManageMembers: boolean
  canManageOrganization: boolean
  canCreateToken: boolean
  canUpdateToken: boolean
  canDeleteToken: boolean
  canCreateTheme: boolean
  canUpdateTheme: boolean
  canDeleteTheme: boolean
}

/**
 * Get user's role in an organization
 */
export async function getUserOrgRole(organizationId: string): Promise<OrgRole | null> {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session?.user?.id) {
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
      .eq('user_id', session.session.user.id)
      .maybeSingle()

    return (member?.role as OrgRole) ?? null
  }

  return (data as OrgRole) ?? null
}

/**
 * Hook to check user permissions for an organization
 */
export function usePermissions(organizationId: string | null | undefined): UsePermissionsResult {
  const { data: role, isLoading } = useQuery({
    queryKey: ['organization-role', organizationId],
    queryFn: () => (organizationId ? getUserOrgRole(organizationId) : Promise.resolve(null)),
    enabled: !!organizationId,
  })

  return {
    role,
    isLoading,
    canCreateLibrary: ability.canCreateLibrary(role),
    canUpdateLibrary: ability.canUpdateLibrary(role),
    canDeleteLibrary: ability.canDeleteLibrary(role),
    canCreateComponent: ability.canCreateComponent(role),
    canUpdateComponent: ability.canUpdateComponent(role),
    canDeleteComponent: ability.canDeleteComponent(role),
    canViewOrganization: ability.canViewOrganization(role),
    canManageMembers: ability.canManageMembers(role),
    canManageOrganization: ability.canManageOrganization(role),
    canCreateToken: ability.canCreateToken(role),
    canUpdateToken: ability.canUpdateToken(role),
    canDeleteToken: ability.canDeleteToken(role),
    canCreateTheme: ability.canCreateTheme(role),
    canUpdateTheme: ability.canUpdateTheme(role),
    canDeleteTheme: ability.canDeleteTheme(role),
  }
}
