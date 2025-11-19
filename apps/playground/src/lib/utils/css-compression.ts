import pako from 'pako'

/**
 * Compress CSS string using gzip compression
 * Returns base64-encoded compressed string for storage
 */
export function compressCss(css: string): string {
  if (!css || css.trim().length === 0) {
    return ''
  }

  // Convert CSS string to Uint8Array
  const input = new TextEncoder().encode(css)

  // Compress using gzip
  const compressed = pako.gzip(input)

  // Convert to base64 for storage (handle large arrays)
  let binaryString = ''
  for (let i = 0; i < compressed.length; i++) {
    binaryString += String.fromCharCode(compressed[i]!)
  }
  const base64 = btoa(binaryString)

  return base64
}

/**
 * Decompress CSS string from base64-encoded gzip
 * Returns the original CSS string
 */
export function decompressCss(compressed: string): string {
  if (!compressed || compressed.trim().length === 0) {
    return ''
  }

  try {
    // Convert base64 to Uint8Array
    const binaryString = atob(compressed)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Decompress using gzip
    const decompressed = pako.ungzip(bytes, { to: 'string' })

    return decompressed
  } catch (error) {
    console.error('Failed to decompress CSS:', error)
    return ''
  }
}
