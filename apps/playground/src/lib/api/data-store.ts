import type { Component, DesignToken, Library, Organization, Theme, ThemeOption, TokenValue } from '@/types'
import { fs } from '@/lib/adapters/fs'
import { isElectron } from '@/lib/adapters/platform'
import { storage } from '@/lib/adapters/storage'

export interface MockData {
  organizations: Organization[]
  libraries: Library[]
  components: Component[]
  tokens: DesignToken[]
  themes: Theme[]
  themeOptions: ThemeOption[]
  tokenValues: TokenValue[]
}

const DATA_KEY = 'coral-mock-data'
const DATA_FILE_PATH = 'mock-data.json'

/**
 * Normalize mock data to ensure all required fields exist
 */
function normalizeMockData(data: Partial<MockData> | null): MockData {
  return {
    organizations: data?.organizations || [],
    libraries: data?.libraries || [],
    components: data?.components || [],
    tokens: data?.tokens || [],
    themes: data?.themes || [],
    themeOptions: data?.themeOptions || [],
    tokenValues: data?.tokenValues || [],
  }
}

/**
 * Read mock data from storage
 * Uses file system in Electron, localStorage in browser
 */
export async function readMockData(): Promise<MockData> {
  if (isElectron()) {
    try {
      // Try to read from file system in Electron
      const content = await fs.readFile(DATA_FILE_PATH)
      const parsed = JSON.parse(content) as Partial<MockData>
      const normalized = normalizeMockData(parsed)

      // If the data was missing new fields, write it back with normalized structure
      if (!('tokens' in parsed) || !('themes' in parsed) || !('themeOptions' in parsed) || !('tokenValues' in parsed)) {
        await writeMockData(normalized)
      }

      return normalized
    } catch (_error) {
      // If file doesn't exist, return empty data structure
      return normalizeMockData(null)
    }
  } else {
    // Use localStorage in browser
    const data = await storage.get<Partial<MockData>>(DATA_KEY)
    const normalized = normalizeMockData(data)

    // If the data was missing new fields, write it back with normalized structure
    if (data && (!('tokens' in data) || !('themes' in data) || !('themeOptions' in data) || !('tokenValues' in data))) {
      await storage.set(DATA_KEY, normalized)
    }

    return normalized
  }
}

/**
 * Write mock data to storage
 * Uses file system in Electron, localStorage in browser
 */
export async function writeMockData(data: MockData): Promise<void> {
  const content = JSON.stringify(data, null, 2)

  if (isElectron()) {
    await fs.writeFile(content, DATA_FILE_PATH)
  } else {
    await storage.set(DATA_KEY, data)
  }
}
