import { CoralStyleType } from '@reallygoodwork/coral-core'

import { StyleDifferences } from '../../types'

/**
 * Get only the style properties that differ between two style objects
 * Returns an object with only the changed/new properties
 */
export const getStyleDifferences = (baseStyles: CoralStyleType, variantStyles: CoralStyleType): StyleDifferences => {
  if (!variantStyles) return null
  if (!baseStyles) return variantStyles

  const differences: CoralStyleType = {}
  let hasDifferences = false

  // Check all properties in variant styles
  for (const [key, value] of Object.entries(variantStyles)) {
    // If the property doesn't exist in base or has a different value, include it
    if (!(key in baseStyles) || JSON.stringify(baseStyles[key]) !== JSON.stringify(value)) {
      differences[key] = value
      hasDifferences = true
    }
  }

  return hasDifferences ? differences : null
}
