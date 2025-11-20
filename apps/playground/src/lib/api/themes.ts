/**
 * API for managing themes and theme options
 */

import type { Database } from '@/lib/supabase/database.types'
import type {
  CreateThemeInput,
  CreateThemeOptionInput,
  Theme,
  ThemeOption,
  UpdateThemeInput,
  UpdateThemeOptionInput,
} from '@/types'
import { canCreateTheme, canDeleteTheme, canUpdateTheme } from '@/lib/permissions/ability'
import { getUserOrgRole } from '@/lib/permissions/use-permissions'
import { supabase } from '@/lib/supabase/client'
import { extractArray } from '@/lib/supabase/helpers'

type ThemeRow = Database['public']['Tables']['themes']['Row']
type ThemeInsert = Database['public']['Tables']['themes']['Insert']
type ThemeUpdate = Database['public']['Tables']['themes']['Update']
type ThemeOptionRow = Database['public']['Tables']['theme_options']['Row']
type ThemeOptionInsert = Database['public']['Tables']['theme_options']['Insert']
type ThemeOptionUpdate = Database['public']['Tables']['theme_options']['Update']

/**
 * Get all themes for a library
 */
export async function getThemes(libraryId: string): Promise<Theme[]> {
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('library_id', libraryId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch themes: ${error.message}`)
  }

  const rows = extractArray(data, error) as ThemeRow[]
  return rows.map((row) => {
    const theme: Theme = {
      id: row.id,
      libraryId: row.library_id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }

    if (row.description !== null) {
      theme.description = row.description
    }

    return theme
  })
}

/**
 * Get a single theme by ID
 */
export async function getTheme(id: string): Promise<Theme | null> {
  const { data, error } = await supabase.from('themes').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch theme: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as ThemeRow
  const theme: Theme = {
    id: row.id,
    libraryId: row.library_id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row['description'] !== null) {
    theme.description = row['description']
  }

  return theme
}

/**
 * Create a new theme
 */
export async function createTheme(input: CreateThemeInput): Promise<Theme> {
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
  if (!canCreateTheme(role)) {
    throw new Error('Insufficient permissions to create theme')
  }

  // Check for duplicate name in the same library
  const { data: existingTheme } = await supabase
    .from('themes')
    .select('id')
    .eq('library_id', input.libraryId)
    .eq('name', input.name)
    .maybeSingle()

  if (existingTheme) {
    throw new Error(`Theme with name "${input.name}" already exists in this library`)
  }

  const now = new Date().toISOString()

  const insertData: Record<string, unknown> = {
    library_id: input.libraryId,
    name: input.name,
    created_at: now,
    updated_at: now,
  }

  if (input.description !== undefined) {
    insertData['description'] = input.description
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('themes') as any)
    .insert(insertData as ThemeInsert)
    .select()
    .single()) as { data: ThemeRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to create theme: ${error.message}`)
  }

  const row = data as ThemeRow
  const createdTheme: Theme = {
    id: row.id,
    libraryId: row.library_id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row['description'] !== null) {
    createdTheme.description = row['description']
  }

  return createdTheme
}

/**
 * Update a theme
 */
export async function updateTheme(id: string, input: UpdateThemeInput): Promise<Theme> {
  // Get theme to check library and organization
  const theme = await getTheme(id)
  if (!theme) {
    throw new Error(`Theme with id ${id} not found`)
  }

  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', theme.libraryId)
    .single()

  if (!library) {
    throw new Error(`Library with id ${theme.libraryId} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canUpdateTheme(role)) {
    throw new Error('Insufficient permissions to update theme')
  }

  // Check for duplicate name if changing name
  if (input.name !== undefined && input.name !== theme.name) {
    const { data: existingTheme } = await supabase
      .from('themes')
      .select('id')
      .eq('library_id', theme.libraryId)
      .eq('name', input.name)
      .neq('id', id)
      .maybeSingle()

    if (existingTheme) {
      throw new Error(`Theme with name "${input.name}" already exists in this library`)
    }
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('themes') as any)
    .update(updateData as ThemeUpdate)
    .eq('id', id)
    .select()
    .single()) as { data: ThemeRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to update theme: ${error.message}`)
  }

  const row = data as ThemeRow
  const updatedTheme: Theme = {
    id: row.id,
    libraryId: row.library_id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row['description'] !== null) {
    updatedTheme.description = row['description']
  }

  return updatedTheme
}

/**
 * Delete a theme
 */
export async function deleteTheme(id: string): Promise<void> {
  // Get theme to check library and organization
  const theme = await getTheme(id)
  if (!theme) {
    throw new Error(`Theme with id ${id} not found`)
  }

  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', theme.libraryId)
    .single()

  if (!library) {
    throw new Error(`Library with id ${theme.libraryId} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canDeleteTheme(role)) {
    throw new Error('Insufficient permissions to delete theme')
  }

  // Delete theme (cascade will handle theme_options and token_values if foreign keys are set up)
  const { error } = await supabase.from('themes').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete theme: ${error.message}`)
  }
}

/**
 * Get all theme options for a theme
 */
