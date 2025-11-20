'use server'

import type { Database } from '@/lib/supabase/database.types'
import type { CreateLibraryInput, Library, UpdateLibraryInput } from '@/types'
import { canCreateLibrary, canDeleteLibrary, canUpdateLibrary } from '@/lib/permissions/ability'
import { getUserOrgRoleServer } from '@/lib/permissions/server-permissions'
import { createClient } from '@/lib/supabase/server'
import { compressCss } from '@/lib/utils/css-compression'

type LibraryRow = Database['public']['Tables']['libraries']['Row']
type LibraryInsert = Database['public']['Tables']['libraries']['Insert']
type LibraryUpdate = Database['public']['Tables']['libraries']['Update']

/**
 * Create a new library (server action)
 */
export async function createLibraryAction(input: CreateLibraryInput): Promise<Library> {
  const supabase = await createClient()

  // Check permissions
  const role = await getUserOrgRoleServer(input.organizationId)
  if (!canCreateLibrary(role)) {
    throw new Error('Insufficient permissions to create library')
  }

  // Verify organization exists
  const { data: org } = await supabase.from('organizations').select('id').eq('id', input.organizationId).single()

  if (!org) {
    throw new Error(`Organization with id ${input.organizationId} not found`)
  }

  const now = new Date().toISOString()

  const insertData: LibraryInsert = {
    organization_id: input.organizationId,
    name: input.name,
    created_at: now,
    updated_at: now,
    ...(input.description !== undefined && { description: input.description }),
  }

  const { data, error } = await supabase
    .from('libraries')
    // @ts-expect-error - Supabase type inference issue with Database generic, but types are correct at runtime
    .insert(insertData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create library: ${error.message}`)
  }

  const row = data as LibraryRow
  const library: Library = {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row.description !== null) {
    library.description = row.description
  }

  if (row.css_reset !== null) {
    library.cssReset = row.css_reset
  }

  return library
}

/**
 * Update a library (server action)
 */
export async function updateLibraryAction(id: string, input: UpdateLibraryInput): Promise<Library> {
  const supabase = await createClient()

  // Get library to check organization
  const { data: libraryDataRaw } = await supabase.from('libraries').select('organization_id').eq('id', id).single()

  if (!libraryDataRaw) {
    throw new Error(`Library with id ${id} not found`)
  }

  const libraryData = libraryDataRaw as { organization_id: string }

  // Check permissions
  const role = await getUserOrgRoleServer(libraryData.organization_id)
  if (!canUpdateLibrary(role)) {
    throw new Error('Insufficient permissions to update library')
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (input.name !== undefined) {
    updateData['name'] = input.name
  }

  if (input.description !== undefined) {
    updateData['description'] = input.description
  }

  if (input.cssReset !== undefined) {
    updateData['css_reset'] = input.cssReset
  }

  const { data, error } = await supabase
    .from('libraries')
    // @ts-expect-error - Supabase type inference issue with Database generic, but types are correct at runtime
    .update(updateData as LibraryUpdate)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update library: ${error.message}`)
  }

  const row = data as LibraryRow
  const updatedLibrary: Library = {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row.description !== null) {
    updatedLibrary.description = row.description
  }

  if (row.css_reset !== null) {
    updatedLibrary.cssReset = row.css_reset
  }

  return updatedLibrary
}

/**
 * Update CSS reset for a library (server action)
 */
export async function updateLibraryCssResetAction(libraryId: string, css: string): Promise<Library> {
  const compressed = compressCss(css)
  return updateLibraryAction(libraryId, { cssReset: compressed })
}

/**
 * Delete a library (server action)
 */
export async function deleteLibraryAction(id: string): Promise<void> {
  const supabase = await createClient()

  // Get library to check organization
  const { data: libraryDataRaw } = await supabase.from('libraries').select('organization_id').eq('id', id).single()

  if (!libraryDataRaw) {
    throw new Error(`Library with id ${id} not found`)
  }

  const libraryData = libraryDataRaw as { organization_id: string }

  // Check permissions
  const role = await getUserOrgRoleServer(libraryData.organization_id)
  if (!canDeleteLibrary(role)) {
    throw new Error('Insufficient permissions to delete library')
  }

  const { error } = await supabase.from('libraries').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete library: ${error.message}`)
  }
}
