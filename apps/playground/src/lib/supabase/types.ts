/**
 * Custom types and type helpers for Supabase
 */

import type { Database } from './database.types'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Table-specific types
export type OrganizationRow = Tables<'organizations'>
export type OrganizationInsert = Inserts<'organizations'>
export type OrganizationUpdate = Updates<'organizations'>

export type OrganizationMemberRow = Tables<'organization_members'>
export type OrganizationMemberInsert = Inserts<'organization_members'>
export type OrganizationMemberUpdate = Updates<'organization_members'>

export type LibraryRow = Tables<'libraries'>
export type LibraryInsert = Inserts<'libraries'>
export type LibraryUpdate = Updates<'libraries'>

export type ComponentRow = Tables<'components'>
export type ComponentInsert = Inserts<'components'>
export type ComponentUpdate = Updates<'components'>

export type DesignTokenRow = Tables<'design_tokens'>
export type DesignTokenInsert = Inserts<'design_tokens'>
export type DesignTokenUpdate = Updates<'design_tokens'>

export type ThemeRow = Tables<'themes'>
export type ThemeInsert = Inserts<'themes'>
export type ThemeUpdate = Updates<'themes'>

export type ThemeOptionRow = Tables<'theme_options'>
export type ThemeOptionInsert = Inserts<'theme_options'>
export type ThemeOptionUpdate = Updates<'theme_options'>

export type TokenValueRow = Tables<'token_values'>
export type TokenValueInsert = Inserts<'token_values'>
export type TokenValueUpdate = Updates<'token_values'>

// Re-export OrgRole from database types
export type { OrgRole } from './database.types'

/**
 * Type guard to check if a value is a valid OrgRole
 */
export function isOrgRole(value: unknown): value is OrgRole {
  return typeof value === 'string' && ['admin', 'editor', 'viewer'].includes(value)
}

/**
 * Helper type to extract array element type
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never

/**
 * Helper type for non-nullable values
 */
export type NonNullable<T> = T extends null | undefined ? never : T
