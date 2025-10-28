import { CoralColorType, CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { Element } from '../../types'
import { cloneAPIObject } from '../../utils/cloneAPIObject'

export const applyPaint = (element: Element, node: CoralNode | CoralRootNode) => {
  const backgroundColor = node.styles?.['backgroundColor'] as CoralColorType
  const color = node.styles?.['color'] as CoralColorType

  const fills = cloneAPIObject(element.fills) as Paint[]

  if (backgroundColor && fills.length > 0) {
    const existingFill = fills[0]?.type === 'SOLID' ? (fills[0] as SolidPaint) : undefined
    fills[0] = figma.util.solidPaint(backgroundColor.hex, existingFill)
    element.fills = fills
  }

  // Only apply color to TEXT nodes, not frames/containers
  // For elements with textContent, color is applied to the child text node
  if (color && element.type === 'TEXT' && fills.length > 0) {
    const existingFill = fills[0]?.type === 'SOLID' ? (fills[0] as SolidPaint) : undefined
    fills[0] = figma.util.solidPaint(color.hex, existingFill)
    element.fills = fills
  }
}
