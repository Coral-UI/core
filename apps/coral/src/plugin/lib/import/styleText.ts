import { CoralStyleType } from '@reallygoodwork/coral-core'

import { applyBackground, applyColor } from './applyPaint'

export const loadFont = async (fontFamily: string, fontStyle: string) => {
  try {
    await figma.loadFontAsync({
      family: fontFamily,
      style: fontStyle,
    })
  } catch (error) {
    console.error(`Failed to load font: ${fontFamily} ${fontStyle}`, error)
  }
}

export const transformFontWeightToFigmaFontStyle = (fontWeight: number) => {
  switch (fontWeight) {
    case 100:
      return 'Thin'
    case 200:
      return 'Extra Light'
    case 300:
      return 'Light'
    case 400:
      return 'Regular'
    case 500:
      return 'Medium'
    case 600:
      return 'Semi Bold'
    case 700:
      return 'Bold'
    case 800:
      return 'Extra Bold'
    case 900:
      return 'Black'
    default:
      return 'Regular'
  }
}

export type textAlign = 'left' | 'center' | 'right' | 'justify' | 'start' | 'end'

export const applyTypographyStyles = async (element: TextNode, styles: CoralStyleType, textAlign?: textAlign) => {
  if (styles['fontSize']) {
    element.fontSize = styles['fontSize'] as number
  }

  if (styles['color']) {
    applyColor(element, styles)
  }

  if (styles['lineHeight']) {
    element.lineHeight = {
      unit: 'PIXELS',
      value: styles['lineHeight'] as number,
    }
  }

  if (styles['letterSpacing']) {
    element.letterSpacing = {
      unit: 'PERCENT',
      value: styles['letterSpacing'] as number,
    }
  }

  if (styles['textAlign']) {
    element.textAlignHorizontal = styles['textAlign'] as TextNode['textAlignHorizontal']
  } else if (textAlign) {
    element.textAlignHorizontal = textAlign.toUpperCase() as TextNode['textAlignHorizontal']
  }

  if (styles['textDecoration']) {
    element.textDecoration = styles['textDecoration'] as TextNode['textDecoration']
  }
}
