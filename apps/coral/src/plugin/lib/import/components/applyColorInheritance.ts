import { CoralColorType, CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { isCoralColor } from '../../types'

// Apply color inheritance to base spec (without responsive styles)
export const applyColorInheritance = (
  node: CoralNode | CoralRootNode,
  parentColor?: CoralColorType,
): CoralNode | CoralRootNode => {
  // Use Object.assign to avoid issues with frozen/sealed objects from state management
  const nodeStyles = Object.assign({}, node.styles || {})

  // Inherit color from parent if not explicitly set
  if (!nodeStyles['color'] && parentColor) {
    nodeStyles['color'] = parentColor
  }

  // Create new node with inherited color
  const newNode: CoralNode | CoralRootNode = Object.assign({}, node, {
    styles: nodeStyles,
  })

  // Determine the color to pass to children
  const nodeColor = nodeStyles['color']
  const colorToInherit = isCoralColor(nodeColor) ? nodeColor : parentColor

  // Recursively apply to children
  if (newNode.children) {
    newNode.children = newNode.children.map((child) => applyColorInheritance(child, colorToInherit))
  }

  return newNode
}
