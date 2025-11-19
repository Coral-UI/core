import type { CreateTokenValueInput, TokenValue, UpdateTokenValueInput } from '@/types'

import { readMockData, writeMockData } from './data-store'

/**
 * Generate a unique ID for a token value
 */
function generateTokenValueId(): string {
  return `tokenval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get all token values for a token
 */
export async function getTokenValues(tokenId: string): Promise<TokenValue[]> {
  const data = await readMockData()
  return data.tokenValues.filter((val) => val.tokenId === tokenId)
}

/**
 * Get token value for a specific token and theme option
 */
export async function getTokenValue(tokenId: string, themeOptionId: string): Promise<TokenValue | null> {
  const data = await readMockData()
  return data.tokenValues.find((val) => val.tokenId === tokenId && val.themeOptionId === themeOptionId) || null
}

/**
 * Get all token values for a library (useful for bulk operations)
 */
export async function getTokenValuesForLibrary(libraryId: string): Promise<TokenValue[]> {
  const data = await readMockData()
  // Get all tokens for the library
  const libraryTokens = data.tokens.filter((token) => token.libraryId === libraryId)
  const tokenIds = libraryTokens.map((token) => token.id)

  return data.tokenValues.filter((val) => tokenIds.includes(val.tokenId))
}

/**
 * Set or update a token value for a theme option
 */
export async function setTokenValue(input: CreateTokenValueInput): Promise<TokenValue> {
  const data = await readMockData()

  // Verify token exists
  const token = data.tokens.find((t) => t.id === input.tokenId)
  if (!token) {
    throw new Error(`Token with id ${input.tokenId} not found`)
  }

  // Verify theme option exists
  const themeOption = data.themeOptions.find((opt) => opt.id === input.themeOptionId)
  if (!themeOption) {
    throw new Error(`Theme option with id ${input.themeOptionId} not found`)
  }

  // Check if value already exists
  const existingValue = data.tokenValues.find(
    (val) => val.tokenId === input.tokenId && val.themeOptionId === input.themeOptionId,
  )

  const now = new Date().toISOString()

  if (existingValue) {
    // Update existing value
    existingValue.$value = input.$value
    existingValue.updatedAt = now
    await writeMockData(data)
    return existingValue
  } else {
    // Create new value
    const tokenValue: TokenValue = {
      id: generateTokenValueId(),
      tokenId: input.tokenId,
      themeOptionId: input.themeOptionId,
      $value: input.$value,
      createdAt: now,
      updatedAt: now,
    }

    data.tokenValues.push(tokenValue)
    await writeMockData(data)

    return tokenValue
  }
}

/**
 * Update a token value
 */
export async function updateTokenValue(id: string, input: UpdateTokenValueInput): Promise<TokenValue> {
  const data = await readMockData()
  const tokenValue = data.tokenValues.find((val) => val.id === id)

  if (!tokenValue) {
    throw new Error(`Token value with id ${id} not found`)
  }

  if (input.$value !== undefined) {
    tokenValue.$value = input.$value
  }

  tokenValue.updatedAt = new Date().toISOString()
  await writeMockData(data)

  return tokenValue
}

/**
 * Delete a token value
 */
export async function deleteTokenValue(id: string): Promise<void> {
  const data = await readMockData()
  const index = data.tokenValues.findIndex((val) => val.id === id)

  if (index === -1) {
    throw new Error(`Token value with id ${id} not found`)
  }

  data.tokenValues.splice(index, 1)
  await writeMockData(data)
}

/**
 * Delete all token values for a token (useful when deleting a token)
 */
export async function deleteTokenValuesForToken(tokenId: string): Promise<void> {
  const data = await readMockData()
  data.tokenValues = data.tokenValues.filter((val) => val.tokenId !== tokenId)
  await writeMockData(data)
}
