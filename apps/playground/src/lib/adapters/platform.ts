/**
 * Platform detection utility
 * Browser-only implementation (Electron support removed)
 */
export function isElectron(): boolean {
  return false
}

/**
 * Get the platform type
 */
export function getPlatform(): 'electron' | 'web' {
  return 'web'
}

/**
 * Get the Electron API (only available in Electron environment)
 * Throws an error since Electron is not supported
 */
export function getElectronAPI(): never {
  throw new Error('Electron API is not available - browser-only mode')
}
