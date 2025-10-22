import { z } from 'zod/v4'

/**
 * Supported CSS units for dimensions
 */
export const zDimensionUnitSchema = z.enum([
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
])

export type DimensionUnit = z.infer<typeof zDimensionUnitSchema>

/**
 * Dimension value with unit
 * Can be either:
 * - A number (interpreted as pixels)
 * - An object with value and unit properties
 */
export const zDimensionSchema = z.union([
  z.number().describe('A dimension value in pixels'),
  z
    .object({
      value: z.number().describe('The numeric value of the dimension'),
      unit: zDimensionUnitSchema.describe('The unit of measurement'),
    })
    .describe('A dimension value with explicit unit'),
])

export type Dimension = z.infer<typeof zDimensionSchema>

/**
 * Helper function to convert a dimension to a CSS string
 */
export function dimensionToCSS(dimension: Dimension): string {
  if (typeof dimension === 'number') {
    return `${dimension}px`
  }
  return `${dimension.value}${dimension.unit}`
}

/**
 * Helper function to normalize a dimension to the object format
 */
export function normalizeDimension(dimension: Dimension): { value: number; unit: DimensionUnit } {
  if (typeof dimension === 'number') {
    return { value: dimension, unit: 'px' }
  }
  return dimension
}
