import { Dimension, DimensionUnit } from '../structures/dimension'

const validUnits: DimensionUnit[] = [
  'px',
  'em',
  'rem',
  'vw',
  'vh',
  'vmin',
  'vmax',
  '%',
  'ch',
  'ex',
  'cm',
  'mm',
  'in',
  'pt',
  'pc',
]

/**
 * Converts a CSS dimension string (e.g., "16px", "1.5rem", "100%") to a Dimension object
 * Returns the original value if it cannot be parsed as a dimension
 */
export function cssStringToDimension(value: string | number | unknown): Dimension | unknown {
  // If it's already a number, return it (will be treated as px)
  if (typeof value === 'number') {
    return value
  }

  // If it's not a string, return as-is
  if (typeof value !== 'string') {
    return value
  }

  // Handle special CSS values that aren't dimensions
  if (value === 'auto' || value === 'none' || value === 'inherit' || value === 'initial' || value === 'unset') {
    return value
  }

  // Match CSS values with units (e.g., "16px", "1.5rem", "100%", "-10px")
  // This regex matches: optional minus sign, digits (with optional decimal), followed by unit
  const match = value.match(/^(-?\d*\.?\d+)(\w+|%)$/)

  if (match) {
    const [, numValue, unit] = match

    if (!numValue || !unit) return value

    const parsedValue = parseFloat(numValue)

    if (!isNaN(parsedValue) && validUnits.includes(unit as DimensionUnit)) {
      // Return dimension object
      return {
        value: parsedValue,
        unit: unit as DimensionUnit,
      }
    }
  }

  // If no unit found or invalid, return as string
  return value
}
