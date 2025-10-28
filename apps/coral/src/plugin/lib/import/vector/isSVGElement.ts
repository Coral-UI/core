import { CoralNode } from '@reallygoodwork/coral-core'

/**
 * Checks if a node is an SVG element
 */
export const isSVGElement = (node: CoralNode): boolean => {
  return node.elementType === 'svg'
}
