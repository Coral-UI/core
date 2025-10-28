import { CoralNode } from '@reallygoodwork/coral-core'

import { parseSVGFill } from './parseSVGFill'

/**
 * Creates a Figma ellipse node from SVG circle element
 */
export const createCircleNode = (node: CoralNode, parentColor?: RGB): EllipseNode => {
  const attrs = node.elementAttributes || {}
  const cx = parseFloat(attrs['cx'] as string) || 0
  const cy = parseFloat(attrs['cy'] as string) || 0
  const r = parseFloat(attrs['r'] as string) || 0

  const ellipse = figma.createEllipse()
  ellipse.name = node.name

  // Set size (diameter = 2 * radius)
  ellipse.resize(r * 2, r * 2)

  // Set position (Figma positions are top-left corner, SVG circle uses center)
  ellipse.x = cx - r
  ellipse.y = cy - r

  // Apply fill color
  const fill = attrs['fill'] as string | undefined
  const fills = parseSVGFill(fill, parentColor)
  ellipse.fills = fills

  return ellipse
}
