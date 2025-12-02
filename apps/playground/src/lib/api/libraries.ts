/**
 * API for managing libraries
 */

import type { Database } from '@/lib/supabase/database.types'
import type { CreateLibraryInput, Library, UpdateLibraryInput } from '@/types'
import { canCreateLibrary, canDeleteLibrary, canUpdateLibrary } from '@/lib/permissions/ability'
import { getUserOrgRole } from '@/lib/permissions/use-permissions'
import { supabase } from '@/lib/supabase/client'
import { extractArray } from '@/lib/supabase/helpers'
import { compressCss, decompressCss } from '@/lib/utils/css-compression'

type LibraryRow = Database['public']['Tables']['libraries']['Row']
type LibraryInsert = Database['public']['Tables']['libraries']['Insert']
type LibraryUpdate = Database['public']['Tables']['libraries']['Update']

/**
 * Get all libraries for an organization
 */
export async function getLibraries(organizationId: string): Promise<Library[]> {
  const { data, error } = await supabase
    .from('libraries')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch libraries: ${error.message}`)
  }

  const rows = extractArray(data, error) as LibraryRow[]
  return rows.map((row) => {
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
  })
}

/**
 * Get a single library by ID
 */
export async function getLibrary(id: string): Promise<Library | null> {
  // Return null early if id is empty or invalid (standalone mode)
  if (!id || id.trim() === '' || id === 'standalone-mode') {
    return null
  }

  const { data, error } = await supabase.from('libraries').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch library: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as LibraryRow
  const library: Library = {
    id: row.id,
    organizationId: row.organization_id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row['description'] !== null) {
    library.description = row['description']
  }

  if (row.css_reset !== null) {
    library.cssReset = row.css_reset
  }

  return library
}

/**
 * Create a new library
 */
export async function createLibrary(input: CreateLibraryInput): Promise<Library> {
  // Check permissions
  const role = await getUserOrgRole(input.organizationId)
  if (!canCreateLibrary(role)) {
    throw new Error('Insufficient permissions to create library')
  }

  // Verify organization exists
  const { data: org } = await supabase.from('organizations').select('id').eq('id', input.organizationId).single()

  if (!org) {
    throw new Error(`Organization with id ${input.organizationId} not found`)
  }

  const now = new Date().toISOString()

  const insertData: Record<string, unknown> = {
    organization_id: input.organizationId,
    name: input.name,
    created_at: now,
    updated_at: now,
  }

  if (input.description !== undefined) {
    insertData['description'] = input.description
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('libraries') as any)
    .insert(insertData as LibraryInsert)
    .select()
    .single()) as { data: LibraryRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to create library: ${error.message}`)
  }

  const row = data as LibraryRow
  const library: Library = {
    id: row.id,
    organizationId: row.organization_id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row['description'] !== null) {
    library.description = row['description']
  }

  if (row.css_reset !== null) {
    library.cssReset = row.css_reset
  }

  return library
}

/**
 * Update a library
 */
export async function updateLibrary(id: string, input: UpdateLibraryInput): Promise<Library> {
  // Get library to check organization
  const library = await getLibrary(id)
  if (!library) {
    throw new Error(`Library with id ${id} not found`)
  }

  // Check permissions
  const role = await getUserOrgRole(library.organizationId)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('libraries') as any)
    .update(updateData as LibraryUpdate)
    .eq('id', id)
    .select()
    .single()) as { data: LibraryRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to update library: ${error.message}`)
  }

  const row = data as LibraryRow
  const updatedLibrary: Library = {
    id: row.id,
    organizationId: row.organization_id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row['description'] !== null) {
    updatedLibrary.description = row['description']
  }

  if (row.css_reset !== null) {
    updatedLibrary.cssReset = row.css_reset
  }

  return updatedLibrary
}

/**
 * Delete a library
 */
export async function deleteLibrary(id: string): Promise<void> {
  // Get library to check organization
  const library = await getLibrary(id)
  if (!library) {
    throw new Error(`Library with id ${id} not found`)
  }

  // Check permissions
  const role = await getUserOrgRole(library.organizationId)
  if (!canDeleteLibrary(role)) {
    throw new Error('Insufficient permissions to delete library')
  }

  // Delete library (cascade will handle components if foreign keys are set up)
  const { error } = await supabase.from('libraries').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete library: ${error.message}`)
  }
}

/**
 * Get CSS reset for a library (decompressed)
 */
export async function getLibraryCssReset(libraryId: string): Promise<string> {
  // Return empty string early if libraryId is empty or invalid (standalone mode)
  if (!libraryId || libraryId.trim() === '' || libraryId === 'standalone-mode') {
    return ''
  }

  const library = await getLibrary(libraryId)
  if (!library || !library.cssReset) {
    return ''
  }
  return decompressCss(library.cssReset)
}

/**
 * Update CSS reset for a library (compresses before saving)
 */
export async function updateLibraryCssReset(libraryId: string, css: string): Promise<Library> {
  const compressed = compressCss(css)
  return updateLibrary(libraryId, { cssReset: compressed })
}
