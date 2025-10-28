import { CoralNode } from '@reallygoodwork/coral-core'

import { parseSVGFill } from './parseSVGFill'

/**
 * Creates a Figma line node from SVG line element
 */
export const createLineNode = (node: CoralNode, parentColor?: RGB): LineNode => {
  const attrs = node.elementAttributes || {}
  const x1 = parseFloat(attrs['x1'] as string) || 0
  const y1 = parseFloat(attrs['y1'] as string) || 0
  const x2 = parseFloat(attrs['x2'] as string) || 0
  const y2 = parseFloat(attrs['y2'] as string) || 0

  const line = figma.createLine()
  line.name = node.name

  // Set line endpoints
  line.resize(Math.abs(x2 - x1), 0)
  line.x = Math.min(x1, x2)
  line.y = y1

  // Rotate if needed for vertical/diagonal lines
  if (y2 !== y1) {
    const angle = Math.atan2(y2 - y1, x2 - x1)
    line.rotation = (angle * 180) / Math.PI
  }

  // Apply stroke color
  const stroke = attrs['stroke'] as string | undefined
  const strokeFills = parseSVGFill(stroke, parentColor)
  line.strokes = strokeFills

  const strokeWidth = parseFloat(attrs['stroke-width'] as string) || 1
  line.strokeWeight = strokeWidth

  return line
}
