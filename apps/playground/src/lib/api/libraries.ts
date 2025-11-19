import type { CreateLibraryInput, Library, UpdateLibraryInput } from '@/types'
import { compressCss, decompressCss } from '@/lib/utils/css-compression'

import { readMockData, writeMockData } from './data-store'

/**
 * Generate a unique ID for a library
 */
function generateId(): string {
  return `lib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get all libraries for an organization
 */
export async function getLibraries(organizationId: string): Promise<Library[]> {
  const data = await readMockData()
  return data.libraries.filter((lib) => lib.organizationId === organizationId)
}

/**
 * Get a single library by ID
 */
export async function getLibrary(id: string): Promise<Library | null> {
  const data = await readMockData()
  return data.libraries.find((lib) => lib.id === id) || null
}

/**
 * Create a new library
 */
export async function createLibrary(input: CreateLibraryInput): Promise<Library> {
  const data = await readMockData()

  // Verify organization exists
  const org = data.organizations.find((o) => o.id === input.organizationId)
  if (!org) {
    throw new Error(`Organization with id ${input.organizationId} not found`)
  }

  const now = new Date().toISOString()

  const library: Library = {
    id: generateId(),
    organizationId: input.organizationId,
    name: input.name,
    ...(input.description && { description: input.description }),
    createdAt: now,
    updatedAt: now,
  }

  data.libraries.push(library)
  await writeMockData(data)

  return library
}

/**
 * Update a library
 */
export async function updateLibrary(id: string, input: UpdateLibraryInput): Promise<Library> {
  const data = await readMockData()
  const library = data.libraries.find((lib) => lib.id === id)

  if (!library) {
    throw new Error(`Library with id ${id} not found`)
  }

  if (input.name !== undefined) {
    library.name = input.name
  }

  if (input.description !== undefined) {
    library.description = input.description
  }

  if (input.cssReset !== undefined) {
    library.cssReset = input.cssReset
  }

  library.updatedAt = new Date().toISOString()
  await writeMockData(data)

  return library
}

/**
 * Delete a library
 */
export async function deleteLibrary(id: string): Promise<void> {
  const data = await readMockData()
  const index = data.libraries.findIndex((lib) => lib.id === id)

  if (index === -1) {
    throw new Error(`Library with id ${id} not found`)
  }

  // Also delete all components in this library
  data.components = data.components.filter((comp) => comp.libraryId !== id)

  // Delete library
  data.libraries.splice(index, 1)
  await writeMockData(data)
}

/**
 * Get CSS reset for a library (decompressed)
 */
export async function getLibraryCssReset(libraryId: string): Promise<string> {
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
