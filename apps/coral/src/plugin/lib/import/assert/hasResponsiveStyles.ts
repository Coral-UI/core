import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

// Recursively check if a node or any of its descendants has responsiveStyles
export const hasResponsiveStyles = (node: CoralNode | CoralRootNode): boolean => {
  if (node.responsiveStyles && node.responsiveStyles.length > 0) {
    return true
  }

  if (node.children) {
    return node.children.some((child) => hasResponsiveStyles(child))
  }

  return false
}
