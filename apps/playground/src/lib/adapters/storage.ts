import { isElectron } from './platform'

/**
 * Storage adapter interface
 * Provides a unified API for persistent storage across Electron and browser environments
 */
export interface StorageAdapter {
  /**
   * Get a value from storage
   * @param key - Storage key
   * @returns Promise with the stored value or null if not found
   */
  get<T = any>(key: string): Promise<T | null>

  /**
   * Set a value in storage
   * @param key - Storage key
   * @param value - Value to store
   */
  set<T = any>(key: string, value: T): Promise<void>

  /**
   * Remove a value from storage
   * @param key - Storage key
   */
  remove(key: string): Promise<void>

  /**
   * Clear all storage
   */
  clear(): Promise<void>

  /**
   * Check if a key exists in storage
   * @param key - Storage key
   */
  has(key: string): Promise<boolean>
}

/**
 * Electron storage implementation using electron-store
 * Note: This requires electron-store to be properly initialized in the main process
 */
class ElectronStorage implements StorageAdapter {
  constructor() {
    // In Electron, we'd use electron-store or a custom IPC-based storage
    // For now, we'll use localStorage as a fallback since electron-store
    // needs to be initialized in the main process
    console.warn('Using localStorage fallback in Electron. Consider implementing IPC-based storage.')
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch {
      return null
    }
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key)
  }

  async clear(): Promise<void> {
    localStorage.clear()
  }

  async has(key: string): Promise<boolean> {
    return localStorage.getItem(key) !== null
  }
}

/**
 * Browser storage implementation using localStorage
 */
class BrowserStorage implements StorageAdapter {
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch {
      return null
    }
  }

  async set<T = any>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key)
  }

  async clear(): Promise<void> {
    localStorage.clear()
  }

  async has(key: string): Promise<boolean> {
    return localStorage.getItem(key) !== null
  }
}

/**
 * Get the appropriate storage adapter for the current platform
 */
export function getStorageAdapter(): StorageAdapter {
  if (isElectron()) {
    return new ElectronStorage()
  }
  return new BrowserStorage()
}

/**
 * Singleton instance of the storage adapter
 */
export const storage = getStorageAdapter()
