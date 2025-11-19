import type { CreateThemeInput, CreateThemeOptionInput, Theme, ThemeOption, UpdateThemeInput, UpdateThemeOptionInput } from '@/types'

import { readMockData, writeMockData } from './data-store'

/**
 * Generate a unique ID for a theme
 */
function generateThemeId(): string {
  return `theme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate a unique ID for a theme option
 */
function generateThemeOptionId(): string {
  return `themeopt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get all themes for a library
 */
export async function getThemes(libraryId: string): Promise<Theme[]> {
  const data = await readMockData()
  return data.themes.filter((theme) => theme.libraryId === libraryId)
}

/**
 * Get a single theme by ID
 */
export async function getTheme(id: string): Promise<Theme | null> {
  const data = await readMockData()
  return data.themes.find((theme) => theme.id === id) || null
}

/**
 * Create a new theme
 */
export async function createTheme(input: CreateThemeInput): Promise<Theme> {
  const data = await readMockData()

  // Verify library exists
  const library = data.libraries.find((lib) => lib.id === input.libraryId)
  if (!library) {
    throw new Error(`Library with id ${input.libraryId} not found`)
  }

  // Check for duplicate name in the same library
  const existingTheme = data.themes.find(
    (theme) => theme.libraryId === input.libraryId && theme.name === input.name,
  )
  if (existingTheme) {
    throw new Error(`Theme with name "${input.name}" already exists in this library`)
  }

  const now = new Date().toISOString()

  const theme: Theme = {
    id: generateThemeId(),
    libraryId: input.libraryId,
    name: input.name,
    ...(input.description && { description: input.description }),
    createdAt: now,
    updatedAt: now,
  }

  data.themes.push(theme)
  await writeMockData(data)

  return theme
}

/**
 * Update a theme
 */
export async function updateTheme(id: string, input: UpdateThemeInput): Promise<Theme> {
  const data = await readMockData()
  const theme = data.themes.find((t) => t.id === id)

  if (!theme) {
    throw new Error(`Theme with id ${id} not found`)
  }

  if (input.name !== undefined) {
    // Check for duplicate name if changing name
    if (input.name !== theme.name) {
      const existingTheme = data.themes.find(
        (t) => t.libraryId === theme.libraryId && t.name === input.name && t.id !== id,
      )
      if (existingTheme) {
        throw new Error(`Theme with name "${input.name}" already exists in this library`)
      }
    }
    theme.name = input.name
  }

  if (input.description !== undefined) {
    theme.description = input.description
  }

  theme.updatedAt = new Date().toISOString()
  await writeMockData(data)

  return theme
}

/**
 * Delete a theme
 */
export async function deleteTheme(id: string): Promise<void> {
  const data = await readMockData()
  const index = data.themes.findIndex((theme) => theme.id === id)

  if (index === -1) {
    throw new Error(`Theme with id ${id} not found`)
  }

  // Also delete all theme options and token values for this theme
  const themeOptions = data.themeOptions.filter((opt) => opt.themeId === id)
  const themeOptionIds = themeOptions.map((opt) => opt.id)

  data.themeOptions = data.themeOptions.filter((opt) => opt.themeId !== id)
  data.tokenValues = data.tokenValues.filter((val) => !themeOptionIds.includes(val.themeOptionId))

  // Delete theme
  data.themes.splice(index, 1)
  await writeMockData(data)
}

/**
 * Get all theme options for a theme
 */
export async function getThemeOptions(themeId: string): Promise<ThemeOption[]> {
  const data = await readMockData()
  return data.themeOptions.filter((option) => option.themeId === themeId)
}

/**
 * Get a single theme option by ID
 */
export async function getThemeOption(id: string): Promise<ThemeOption | null> {
  const data = await readMockData()
  return data.themeOptions.find((option) => option.id === id) || null
}

/**
 * Create a new theme option
 */
export async function createThemeOption(input: CreateThemeOptionInput): Promise<ThemeOption> {
  const data = await readMockData()

  // Verify theme exists
  const theme = data.themes.find((t) => t.id === input.themeId)
  if (!theme) {
    throw new Error(`Theme with id ${input.themeId} not found`)
  }

  // Check for duplicate name in the same theme
  const existingOption = data.themeOptions.find(
    (opt) => opt.themeId === input.themeId && opt.name === input.name,
  )
  if (existingOption) {
    throw new Error(`Theme option with name "${input.name}" already exists in this theme`)
  }

  // If this is set as default, unset other defaults in the same theme
  if (input.isDefault) {
    data.themeOptions.forEach((opt) => {
      if (opt.themeId === input.themeId && opt.isDefault) {
        opt.isDefault = false
      }
    })
  }

  const now = new Date().toISOString()

  const option: ThemeOption = {
    id: generateThemeOptionId(),
    themeId: input.themeId,
    name: input.name,
    ...(input.isDefault && { isDefault: true }),
    createdAt: now,
    updatedAt: now,
  }

  data.themeOptions.push(option)
  await writeMockData(data)

  return option
}

/**
 * Update a theme option
 */
export async function updateThemeOption(id: string, input: UpdateThemeOptionInput): Promise<ThemeOption> {
  const data = await readMockData()
  const option = data.themeOptions.find((opt) => opt.id === id)

  if (!option) {
    throw new Error(`Theme option with id ${id} not found`)
  }

  if (input.name !== undefined) {
    // Check for duplicate name if changing name
    if (input.name !== option.name) {
      const existingOption = data.themeOptions.find(
        (opt) => opt.themeId === option.themeId && opt.name === input.name && opt.id !== id,
      )
      if (existingOption) {
        throw new Error(`Theme option with name "${input.name}" already exists in this theme`)
      }
    }
    option.name = input.name
  }

  if (input.isDefault !== undefined) {
    // If setting as default, unset other defaults in the same theme
    if (input.isDefault) {
      data.themeOptions.forEach((opt) => {
        if (opt.themeId === option.themeId && opt.id !== id && opt.isDefault) {
          opt.isDefault = false
        }
      })
    }
    option.isDefault = input.isDefault
  }

  option.updatedAt = new Date().toISOString()
  await writeMockData(data)

  return option
}

/**
 * Delete a theme option
 */
export async function deleteThemeOption(id: string): Promise<void> {
  const data = await readMockData()
  const index = data.themeOptions.findIndex((option) => option.id === id)

  if (index === -1) {
    throw new Error(`Theme option with id ${id} not found`)
  }

  // Also delete all token values for this theme option
  data.tokenValues = data.tokenValues.filter((val) => val.themeOptionId !== id)

  data.themeOptions.splice(index, 1)
  await writeMockData(data)
}
