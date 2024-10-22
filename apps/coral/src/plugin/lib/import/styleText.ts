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

export type textAlign = 'left' | 'center' | 'right' | 'justify' | 'start' | 'end'

export const applyTypographyStyles = async (
  element: TextNode,
  // node: CoralNode | CoralRootNode,
  styles: CoralStyleType,
  // textAlign?: textAlign,
) => {
  if (styles['fontFamily'] && styles['fontStyle']) {
    await loadFont(styles['fontFamily'] as string, styles['fontStyle'] as string)
  }

  if (styles['fontSize']) {
    element.fontSize = styles['fontSize'] as number
  }

  if (styles['color']) {
    applyColor(element, styles)
  }
}
