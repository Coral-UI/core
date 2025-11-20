'use server'

import type { Database, Json } from '@/lib/supabase/database.types'
import type { Component, CreateComponentInput, UpdateComponentInput } from '@/types'
import { canCreateComponent, canDeleteComponent, canUpdateComponent } from '@/lib/permissions/ability'
import { getUserOrgRoleServer } from '@/lib/permissions/server-permissions'
import { createClient } from '@/lib/supabase/server'

import type { CoralRootNode } from '@reallygoodwork/coral-core'

type ComponentRow = Database['public']['Tables']['components']['Row']
type ComponentInsert = Database['public']['Tables']['components']['Insert']
type ComponentUpdate = Database['public']['Tables']['components']['Update']

/**
 * Create a new component (server action)
 */
export async function createComponentAction(input: CreateComponentInput): Promise<Component> {
  const supabase = await createClient()

  // Get library to check organization
  const { data: libraryData } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', input.libraryId)
    .single()

  if (!libraryData) {
    throw new Error(`Library with id ${input.libraryId} not found`)
  }

  const library = libraryData as { organization_id: string }

  // Check permissions
  const role = await getUserOrgRoleServer(library.organization_id)
  if (!canCreateComponent(role)) {
    throw new Error('Insufficient permissions to create component')
  }

  const now = new Date().toISOString()

  const insertData: ComponentInsert = {
    library_id: input.libraryId,
    name: input.name,
    spec: input.spec as unknown as Json,
    created_at: now,
    updated_at: now,
    ...(input.description !== undefined && { description: input.description }),
  }

  const { data, error } = await supabase
    .from('components')
    // @ts-expect-error - Supabase type inference issue with Database generic, but types are correct at runtime
    .insert(insertData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create component: ${error.message}`)
  }

  const row = data as ComponentRow
  const createdComp: Component = {
    id: row.id,
    libraryId: row.library_id,
    name: row.name,
    spec: row.spec as CoralRootNode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row.description !== null) {
    createdComp.description = row.description
  }

  if (row.accessibility !== null) {
    createdComp.accessibility = row.accessibility as unknown as NonNullable<Component['accessibility']>
  }

  return createdComp
}

/**
 * Update a component (server action)
 */
export async function updateComponentAction(id: string, input: UpdateComponentInput): Promise<Component> {
  const supabase = await createClient()

  // Get component to check library and organization
  const { data: componentDataRaw } = await supabase.from('components').select('library_id').eq('id', id).single()

  if (!componentDataRaw) {
    throw new Error(`Component with id ${id} not found`)
  }

  const componentData = componentDataRaw as { library_id: string }

  // Get library to check organization
  const { data: libraryData } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', componentData.library_id)
    .single()

  if (!libraryData) {
    throw new Error(`Library with id ${componentData.library_id} not found`)
  }

  const library = libraryData as { organization_id: string }

  // Check permissions
  const role = await getUserOrgRoleServer(library.organization_id)
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

  const { data, error } = await supabase
    .from('components')
    // @ts-expect-error - Supabase type inference issue with Database generic, but types are correct at runtime
    .update(updateData as ComponentUpdate)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update component: ${error.message}`)
  }

  const row = data as ComponentRow
  const updatedComp: Component = {
    id: row.id,
    libraryId: row.library_id,
    name: row.name,
    spec: row.spec as CoralRootNode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row.description !== null) {
    updatedComp.description = row.description
  }

  if (row.accessibility !== null) {
    updatedComp.accessibility = row.accessibility as unknown as NonNullable<Component['accessibility']>
  }

  return updatedComp
}

/**
 * Delete a component (server action)
 */
export async function deleteComponentAction(id: string): Promise<void> {
  const supabase = await createClient()

  // Get component to check library and organization
  const { data: componentDataRaw } = await supabase.from('components').select('library_id').eq('id', id).single()

  if (!componentDataRaw) {
    throw new Error(`Component with id ${id} not found`)
  }

  const componentData = componentDataRaw as { library_id: string }

  // Get library to check organization
  const { data: libraryData } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', componentData.library_id)
    .single()

  if (!libraryData) {
    throw new Error(`Library with id ${componentData.library_id} not found`)
  }

  const library = libraryData as { organization_id: string }

  // Check permissions
  const role = await getUserOrgRoleServer(library.organization_id)
  if (!canDeleteComponent(role)) {
    throw new Error('Insufficient permissions to delete component')
  }

  const { error } = await supabase.from('components').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete component: ${error.message}`)
  }
}
