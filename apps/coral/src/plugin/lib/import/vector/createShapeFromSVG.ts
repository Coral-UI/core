import { CoralNode } from '@reallygoodwork/coral-core'

import { createCircleNode } from './createCircleNode'
import { createEllipseNode } from './createEllipseNode'
import { createLineNode } from './createLineNode'
import { createPathNode } from './createPathNode'
import { createRectNode } from './createRectNode'

/**
 * Creates a Figma shape node from an SVG shape element
 */
export const createShapeFromSVG = (node: CoralNode, parentColor?: RGB): SceneNode | null => {
  try {
    switch (node.elementType) {
      case 'circle':
        return createCircleNode(node, parentColor)
      case 'ellipse':
        return createEllipseNode(node, parentColor)
      case 'rect':
        return createRectNode(node, parentColor)
      case 'line':
        return createLineNode(node, parentColor)
      case 'path':
        return createPathNode(node, parentColor)
      case 'polygon':
      case 'polyline':
        // These require vector path conversion - skip for now
        console.warn(`SVG ${node.elementType} not yet supported, skipping`)
        return null
      default:
        return null
    }
  } catch (error) {
    console.error(`Error creating ${node.elementType}:`, error)
    return null
  }
}
