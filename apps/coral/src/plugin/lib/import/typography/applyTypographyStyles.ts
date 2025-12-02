import { CoralStyleType, Dimension } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../../export/utils/extractDimensionValue'
import { isDimension } from '../../export/assert/isDimension'
import { textAlign } from '../../types'
import { applyColor } from '../color/applyColor'
import { loadFont } from './loadFont'
import { transformFontWeightToFigmaFontStyle } from './transformFontWeightToFigmaFontStyle'

export const applyTypographyStyles = async (element: TextNode, styles: CoralStyleType, textAlign?: textAlign) => {
  const fontSize = extractDimensionValue(styles['fontSize'])
  if (fontSize !== undefined) {
    element.fontSize = fontSize
  }

  // Handle font weight
  const fontWeight = styles['fontWeight']
  if (fontWeight !== undefined) {
    const fontStyle = transformFontWeightToFigmaFontStyle(fontWeight as number)
    try {
      await loadFont('Inter', fontStyle)
      element.fontName = {
        family: 'Inter',
        style: fontStyle,
      }
    } catch (error) {
      console.warn(`Failed to load font Inter ${fontStyle}, using default`)
    }
  }

  if (styles['color']) {
    applyColor(element, styles)
  }

  // Handle line height with special logic for em units
  const lineHeightValue = styles['lineHeight']
  if (lineHeightValue !== undefined) {
    // Check if it's a Dimension object with em unit
    if (isDimension(lineHeightValue)) {
      const dimension = lineHeightValue as Dimension
      if (dimension.unit === 'em') {
        // If line height is 1em, set to AUTO in Figma
        if (dimension.value === 1) {
          element.lineHeight = {
            unit: 'AUTO',
            value: 0, // AUTO unit requires value to be 0
          }
        } else {
          // For other em values (e.g., 1.2em), multiply by font size
          const currentFontSize = element.fontSize || 16 // Default to 16px if fontSize not set
          const lineHeightInPixels = dimension.value * currentFontSize
          element.lineHeight = {
            unit: 'PIXELS',
            value: lineHeightInPixels,
          }
        }
      } else {
        // For non-em units, use the standard extraction
        const lineHeight = extractDimensionValue(lineHeightValue)
        if (lineHeight !== undefined) {
          element.lineHeight = {
            unit: 'PIXELS',
            value: lineHeight,
          }
        }
      }
    } else {
      // For non-dimension values, use standard extraction
      const lineHeight = extractDimensionValue(lineHeightValue)
      if (lineHeight !== undefined) {
        element.lineHeight = {
          unit: 'PIXELS',
          value: lineHeight,
        }
      }
    }
  }

  const letterSpacing = extractDimensionValue(styles['letterSpacing'])
  if (letterSpacing !== undefined) {
    element.letterSpacing = {
      unit: 'PERCENT',
      value: letterSpacing,
    }
  }

  if (styles['textAlign']) {
    element.textAlignHorizontal =
      ((styles['textAlign'] as string).toUpperCase() as TextNode['textAlignHorizontal']) ?? 'LEFT'
  } else if (textAlign) {
    element.textAlignHorizontal = ((textAlign as string).toUpperCase() as TextNode['textAlignHorizontal']) ?? 'LEFT'
  } else {
    element.textAlignHorizontal = 'LEFT'
  }

  if (styles['textDecoration']) {
    element.textDecoration = styles['textDecoration'] as TextNode['textDecoration']
  }
}
