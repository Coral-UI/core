import type { Component, Library, Organization } from '@/types'
import { fs } from '@/lib/adapters/fs'
import { isElectron } from '@/lib/adapters/platform'
import { storage } from '@/lib/adapters/storage'

export interface MockData {
  organizations: Organization[]
  libraries: Library[]
  components: Component[]
}

const DATA_KEY = 'coral-mock-data'
const DATA_FILE_PATH = 'mock-data.json'

/**
 * Read mock data from storage
 * Uses file system in Electron, localStorage in browser
 */
export async function readMockData(): Promise<MockData> {
  if (isElectron()) {
    try {
      // Try to read from file system in Electron
      const content = await fs.readFile(DATA_FILE_PATH)
      return JSON.parse(content) as MockData
    } catch (_error) {
      // If file doesn't exist, return empty data structure
      return {
        organizations: [],
        libraries: [],
        components: [],
      }
    }
  } else {
    // Use localStorage in browser
    const data = await storage.get<MockData>(DATA_KEY)
    return (
      data || {
        organizations: [],
        libraries: [],
        components: [],
      }
    )
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
