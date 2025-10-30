import { CoralColorType, CoralStyleType } from '@reallygoodwork/coral-core'

import { Element } from '../../types'
import { cloneAPIObject } from '../../utils/cloneAPIObject'

export const applyColor = (element: Element, styles: CoralStyleType) => {
  const color = styles['color'] as CoralColorType
  const fills = cloneAPIObject(element.fills) as Paint[]

  if (color) {
    const existingFill = fills[0]?.type === 'SOLID' ? (fills[0] as SolidPaint) : undefined
    fills[0] = figma.util.solidPaint(color.hex, existingFill)
    element.fills = fills
  }
}
