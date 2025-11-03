import { CoralNode } from '@reallygoodwork/coral-core'

import { parseSVGFill } from './parseSVGFill'

/**
 * Creates a Figma VectorNode from an SVG path element
 */
export const createPathNode = (node: CoralNode, parentColor?: RGB): VectorNode | null => {
  const attrs = node.elementAttributes || {}
  const d = attrs['d'] as string | undefined

  if (!d) {
    console.warn('Path element missing "d" attribute')
    return null
  }

  try {
    const vector = figma.createVector()
    vector.name = node.name || 'path'

    // Parse fill first to ensure we have valid colors
    const fillAttr = attrs['fill'] as string | undefined
    const fillRule = (attrs['fill-rule'] || attrs['fillRule']) as string | undefined
    const { fills, strokes } = parseSVGFill(fillAttr, node.styles?.['color'], parentColor)

    // Set the SVG path data
    try {
      const windingRule = fillRule === 'evenodd' ? 'EVENODD' : 'NONZERO'
      vector.vectorPaths = [
        {
          windingRule: windingRule as 'NONZERO' | 'EVENODD',
          data: d,
        },
      ]
    } catch (pathError) {
      console.warn('Invalid SVG path data, creating placeholder rectangle:', pathError)
      // Create a small placeholder rectangle if path data is invalid
      const rect = figma.createRectangle()
      rect.name = node.name || 'path'
      rect.resize(20, 20)
      if (fills) rect.fills = fills
      return rect as unknown as VectorNode
    }

    // Apply fill color
    if (fills) {
      vector.fills = fills
    }

    // Handle stroke
    const strokeAttr = attrs['stroke'] as string | undefined
    if (strokeAttr && strokeAttr !== 'none') {
      const strokeWidth = parseFloat((attrs['stroke-width'] || attrs['strokeWidth'] || '1') as string)
      vector.strokeWeight = strokeWidth
      vector.strokes = strokes || [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
    }

    return vector
  } catch (error) {
    console.error('Error creating path node:', error)
    // Return null to skip this path element rather than blocking entire creation
    return null
  }
}
