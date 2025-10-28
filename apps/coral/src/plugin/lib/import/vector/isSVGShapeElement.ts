import { CoralNode } from '@reallygoodwork/coral-core'

/**
 * Checks if a node is an SVG shape element (circle, rect, path, etc.)
 */
export const isSVGShapeElement = (node: CoralNode): boolean => {
  const svgShapes = ['circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon', 'path']
  return svgShapes.includes(node.elementType)
}
