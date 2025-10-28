import { Dimension } from '@reallygoodwork/coral-core'

/**
 * Type guard to check if a value is a Dimension object
 */
export const isDimension = (value: unknown): value is Dimension => {
  if (typeof value === 'number') {
    return true
  }

  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'unit' in value &&
    typeof (value as { value: unknown }).value === 'number' &&
    typeof (value as { unit: unknown }).unit === 'string'
  )
}
