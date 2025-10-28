import { CoralNode } from '@reallygoodwork/coral-core'

import { parseSVGFill } from './parseSVGFill'

/**
 * Creates a Figma rectangle node from SVG rect element
 */
export const createRectNode = (node: CoralNode, parentColor?: RGB): RectangleNode => {
  const attrs = node.elementAttributes || {}
  const x = parseFloat(attrs['x'] as string) || 0
  const y = parseFloat(attrs['y'] as string) || 0
  const width = parseFloat(attrs['width'] as string) || 0
  const height = parseFloat(attrs['height'] as string) || 0

  const rect = figma.createRectangle()
  rect.name = node.name

  // Set size and position
  rect.resize(width, height)
  rect.x = x
  rect.y = y

  // Apply fill color
  const fill = attrs['fill'] as string | undefined
  const fills = parseSVGFill(fill, parentColor)
  rect.fills = fills

  return rect
}
