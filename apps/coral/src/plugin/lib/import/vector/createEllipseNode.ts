import { CoralNode } from '@reallygoodwork/coral-core'

import { parseSVGFill } from './parseSVGFill'

/**
 * Creates a Figma ellipse node from SVG ellipse element
 */
export const createEllipseNode = (node: CoralNode, parentColor?: RGB): EllipseNode => {
  const attrs = node.elementAttributes || {}
  const cx = parseFloat(attrs['cx'] as string) || 0
  const cy = parseFloat(attrs['cy'] as string) || 0
  const rx = parseFloat(attrs['rx'] as string) || 0
  const ry = parseFloat(attrs['ry'] as string) || 0

  const ellipse = figma.createEllipse()
  ellipse.name = node.name

  // Set size
  ellipse.resize(rx * 2, ry * 2)

  // Set position
  ellipse.x = cx - rx
  ellipse.y = cy - ry

  // Apply fill color
  const fill = attrs['fill'] as string | undefined
  const fills = parseSVGFill(fill, parentColor)
  ellipse.fills = fills

  return ellipse
}
