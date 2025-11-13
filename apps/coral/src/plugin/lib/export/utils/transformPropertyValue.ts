import { Dimension } from '@reallygoodwork/coral-core'

import { handlesPixelValues } from '../handlePixelValues'
import { normalizeStyleName } from './normalizeName'
import { transformStyleValue } from './transformStyleValue'

/**
 * Properties that should be numbers (not dimensions)
 */
const NUMBER_PROPERTIES = new Set([
  'fontWeight',
  'opacity',
  'zIndex',
  'order',
  'flexGrow',
  'flexShrink',
  'flexBasis', // Actually this can be a dimension, but Figma might return it as a number
])

/**
 * Properties that should be dimension objects (or numbers)
 */
const DIMENSION_PROPERTIES = new Set([
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'top',
  'right',
  'bottom',
  'left',
  'gap',
  'borderRadius',
  'borderWidth',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginBlockStart',
  'marginBlockEnd',
  'marginInlineStart',
  'marginInlineEnd',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingBlockStart',
  'paddingBlockEnd',
  'paddingInlineStart',
  'paddingInlineEnd',
])

/**
 * Transform a CSS property value based on its property name
 * - Number properties (fontWeight) are converted to numbers
 * - Dimension properties use handlesPixelValues to convert to Dimension objects
 * - Other properties use the standard transformStyleValue
 */
export const transformPropertyValue = (
  propertyName: string,
  value: string,
  node: SceneNode,
): string | number | Dimension | ReturnType<typeof transformStyleValue> => {
  // Normalize property name to camelCase (Figma CSS comes in kebab-case)
  const normalizedPropertyName = normalizeStyleName(propertyName)

  // Handle number properties
  if (NUMBER_PROPERTIES.has(normalizedPropertyName)) {
    // Extract numeric value from string (e.g., "600" or "600px" -> 600)
    const numericMatch = value.match(/^([-\d.]+)/)
    if (numericMatch) {
      const numValue = parseFloat(numericMatch[1]!)
      if (!isNaN(numValue)) {
        return numValue
      }
    }
    // If parsing fails, return as string (fallback)
    return value
  }

  // Handle dimension properties
  if (DIMENSION_PROPERTIES.has(normalizedPropertyName)) {
    // Use handlesPixelValues to convert to Dimension object
    const result = handlesPixelValues(value)
    // If it's already a Dimension object, return it
    if (typeof result === 'object' && 'value' in result && 'unit' in result) {
      return result
    }
    // If it's a number, convert to Dimension object with px unit
    if (typeof result === 'number') {
      return {
        value: result,
        unit: 'px',
      }
    }
    // If handlesPixelValues returned a string (couldn't parse), try to extract number
    const numericMatch = String(result).match(/^([-\d.]+)/)
    if (numericMatch) {
      const numValue = parseFloat(numericMatch[1]!)
      if (!isNaN(numValue)) {
        // Convert to Dimension object with px unit for consistency
        return {
          value: numValue,
          unit: 'px',
        }
      }
    }
    return result
  }

  // For all other properties, use the standard transformStyleValue
  return transformStyleValue(value, node)
}
