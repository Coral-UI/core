import { CoralColorType, CoralDesignTokenType, CoralGradientType, Dimension } from '@reallygoodwork/coral-core'

import { normalizeName, normalizeStyleName } from './utils/normalizeName'
import { parseSpacingShorthand } from './utils/parseSpacingShorthand'
import { transformPropertyValue } from './utils/transformPropertyValue'

export const handleFigmaStyles = async (node: SceneNode) => {
  const css = await node.getCSSAsync()

  const designTokens: Array<CoralDesignTokenType> = []
  const processedCss: Record<
    string,
    string | Omit<CoralDesignTokenType, 'property'> | CoralColorType | CoralGradientType | Dimension | number
  > = {}

  for (const [key, value] of Object.entries(css)) {
    // Handle padding and margin shorthand properties
    if (typeof value === 'string' && (key === 'padding' || key === 'margin')) {
      // Check if the value contains a CSS variable
      const varMatch = value.match(/var\((--[^,]+),\s*([^)]+)\)/)
      let valueToParse = value
      let tokenName: string | null = null
      let tokenInitialName: string | null = null

      if (varMatch) {
        // Extract the fallback value from the CSS variable
        const [, tokenVar, fallbackValue] = varMatch
        tokenInitialName = tokenVar || null
        tokenName = tokenVar === 'fill' ? 'backgroundColor' : tokenVar || null
        valueToParse = fallbackValue === null || fallbackValue === undefined ? '' : fallbackValue.trim()
      }

      const logicalProperties = parseSpacingShorthand(valueToParse, node, key as 'padding' | 'margin')
      if (logicalProperties) {
        // Process each logical property individually
        for (const [logicalKey, logicalValue] of Object.entries(logicalProperties)) {
          const normalizedKey = normalizeStyleName(logicalKey)

          if (tokenName && tokenInitialName) {
            // If original value was a CSS variable, apply it to each logical property
            designTokens.push({
              property: normalizeName(logicalKey),
              tokenName: tokenName || '',
              fallbackValue: logicalValue,
            })
            processedCss[normalizedKey] = {
              tokenName: tokenName || '',
              fallbackValue: logicalValue,
            }
          } else {
            // Regular value, use directly
            processedCss[normalizedKey] = logicalValue
          }
        }
        // Skip the original shorthand property
        continue
      }
    }

    // Handle other properties normally
    if (typeof value === 'string') {
      const match = value.match(/var\((--[^,]+),\s*([^)]+)\)/)
      if (match) {
        const [, tokenInitialName, fallbackValue] = match
        let tokenName = tokenInitialName
        const trimmedFallback = (fallbackValue === null || fallbackValue === undefined ? '' : fallbackValue).trim()
        if (tokenName === 'fill') {
          tokenName = 'backgroundColor'
        }
        designTokens.push({
          property: normalizeName(key),
          tokenName: tokenName || '',
          fallbackValue: transformPropertyValue(key, trimmedFallback, node),
        })
        processedCss[normalizeStyleName(key)] = {
          tokenName: tokenName || '',
          fallbackValue: transformPropertyValue(key, trimmedFallback, node),
        }
      } else {
        processedCss[normalizeStyleName(key)] = transformPropertyValue(key, value, node)
      }
    } else {
      processedCss[normalizeStyleName(key)] = transformPropertyValue(key, String(value), node)
    }
  }

  if (node.type === 'ELLIPSE') {
    processedCss['borderRadius'] = 9999
  }

  console.log(processedCss)

  return {
    designTokens: Object.fromEntries(
      Object.entries(designTokens).filter((entry, index, self) => index === self.findIndex((t) => t[1] === entry[1])),
    ),
    styles: processedCss,
  }
}
