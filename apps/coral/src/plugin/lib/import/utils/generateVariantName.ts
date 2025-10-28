import { ResponsiveStyle } from '@reallygoodwork/coral-core'

// Generate a variant name from a responsive style
export const generateVariantName = (responsiveStyle: ResponsiveStyle): string => {
  // Use label if provided
  if (responsiveStyle.label) {
    return responsiveStyle.label
  }

  // Otherwise generate from breakpoint
  const bp = responsiveStyle.breakpoint

  // Check if it's a range breakpoint
  if ('min' in bp || 'max' in bp) {
    const parts: string[] = []
    if (bp.min) {
      parts.push(`${bp.min.type}:${bp.min.value}`)
    }
    if (bp.max) {
      parts.push(`${bp.max.type}:${bp.max.value}`)
    }
    return parts.join(' AND ')
  }

  // Simple breakpoint
  return 'type' in bp ? `${bp.type}:${bp.value}` : 'range'
}
