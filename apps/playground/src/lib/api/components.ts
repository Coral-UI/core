/**
 * API for managing components
 */

import type { Database } from '@/lib/supabase/database.types'
import type { Component, CreateComponentInput, UpdateComponentInput } from '@/types'
import { canCreateComponent, canDeleteComponent, canUpdateComponent } from '@/lib/permissions/ability'
import { getUserOrgRole } from '@/lib/permissions/use-permissions'
import { supabase } from '@/lib/supabase/client'
import { extractArray } from '@/lib/supabase/helpers'

import type { CoralRootNode } from '@reallygoodwork/coral-core'

type ComponentRow = Database['public']['Tables']['components']['Row']
type ComponentInsert = Database['public']['Tables']['components']['Insert']
type ComponentUpdate = Database['public']['Tables']['components']['Update']

/**
 * Get all components for a library
 */
export async function getComponents(libraryId: string): Promise<Component[]> {
  const { data, error } = await supabase
    .from('components')
    .select('*')
    .eq('library_id', libraryId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch components: ${error.message}`)
  }

  const rows = extractArray(data, error) as ComponentRow[]
  return rows.map((row) => {
    const comp: Component = {
      id: row.id,
      libraryId: row.library_id,
      name: row.name,
      spec: row.spec as CoralRootNode,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }

    if (row['description'] !== null) {
      comp.description = row['description']
    }

    if (row.accessibility !== null) {
      comp.accessibility = row.accessibility as unknown as NonNullable<Component['accessibility']>
    }

    return comp
  })
}

/**
 * Get a single component by ID
 */
export async function getComponent(id: string): Promise<Component | null> {
  const { data, error } = await supabase.from('components').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch component: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as ComponentRow
  const comp: Component = {
    id: row.id,
    libraryId: row.library_id,
    name: row['name'],
    spec: row.spec as CoralRootNode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row['description'] !== null) {
    comp.description = row['description']
  }

  if (row.accessibility !== null) {
    comp.accessibility = row.accessibility as unknown as NonNullable<Component['accessibility']>
  }

  return comp
}

/**
 * Create a new component
 */
export async function createComponent(input: CreateComponentInput): Promise<Component> {
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
  if (!canCreateComponent(role)) {
    throw new Error('Insufficient permissions to create component')
  }

  const now = new Date().toISOString()

  const insertData: Record<string, unknown> = {
    library_id: input.libraryId,
    name: input.name,
    spec: input.spec as unknown,
    created_at: now,
    updated_at: now,
  }

  if (input.description !== undefined) {
    insertData['description'] = input.description
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('components') as any)
    .insert(insertData as ComponentInsert)
    .select()
    .single()) as { data: ComponentRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to create component: ${error.message}`)
  }

  const row = data as ComponentRow
  const createdComp: Component = {
    id: row.id,
    libraryId: row.library_id,
    name: row['name'],
    spec: row.spec as CoralRootNode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row['description'] !== null) {
    createdComp.description = row['description']
  }

  if (row.accessibility !== null) {
    createdComp.accessibility = row.accessibility as unknown as NonNullable<Component['accessibility']>
  }

  return createdComp
}

/**
 * Update a component
 */
export async function updateComponent(id: string, input: UpdateComponentInput): Promise<Component> {
  // Get component to check library and organization
  const component = await getComponent(id)
  if (!component) {
    throw new Error(`Component with id ${id} not found`)
  }

  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', component.libraryId)
    .single()

  if (!library) {
    throw new Error(`Library with id ${component.libraryId} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canUpdateComponent(role)) {
    throw new Error('Insufficient permissions to update component')
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

  if (input.spec !== undefined) {
    updateData['spec'] = input.spec as unknown
  }

  if (input.accessibility !== undefined) {
    updateData['accessibility'] = input.accessibility as unknown
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('components') as any)
    .update(updateData as ComponentUpdate)
    .eq('id', id)
    .select()
    .single()) as { data: ComponentRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to update component: ${error.message}`)
  }

  const row = data as ComponentRow
  const updatedComp: Component = {
    id: row.id,
    libraryId: row.library_id,
    name: row['name'],
    spec: row.spec as CoralRootNode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row['description'] !== null) {
    updatedComp.description = row['description']
  }

  if (row.accessibility !== null) {
    updatedComp.accessibility = row.accessibility as unknown as NonNullable<Component['accessibility']>
  }

  return updatedComp
}

/**
 * Delete a component
 */
export async function deleteComponent(id: string): Promise<void> {
  // Get component to check library and organization
  const component = await getComponent(id)
  if (!component) {
    throw new Error(`Component with id ${id} not found`)
  }

  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', component.libraryId)
    .single()

  if (!library) {
    throw new Error(`Library with id ${component.libraryId} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canDeleteComponent(role)) {
    throw new Error('Insufficient permissions to delete component')
  }

  const { error } = await supabase.from('components').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete component: ${error.message}`)
  }
}
