import { CoralStyleType } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../extractDimensionValue'
import { applyColor } from './applyPaint'

export const loadFont = (fontFamily: string, fontStyle: string) => {
  return figma.loadFontAsync({
    family: fontFamily,
    style: fontStyle,
  })
}

export const transformFontWeightToFigmaFontStyle = (fontWeight: number) => {
  switch (fontWeight) {
    case 100:
      return 'Thin'
    case 200:
      return 'ExtraLight'
    case 300:
      return 'Light'
    case 400:
      return 'Regular'
    case 500:
      return 'Medium'
    case 600:
      return 'SemiBold'
    case 700:
      return 'Bold'
    case 800:
      return 'ExtraBold'
    case 900:
      return 'Black'
    default:
      return 'Regular'
  }
}

export type textAlign = 'left' | 'center' | 'right' | 'justify' | 'start' | 'end'

export const applyTypographyStyles = async (element: TextNode, styles: CoralStyleType, textAlign?: textAlign) => {
  const fontSize = extractDimensionValue(styles['fontSize'])
  if (fontSize !== undefined) {
    element.fontSize = fontSize
  }

  if (styles['color']) {
    applyColor(element, styles)
  }

  const lineHeight = extractDimensionValue(styles['lineHeight'])
  if (lineHeight !== undefined) {
    element.lineHeight = {
      unit: 'PIXELS',
      value: lineHeight,
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
    element.textAlignHorizontal = (styles['textAlign'] as string).toUpperCase() as TextNode['textAlignHorizontal'] ?? 'LEFT'
  } else if (textAlign) {
    element.textAlignHorizontal = (textAlign as string).toUpperCase() as TextNode['textAlignHorizontal'] ?? 'LEFT'
  } else {
    element.textAlignHorizontal = 'LEFT'
  }

  // if (styles['textDecoration']) {
  //   element.textDecoration = styles['textDecoration'] as TextNode['textDecoration']
  // }
}
