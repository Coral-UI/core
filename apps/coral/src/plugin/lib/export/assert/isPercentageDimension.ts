import { isDimension } from './isDimension'

/**
 * Helper to check if a value is a percentage dimension
 */
export const isPercentageDimension = (value: unknown): boolean => {
  if (typeof value === 'string' && value.endsWith('%')) {
    return true
  }

  if (isDimension(value) && typeof value !== 'number' && value.unit === '%') {
    return true
  }

  return false
}
