/**
 * API for managing design tokens
 */

import type { Database } from '@/lib/supabase/database.types'
import type { CreateDesignTokenInput, DesignToken } from '@/types'
import { canCreateToken, canDeleteToken } from '@/lib/permissions/ability'
import { getUserOrgRole } from '@/lib/permissions/use-permissions'
import { supabase } from '@/lib/supabase/client'
import { extractArray } from '@/lib/supabase/helpers'

type DesignTokenRow = Database['public']['Tables']['design_tokens']['Row']
type DesignTokenInsert = Database['public']['Tables']['design_tokens']['Insert']

/**
 * Get all tokens for a library
 */
export async function getTokens(libraryId: string): Promise<DesignToken[]> {
  const { data, error } = await supabase
    .from('design_tokens')
    .select('*')
    .eq('library_id', libraryId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch tokens: ${error.message}`)
  }

  const rows = extractArray(data, error) as DesignTokenRow[]
  return rows.map((row) => {
    const token: DesignToken = {
      id: row.id,
      libraryId: row.library_id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }

    if (row.$type !== null) {
      token.$type = row.$type as NonNullable<DesignToken['$type']>
    }

    if (row.$description !== null) {
      token.$description = row.$description
    }

    return token
  })
}

/**
 * Get a single token by ID
 */
export async function getToken(id: string): Promise<DesignToken | null> {
  const { data, error } = await supabase.from('design_tokens').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch token: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as DesignTokenRow
  const token: DesignToken = {
    id: row.id,
    libraryId: row.library_id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row['$type'] !== null) {
    token.$type = row['$type'] as NonNullable<DesignToken['$type']>
  }

  if (row['$description'] !== null) {
    token.$description = row['$description']
  }

  return token
}

/**
 * Create a new token
 */
export async function createToken(input: CreateDesignTokenInput): Promise<DesignToken> {
  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', input.libraryId)
    .single()

  if (!library) {
    throw new Error(`Library with id ${input.libraryId} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canCreateToken(role)) {
    throw new Error('Insufficient permissions to create token')
  }

  // Validate token name (DTCG spec: no $, {, }, . characters)
  if (input.name.includes('$') || input.name.includes('{') || input.name.includes('}') || input.name.includes('.')) {
    throw new Error('Token name cannot contain $, {, }, or . characters')
  }

  // Check for duplicate name in the same library
  const { data: existingToken } = await supabase
    .from('design_tokens')
    .select('id')
    .eq('library_id', input.libraryId)
    .eq('name', input.name)
    .maybeSingle()

  if (existingToken) {
    throw new Error(`Token with name "${input.name}" already exists in this library`)
  }

  const now = new Date().toISOString()

  const insertData: Record<string, unknown> = {
    library_id: input.libraryId,
    name: input.name,
    created_at: now,
    updated_at: now,
  }

  if (input.$type !== undefined) {
    insertData['$type'] = input.$type
  }

  if (input.$description !== undefined) {
    insertData['$description'] = input.$description
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('design_tokens') as any)
    .insert(insertData as DesignTokenInsert)
    .select()
    .single()) as { data: DesignTokenRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to create token: ${error.message}`)
  }

  const row = data as DesignTokenRow
  const createdToken: DesignToken = {
    id: row.id,
    libraryId: row.library_id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row['$type'] !== null) {
    createdToken.$type = row['$type'] as NonNullable<DesignToken['$type']>
  }

  if (row['$description'] !== null) {
    createdToken.$description = row['$description']
  }

  return createdToken
}

/**
 * Delete a token
 */
export async function deleteToken(id: string): Promise<void> {
  // Get token to check library and organization
  const token = await getToken(id)
  if (!token) {
    throw new Error(`Token with id ${id} not found`)
  }

  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', token.libraryId)
    .single()

  if (!library) {
    throw new Error(`Library with id ${token.libraryId} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canDeleteToken(role)) {
    throw new Error('Insufficient permissions to delete token')
  }

  // Delete token (cascade will handle token_values if foreign keys are set up)
  const { error } = await supabase.from('design_tokens').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete token: ${error.message}`)
  }
}
