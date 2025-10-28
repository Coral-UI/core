import type { ElectronAPI } from '../../electron/preload'

/**
 * Platform detection utility
 * Determines if the app is running in Electron or browser environment
 */
export function isElectron(): boolean {
  return typeof window !== 'undefined' && window.electron !== undefined
}

/**
 * Get the platform type
 */
export function getPlatform(): 'electron' | 'web' {
  return isElectron() ? 'electron' : 'web'
}

/**
 * Get the Electron API (only available in Electron environment)
 * Throws an error if called in a browser environment
 */
export function getElectronAPI(): ElectronAPI {
  if (!isElectron()) {
    throw new Error('Electron API is not available in browser environment')
  }
  return window.electron!
}
