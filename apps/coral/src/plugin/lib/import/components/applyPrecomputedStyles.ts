import { CoralNode, CoralRootNode, CoralStyleType, ResponsiveStyle } from '@reallygoodwork/coral-core'

// Apply precomputed styles to a node tree for a specific breakpoint
export const applyPrecomputedStyles = (
  node: CoralNode | CoralRootNode,
  breakpoint: ResponsiveStyle['breakpoint'],
  styleMap: Map<CoralNode | CoralRootNode, Map<string, CoralStyleType>>,
): CoralNode | CoralRootNode => {
  const breakpointKey = JSON.stringify(breakpoint)
  const nodeStyles = styleMap.get(node)?.get(breakpointKey)

  // Create new node with precomputed styles
  const newNode: CoralNode | CoralRootNode = {
    ...node,
    styles: nodeStyles ?? node.styles ?? {},
  }

  // Recursively apply to children
  if (newNode.children) {
    newNode.children = newNode.children.map((child) => applyPrecomputedStyles(child, breakpoint, styleMap))
  }

  return newNode
}
