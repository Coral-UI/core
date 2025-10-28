import { CoralStyleType } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../../export/utils/extractDimensionValue'
import { textAlign } from '../../types'
import { applyColor } from '../color/applyColor'

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
    element.textAlignHorizontal =
      ((styles['textAlign'] as string).toUpperCase() as TextNode['textAlignHorizontal']) ?? 'LEFT'
  } else if (textAlign) {
    element.textAlignHorizontal = ((textAlign as string).toUpperCase() as TextNode['textAlignHorizontal']) ?? 'LEFT'
  } else {
    element.textAlignHorizontal = 'LEFT'
  }

  // if (styles['textDecoration']) {
  //   element.textDecoration = styles['textDecoration'] as TextNode['textDecoration']
  // }
}
