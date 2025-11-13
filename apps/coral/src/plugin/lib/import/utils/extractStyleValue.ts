import { CoralStyleType, Dimension } from '@reallygoodwork/coral-core'

import { isDimension } from '../../export/assert/isDimension'

/**
 * Extract numeric value from a style property
 * Handles numbers, strings like "10px", and Dimension objects with value and unit
 * @param value - Style property value to extract
 * @returns Numeric value in pixels, or undefined if not extractable
 */
export function extractStyleValue(value: CoralStyleType[keyof CoralStyleType] | undefined): number | undefined {
  if (value === undefined) return undefined

  // Handle numbers directly
  if (typeof value === 'number') return value

  // Handle Dimension objects (with value and unit properties)
  if (isDimension(value)) {
    const dimension = value as Dimension
    // If it's already a number (legacy format), return it
    if (typeof dimension === 'number') {
      return dimension
    }
    // Convert Dimension object to pixels
    // For now, convert all units to pixels for Figma compatibility
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
        // For other units, return the value as-is (treating as pixels)
        return dimension.value
    }
  }

  // Handle strings like "10px", "1.5rem", etc.
  if (typeof value === 'string') {
    // Handle special CSS values
    if (value === 'auto' || value === 'none' || value === 'inherit' || value === 'initial' || value === 'unset') {
      return undefined
    }

    // Try to parse CSS dimension strings
    const match = value.match(/^(-?\d*\.?\d+)(\w+|%)$/)
    if (match) {
      const [, numValue, unit] = match
      const parsedValue = parseFloat(numValue || '')
      if (!isNaN(parsedValue)) {
        // Convert to pixels based on unit
        switch (unit) {
          case 'px':
            return parsedValue
          case 'rem':
          case 'em':
            return parsedValue * 16 // Assume 16px base
          case '%':
            return undefined // Percentages need context
          default:
            return parsedValue // Default to treating as pixels
        }
      }
    }

    // Fallback: try to extract number from string (e.g., "10px" -> 10)
    const parsed = parseFloat(value.replace(/px|rem|em|%|vw|vh|vmin|vmax/g, ''))
    return isNaN(parsed) ? undefined : parsed
  }

  return undefined
}
