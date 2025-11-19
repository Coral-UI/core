import type { CreateDesignTokenInput, DesignToken } from '@/types'

import { readMockData, writeMockData } from './data-store'

/**
 * Generate a unique ID for a token
 */
function generateId(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get all tokens for a library
 */
export async function getTokens(libraryId: string): Promise<DesignToken[]> {
  const data = await readMockData()
  return data.tokens.filter((token) => token.libraryId === libraryId)
}

/**
 * Get a single token by ID
 */
export async function getToken(id: string): Promise<DesignToken | null> {
  const data = await readMockData()
  return data.tokens.find((token) => token.id === id) || null
}

/**
 * Create a new token
 */
export async function createToken(input: CreateDesignTokenInput): Promise<DesignToken> {
  const data = await readMockData()

  // Verify library exists
  const library = data.libraries.find((lib) => lib.id === input.libraryId)
  if (!library) {
    throw new Error(`Library with id ${input.libraryId} not found`)
  }

  // Validate token name (DTCG spec: no $, {, }, . characters)
  if (input.name.includes('$') || input.name.includes('{') || input.name.includes('}') || input.name.includes('.')) {
    throw new Error('Token name cannot contain $, {, }, or . characters')
  }

  // Check for duplicate name in the same library
  const existingToken = data.tokens.find(
    (token) => token.libraryId === input.libraryId && token.name === input.name,
  )
  if (existingToken) {
    throw new Error(`Token with name "${input.name}" already exists in this library`)
  }

  const now = new Date().toISOString()

  const token: DesignToken = {
    id: generateId(),
    libraryId: input.libraryId,
    name: input.name,
    ...(input.$type && { $type: input.$type }),
    ...(input.$description && { $description: input.$description }),
    createdAt: now,
    updatedAt: now,
  }

  data.tokens.push(token)
  await writeMockData(data)

  return token
}

/**
 * Delete a token
 */
export async function deleteToken(id: string): Promise<void> {
  const data = await readMockData()
  const index = data.tokens.findIndex((token) => token.id === id)

  if (index === -1) {
    throw new Error(`Token with id ${id} not found`)
  }

  // Delete token and all its values in one operation
  data.tokens.splice(index, 1)
  data.tokenValues = data.tokenValues.filter((val) => val.tokenId !== id)
  await writeMockData(data)
}
