import { CoralNode, CoralRootNode, ResponsiveStyle } from '@reallygoodwork/coral-core'

// Collect all unique responsive styles from the entire spec tree
export const collectResponsiveStyles = (node: CoralNode | CoralRootNode): ResponsiveStyle[] => {
  const styles: ResponsiveStyle[] = []

  // Collect from current node
  if (node.responsiveStyles && node.responsiveStyles.length > 0) {
    styles.push(...node.responsiveStyles)
  }

  // Recursively collect from children
  if (node.children) {
    for (const child of node.children) {
      styles.push(...collectResponsiveStyles(child))
    }
  }

  return styles
}
