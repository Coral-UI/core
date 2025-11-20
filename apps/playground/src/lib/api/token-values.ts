/**
 * API for managing token values
 */

import type { Database } from '@/lib/supabase/database.types'
import type { CreateTokenValueInput, TokenValue, UpdateTokenValueInput } from '@/types'
import { canCreateToken, canDeleteToken, canUpdateToken } from '@/lib/permissions/ability'
import { getUserOrgRole } from '@/lib/permissions/use-permissions'
import { supabase } from '@/lib/supabase/client'
import { extractArray } from '@/lib/supabase/helpers'

type TokenValueRow = Database['public']['Tables']['token_values']['Row']
type TokenValueInsert = Database['public']['Tables']['token_values']['Insert']
type TokenValueUpdate = Database['public']['Tables']['token_values']['Update']
type DesignTokenRow = Database['public']['Tables']['design_tokens']['Row']

/**
 * Get all token values for a token
 */
export async function getTokenValues(tokenId: string): Promise<TokenValue[]> {
  const { data, error } = await supabase
    .from('token_values')
    .select('*')
    .eq('token_id', tokenId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch token values: ${error.message}`)
  }

  const rows = extractArray(data, error) as TokenValueRow[]
  return rows.map((row) => ({
    id: row.id,
    tokenId: row.token_id,
    themeOptionId: row.theme_option_id,
    $value: row.$value as string | number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

/**
 * Get token value for a specific token and theme option
 */
export async function getTokenValue(tokenId: string, themeOptionId: string): Promise<TokenValue | null> {
  const { data, error } = await supabase
    .from('token_values')
    .select('*')
    .eq('token_id', tokenId)
    .eq('theme_option_id', themeOptionId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch token value: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as TokenValueRow
  return {
    id: row.id,
    tokenId: row.token_id,
    themeOptionId: row.theme_option_id,
    $value: row.$value as string | number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Get all token values for a library (useful for bulk operations)
 */
export async function getTokenValuesForLibrary(libraryId: string): Promise<TokenValue[]> {
  // Get all tokens for the library
  const { data: tokens } = await supabase.from('design_tokens').select('id').eq('library_id', libraryId)

  if (!tokens || tokens.length === 0) {
    return []
  }

  const tokenRows = extractArray(tokens, null) as DesignTokenRow[]
  const tokenIds = tokenRows.map((token) => token.id)

  const { data, error } = await supabase
    .from('token_values')
    .select('*')
    .in('token_id', tokenIds)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch token values for library: ${error.message}`)
  }

  const rows = extractArray(data, error) as TokenValueRow[]
  return rows.map((row) => ({
    id: row.id,
    tokenId: row.token_id,
    themeOptionId: row.theme_option_id,
    $value: row.$value as string | number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

/**
 * Set or update a token value for a theme option
 */
export async function setTokenValue(input: CreateTokenValueInput): Promise<TokenValue> {
  // Get token to check library and organization
  const { data: token } = await supabase.from('design_tokens').select('library_id').eq('id', input.tokenId).single()

  if (!token) {
    throw new Error(`Token with id ${input.tokenId} not found`)
  }

  type TokenSelect = { library_id: string }
  const tokenRow = token as TokenSelect

  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', tokenRow.library_id)
    .single()

  if (!library) {
    throw new Error(`Library with id ${tokenRow.library_id} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canCreateToken(role)) {
    throw new Error('Insufficient permissions to set token value')
  }

  // Verify theme option exists
  const { data: themeOption } = await supabase.from('theme_options').select('id').eq('id', input.themeOptionId).single()

  if (!themeOption) {
    throw new Error(`Theme option with id ${input.themeOptionId} not found`)
  }

  // Type assertion not needed here, just checking existence

  // Check if value already exists
  const existingValue = await getTokenValue(input.tokenId, input.themeOptionId)

  const now = new Date().toISOString()

  if (existingValue) {
    // Update existing value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = (await (supabase.from('token_values') as any)
      .update({
        $value: input.$value as unknown,
        updated_at: now,
      } as TokenValueUpdate)
      .eq('id', existingValue.id)
      .select()
      .single()) as { data: TokenValueRow | null; error: { message: string } | null }

    if (error) {
      throw new Error(`Failed to update token value: ${error.message}`)
    }

    const row = data as TokenValueRow
    return {
      id: row.id,
      tokenId: row.token_id,
      themeOptionId: row.theme_option_id,
      $value: row.$value as string | number,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  } else {
    // Create new value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = (await (supabase.from('token_values') as any)
      .insert({
        token_id: input.tokenId,
        theme_option_id: input.themeOptionId,
        $value: input.$value as unknown,
        created_at: now,
        updated_at: now,
      } as TokenValueInsert)
      .select()
      .single()) as { data: TokenValueRow | null; error: { message: string } | null }

    if (error) {
      throw new Error(`Failed to create token value: ${error.message}`)
    }

    const row = data as TokenValueRow
    return {
      id: row.id,
      tokenId: row.token_id,
      themeOptionId: row.theme_option_id,
      $value: row.$value as string | number,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }
}

/**
 * Update a token value
 */
export async function updateTokenValue(id: string, input: UpdateTokenValueInput): Promise<TokenValue> {
  // Get token value to check token, library, and organization
  const tokenValue = await getTokenValueById(id)
  if (!tokenValue) {
    throw new Error(`Token value with id ${id} not found`)
  }

  // Get token to check library and organization
  const { data: token } = await supabase
    .from('design_tokens')
    .select('library_id')
    .eq('id', tokenValue.tokenId)
    .single()

  if (!token) {
    throw new Error(`Token with id ${tokenValue.tokenId} not found`)
  }

  type TokenSelect = { library_id: string }
  const tokenRow = token as TokenSelect

  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', tokenRow.library_id)
    .single()

  if (!library) {
    throw new Error(`Library with id ${tokenRow.library_id} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canUpdateToken(role)) {
    throw new Error('Insufficient permissions to update token value')
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (input.$value !== undefined) {
    updateData['$value'] = input.$value as unknown
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('token_values') as any)
    .update(updateData as TokenValueUpdate)
    .eq('id', id)
    .select()
    .single()) as { data: TokenValueRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to update token value: ${error.message}`)
  }

  const row = data as TokenValueRow
  return {
    id: row.id,
    tokenId: row.token_id,
    themeOptionId: row.theme_option_id,
    $value: row.$value as string | number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Delete a token value
 */
export async function deleteTokenValue(id: string): Promise<void> {
  // Get token value to check token, library, and organization
  const tokenValue = await getTokenValueById(id)
  if (!tokenValue) {
    throw new Error(`Token value with id ${id} not found`)
  }

  // Get token to check library and organization
  const { data: token } = await supabase
    .from('design_tokens')
    .select('library_id')
    .eq('id', tokenValue.tokenId)
    .single()

  if (!token) {
    throw new Error(`Token with id ${tokenValue.tokenId} not found`)
  }

  type TokenSelect = { library_id: string }
  const tokenRow = token as TokenSelect

  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', tokenRow.library_id)
    .single()

  if (!library) {
    throw new Error(`Library with id ${tokenRow.library_id} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canDeleteToken(role)) {
    throw new Error('Insufficient permissions to delete token value')
  }

  const { error } = await supabase.from('token_values').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete token value: ${error.message}`)
  }
}

/**
 * Helper function to get token value by ID
 */
async function getTokenValueById(id: string): Promise<TokenValue | null> {
  const { data, error } = await supabase.from('token_values').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch token value: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as TokenValueRow
  return {
    id: row.id,
    tokenId: row.token_id,
    themeOptionId: row.theme_option_id,
    $value: row.$value as string | number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
