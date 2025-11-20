'use server'

import type { Database } from '@/lib/supabase/database.types'
import type { CreateDesignTokenInput, DesignToken } from '@/types'
import { canCreateToken, canDeleteToken } from '@/lib/permissions/ability'
import { getUserOrgRoleServer } from '@/lib/permissions/server-permissions'
import { createClient } from '@/lib/supabase/server'

type DesignTokenRow = Database['public']['Tables']['design_tokens']['Row']
type DesignTokenInsert = Database['public']['Tables']['design_tokens']['Insert']

/**
 * Create a new token (server action)
 */
export async function createTokenAction(input: CreateDesignTokenInput): Promise<DesignToken> {
  const supabase = await createClient()

  // Get library to check organization
  const { data: libraryDataRaw } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', input.libraryId)
    .single()

  if (!libraryDataRaw) {
    throw new Error(`Library with id ${input.libraryId} not found`)
  }

  const library = libraryDataRaw as { organization_id: string }

  // Check permissions
  const role = await getUserOrgRoleServer(library.organization_id)
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

  const insertData: DesignTokenInsert = {
    library_id: input.libraryId,
    name: input.name,
    created_at: now,
    updated_at: now,
    ...(input.$type !== undefined && { $type: input.$type }),
    ...(input.$description !== undefined && { $description: input.$description }),
  }

  const { data, error } = await supabase
    .from('design_tokens')
    // @ts-expect-error - Supabase type inference issue with Database generic, but types are correct at runtime
    .insert(insertData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create token: ${error.message}`)
  }

  const row = data as DesignTokenRow
  const createdToken: DesignToken = {
    id: row.id,
    libraryId: row.library_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row.$type !== null) {
    createdToken.$type = row.$type as NonNullable<DesignToken['$type']>
  }

  if (row.$description !== null) {
    createdToken.$description = row.$description
  }

  return createdToken
}

/**
 * Delete a token (server action)
 */
export async function deleteTokenAction(id: string): Promise<void> {
  const supabase = await createClient()

  // Get token to check library and organization
  const { data: tokenDataRaw } = await supabase.from('design_tokens').select('library_id').eq('id', id).single()

  if (!tokenDataRaw) {
    throw new Error(`Token with id ${id} not found`)
  }

  const tokenData = tokenDataRaw as { library_id: string }

  // Get library to check organization
  const { data: libraryDataRaw } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', tokenData.library_id)
    .single()

  if (!libraryDataRaw) {
    throw new Error(`Library with id ${tokenData.library_id} not found`)
  }

  const library = libraryDataRaw as { organization_id: string }

  // Check permissions
  const role = await getUserOrgRoleServer(library.organization_id)
  if (!canDeleteToken(role)) {
    throw new Error('Insufficient permissions to delete token')
  }

  const { error } = await supabase.from('design_tokens').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete token: ${error.message}`)
  }
}
