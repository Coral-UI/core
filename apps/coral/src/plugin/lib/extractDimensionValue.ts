/**
 * Helper to extract numeric value from dimension objects or plain numbers
 * Converts dimension objects back to pixel values for Figma
 */
export const extractDimensionValue = (value: unknown): number | undefined => {
  // If it's already a number, return it
  if (typeof value === 'number') {
    return value
  }

  // If it's a dimension object, extract the value and convert to pixels
  if (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'unit' in value &&
    typeof (value as any).value === 'number'
  ) {
    const dimension = value as { value: number; unit: string }

    // For now, we'll convert all units to pixels for Figma
    // Figma only works with absolute pixel values
    switch (dimension.unit) {
      case 'px':
        return dimension.value
      case 'rem':
        // Assume 16px base font size
        return dimension.value * 16
      case 'em':
        // Assume 16px base font size (would need parent context for accurate conversion)
        return dimension.value * 16
      case '%':
        // Percentage values need context - return undefined for now
        // These should be handled specially by the calling code
        return undefined
      case 'vw':
      case 'vh':
      case 'vmin':
      case 'vmax':
        // Viewport units need frame context - return undefined
        return undefined
      default:
        return dimension.value
    }
  }

  return undefined
}

/**
 * Helper to check if a value is a percentage dimension
 */
export const isPercentageDimension = (value: unknown): boolean => {
  if (typeof value === 'string' && value.endsWith('%')) {
    return true
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'unit' in value &&
    (value as any).unit === '%'
  ) {
    return true
  }

  return false
}
