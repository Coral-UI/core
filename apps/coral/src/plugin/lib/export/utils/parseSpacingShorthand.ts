import { Dimension } from '@reallygoodwork/coral-core'

import { handlesPixelValues } from '../handlePixelValues'

/**
 * Parses CSS padding or margin shorthand values and converts them to logical properties
 * Supports 1, 2, 3, or 4 value shorthand syntax
 *
 * @param value - CSS shorthand value (e.g., "10px 20px 30px 40px")
 * @param _node - SceneNode for context (unused but kept for API consistency)
 * @param propertyType - Either "padding" or "margin"
 * @returns Object with logical properties or null if parsing fails
 */
export const parseSpacingShorthand = (
  value: string,
  _node: SceneNode,
  propertyType: 'padding' | 'margin',
): Record<string, number | Dimension> | null => {
  // Split the value by whitespace and filter out empty strings
  const parts = value.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return null
  }

  // Transform each part using handlesPixelValues to handle units and dimensions
  const transformedParts: Array<number | Dimension> = parts.map((part) => {
    const result = handlesPixelValues(part)
    // If handlesPixelValues returns a string (couldn't parse), extract number
    if (typeof result === 'string') {
      const numericMatch = result.match(/^([-\d.]+)/)
      if (numericMatch) {
        const numValue = parseFloat(numericMatch[1]!)
        if (!isNaN(numValue)) {
          return numValue // Return as number (interpreted as px)
        }
      }
      // If we can't parse, default to 0
      return 0
    }
    // Return as number or Dimension
    return result as number | Dimension
  })

  // Determine the values based on shorthand syntax
  let top: number | Dimension
  let right: number | Dimension
  let bottom: number | Dimension
  let left: number | Dimension

  if (parts.length === 1) {
    // All sides same value
    top = right = bottom = left = transformedParts[0]!
  } else if (parts.length === 2) {
    // top/bottom, left/right
    top = bottom = transformedParts[0]!
    right = left = transformedParts[1]!
  } else if (parts.length === 3) {
    // top, left/right, bottom
    top = transformedParts[0]!
    right = left = transformedParts[1]!
    bottom = transformedParts[2]!
  } else {
    // top, right, bottom, left
    top = transformedParts[0]!
    right = transformedParts[1]!
    bottom = transformedParts[2]!
    left = transformedParts[3]!
  }

  // Convert to logical properties
  // For LTR writing mode:
  // - block-start = top
  // - block-end = bottom
  // - inline-start = left
  // - inline-end = right
  const prefix = propertyType === 'padding' ? 'padding' : 'margin'

  return {
    [`${prefix}BlockStart`]: top,
    [`${prefix}BlockEnd`]: bottom,
    [`${prefix}InlineStart`]: left,
    [`${prefix}InlineEnd`]: right,
  }
}
