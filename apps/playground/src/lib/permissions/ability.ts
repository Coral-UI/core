/**
 * Permission checking utilities
 *
 * All functions are strictly typed with no use of 'any'
 */

import type { OrgRole } from '@/lib/supabase/types'

import { isAdmin, isEditorOrAdmin, hasViewAccess } from './roles'

/**
 * Check if user can create organizations
 * Any authenticated user can create an organization
 */
export function canCreateOrganization(): boolean {
  return true // Any authenticated user can create an org
}

/**
 * Check if user can manage organization (update/delete)
 */
export function canManageOrganization(role: OrgRole | null | undefined): boolean {
  return isAdmin(role)
}

/**
 * Check if user can create libraries
 */
export function canCreateLibrary(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}

/**
 * Check if user can update libraries
 */
export function canUpdateLibrary(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}

/**
 * Check if user can delete libraries
 */
export function canDeleteLibrary(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}

/**
 * Check if user can create components
 */
export function canCreateComponent(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}

/**
 * Check if user can update components
 */
export function canUpdateComponent(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}

/**
 * Check if user can delete components
 */
export function canDeleteComponent(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}

/**
 * Check if user can view organization data
 */
export function canViewOrganization(role: OrgRole | null | undefined): boolean {
  return hasViewAccess(role)
}

/**
 * Check if user can manage organization members (invite, update roles, remove)
 */
export function canManageMembers(role: OrgRole | null | undefined): boolean {
  return isAdmin(role)
}

/**
 * Check if user can create design tokens
 */
export function canCreateToken(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}

/**
 * Check if user can update design tokens
 */
export function canUpdateToken(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}

/**
 * Check if user can delete design tokens
 */
export function canDeleteToken(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}

/**
 * Check if user can create themes
 */
export function canCreateTheme(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}

/**
 * Check if user can update themes
 */
export function canUpdateTheme(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}

/**
 * Check if user can delete themes
 */
export function canDeleteTheme(role: OrgRole | null | undefined): boolean {
  return isEditorOrAdmin(role)
}