export async function getThemeOptions(themeId: string): Promise<ThemeOption[]> {
  const { data, error } = await supabase
    .from('theme_options')
    .select('*')
    .eq('theme_id', themeId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch theme options: ${error.message}`)
  }

  const rows = extractArray(data, error) as ThemeOptionRow[]
  return rows.map((row) => {
    const option: ThemeOption = {
      id: row.id,
      themeId: row.theme_id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }

    if (row.is_default !== null) {
      option.isDefault = row.is_default
    }

    return option
  })
}

/**
 * Get a single theme option by ID
 */
export async function getThemeOption(id: string): Promise<ThemeOption | null> {
  const { data, error } = await supabase.from('theme_options').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch theme option: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const row = data as ThemeOptionRow
  const option: ThemeOption = {
    id: row.id,
    themeId: row.theme_id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row.is_default !== null) {
    option.isDefault = row.is_default
  }

  return option
}

/**
 * Create a new theme option
 */
export async function createThemeOption(input: CreateThemeOptionInput): Promise<ThemeOption> {
  // Get theme to check library and organization
  const theme = await getTheme(input.themeId)
  if (!theme) {
    throw new Error(`Theme with id ${input.themeId} not found`)
  }

  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', theme.libraryId)
    .single()

  if (!library) {
    throw new Error(`Library with id ${theme.libraryId} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canCreateTheme(role)) {
    throw new Error('Insufficient permissions to create theme option')
  }

  // Check for duplicate name in the same theme
  const { data: existingOption } = await supabase
    .from('theme_options')
    .select('id')
    .eq('theme_id', input.themeId)
    .eq('name', input.name)
    .maybeSingle()

  if (existingOption) {
    throw new Error(`Theme option with name "${input.name}" already exists in this theme`)
  }

  // If this is set as default, unset other defaults in the same theme
  if (input.isDefault) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('theme_options') as any)
      .update({ is_default: false } as ThemeOptionUpdate)
      .eq('theme_id', input.themeId)
      .eq('is_default', true)
  }

  const now = new Date().toISOString()

  const insertData: Record<string, unknown> = {
    theme_id: input.themeId,
    name: input.name,
    created_at: now,
    updated_at: now,
  }

  if (input.isDefault !== undefined) {
    insertData['is_default'] = input.isDefault
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('theme_options') as any)
    .insert(insertData as ThemeOptionInsert)
    .select()
    .single()) as { data: ThemeOptionRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to create theme option: ${error.message}`)
  }

  const row = data as ThemeOptionRow
  const createdOption: ThemeOption = {
    id: row.id,
    themeId: row.theme_id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row.is_default !== null) {
    createdOption.isDefault = row.is_default
  }

  return createdOption
}

/**
 * Update a theme option
 */
export async function updateThemeOption(id: string, input: UpdateThemeOptionInput): Promise<ThemeOption> {
  // Get theme option to check theme, library, and organization
  const option = await getThemeOption(id)
  if (!option) {
    throw new Error(`Theme option with id ${id} not found`)
  }

  // Get theme to check library and organization
  const theme = await getTheme(option.themeId)
  if (!theme) {
    throw new Error(`Theme with id ${option.themeId} not found`)
  }

  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', theme.libraryId)
    .single()

  if (!library) {
    throw new Error(`Library with id ${theme.libraryId} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canUpdateTheme(role)) {
    throw new Error('Insufficient permissions to update theme option')
  }

  // Check for duplicate name if changing name
  if (input.name !== undefined && input.name !== option.name) {
    const { data: existingOption } = await supabase
      .from('theme_options')
      .select('id')
      .eq('theme_id', option.themeId)
      .eq('name', input.name)
      .neq('id', id)
      .maybeSingle()

    if (existingOption) {
      throw new Error(`Theme option with name "${input.name}" already exists in this theme`)
    }
  }

  // If setting as default, unset other defaults in the same theme
  if (input.isDefault) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('theme_options') as any)
      .update({ is_default: false } as ThemeOptionUpdate)
      .eq('theme_id', option.themeId)
      .eq('is_default', true)
      .neq('id', id)
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (input.name !== undefined) {
    updateData['name'] = input.name
  }

  if (input.isDefault !== undefined) {
    updateData['is_default'] = input.isDefault
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await (supabase.from('theme_options') as any)
    .update(updateData as ThemeOptionUpdate)
    .eq('id', id)
    .select()
    .single()) as { data: ThemeOptionRow | null; error: { message: string } | null }

  if (error) {
    throw new Error(`Failed to update theme option: ${error.message}`)
  }

  const row = data as ThemeOptionRow
  const updatedOption: ThemeOption = {
    id: row.id,
    themeId: row.theme_id,
    name: row['name'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row.is_default !== null) {
    updatedOption.isDefault = row.is_default
  }

  return updatedOption
}

/**
 * Delete a theme option
 */
export async function deleteThemeOption(id: string): Promise<void> {
  // Get theme option to check theme, library, and organization
  const option = await getThemeOption(id)
  if (!option) {
    throw new Error(`Theme option with id ${id} not found`)
  }

  // Get theme to check library and organization
  const theme = await getTheme(option.themeId)
  if (!theme) {
    throw new Error(`Theme with id ${option.themeId} not found`)
  }

  // Get library to check organization
  const { data: library } = await supabase
    .from('libraries')
    .select('organization_id')
    .eq('id', theme.libraryId)
    .single()

  if (!library) {
    throw new Error(`Library with id ${theme.libraryId} not found`)
  }

  type LibrarySelect = { organization_id: string }
  const libraryRow = library as LibrarySelect

  // Check permissions
  const role = await getUserOrgRole(libraryRow.organization_id)
  if (!canDeleteTheme(role)) {
    throw new Error('Insufficient permissions to delete theme option')
  }

  // Delete theme option (cascade will handle token_values if foreign keys are set up)
  const { error } = await supabase.from('theme_options').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete theme option: ${error.message}`)
  }
}
