import { CoralStyleType } from '@reallygoodwork/coral-core'

/**
 * Extract numeric value from a style property
 * Handles numbers, strings like "10px", and dimension objects
 * @param value - Style property value to extract
 * @returns Numeric value in pixels, or undefined if not extractable
 */
export function extractStyleValue(value: CoralStyleType[keyof CoralStyleType] | undefined): number | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace('px', ''))
    return isNaN(parsed) ? undefined : parsed
  }
  if (typeof value === 'object' && 'value' in value) {
    return extractStyleValue(value.value)
  }
  return undefined
}
