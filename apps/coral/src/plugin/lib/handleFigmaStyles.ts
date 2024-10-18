import { CoralColorType, CoralDesignTokenType, CoralGradientType } from '@reallygoodwork/coral-core'

import { normalizeName } from './normalizeName'
import { transformStyleValue } from './transformStyleValue'

export const handleFigmaStyles = async (node: SceneNode) => {
  const css = await node.getCSSAsync()

  const designTokens: Array<CoralDesignTokenType> = []
  const processedCss: Record<
    string,
    string | Omit<CoralDesignTokenType, 'property'> | CoralColorType | CoralGradientType | number
  > = {}

  for (const [key, value] of Object.entries(css)) {
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
          fallbackValue: transformStyleValue(trimmedFallback, node),
        })
        processedCss[normalizeName(key)] = {
          tokenName: tokenName || '',
          fallbackValue: transformStyleValue(trimmedFallback, node),
        }
      } else {
        processedCss[normalizeName(key)] = transformStyleValue(value, node)
      }
    } else {
      processedCss[normalizeName(key)] = transformStyleValue(value, node)
    }
  }

  if (node.type === 'ELLIPSE') {
    processedCss['borderRadius'] = 9999
  }

  return {
    designTokens: Object.fromEntries(
      Object.entries(designTokens).filter((entry, index, self) => index === self.findIndex((t) => t[1] === entry[1])),
    ),
    styles: processedCss,
  }
}
