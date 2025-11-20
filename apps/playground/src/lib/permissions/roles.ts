/**
 * Role definitions and constants
 */

import type { OrgRole } from '@/lib/supabase/types'

export const ORG_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const satisfies Record<string, OrgRole>

export type { OrgRole }

/**
 * Check if a role has admin permissions
 */
export function isAdmin(role: OrgRole | null | undefined): boolean {
  return role === ORG_ROLES.ADMIN
}

/**
 * Check if a role has editor or admin permissions
 */
export function isEditorOrAdmin(role: OrgRole | null | undefined): boolean {
  return role === ORG_ROLES.EDITOR || role === ORG_ROLES.ADMIN
}

/**
 * Check if a role has viewer permissions or higher
 */
export function hasViewAccess(role: OrgRole | null | undefined): boolean {
  return role !== null && role !== undefined
}
