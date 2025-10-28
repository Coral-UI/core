import { Dimension, DimensionUnit } from '@reallygoodwork/coral-core'

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
 * Converts CSS value strings to dimension objects
 * Returns dimension object with value and unit
 */
export const handlesPixelValues = (value: string | number): string | number | Dimension => {
  if (typeof value !== 'string') return value

  // Match CSS values with units (e.g., "16px", "1.5rem", "100%")
  const match = value.match(/^([-\d.]+)(\w+|%)$/)

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

  // If no unit found or invalid, return as-is
  return value
}
