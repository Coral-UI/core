import { CoralColorType, CoralNode, CoralRootNode, CoralStyleType, ResponsiveStyle } from '@reallygoodwork/coral-core'

import { isCoralColor } from '../../types'

export const precomputeMergedStylesForAllNodes = (
  node: CoralNode | CoralRootNode,
  sortedResponsiveStyles: ResponsiveStyle[],
): Map<CoralNode | CoralRootNode, Map<string, CoralStyleType>> => {
  const styleMap = new Map<CoralNode | CoralRootNode, Map<string, CoralStyleType>>()

  const processNode = (currentNode: CoralNode | CoralRootNode, parentColor?: CoralColorType) => {
    const nodeBreakpointStyles = new Map<string, CoralStyleType>()

    // For each breakpoint, compute the fully cascaded styles for this node
    let accumulatedStyles: CoralStyleType = { ...currentNode.styles }

    // Inherit color from parent if not explicitly set
    if (!accumulatedStyles['color'] && parentColor) {
      accumulatedStyles['color'] = parentColor
    }

    for (const responsiveStyle of sortedResponsiveStyles) {
      const breakpointKey = JSON.stringify(responsiveStyle.breakpoint)

      // Check if this node has styles for this breakpoint
      const nodeResponsiveStyle = currentNode.responsiveStyles?.find(
        (rs) => JSON.stringify(rs.breakpoint) === breakpointKey,
      )

      // If node has styles for this breakpoint, apply them (cascading from previous breakpoints)
      if (nodeResponsiveStyle) {
        accumulatedStyles = {
          ...accumulatedStyles,
          ...nodeResponsiveStyle.styles,
        }
      }

      // Store the accumulated styles for this breakpoint
      nodeBreakpointStyles.set(breakpointKey, { ...accumulatedStyles })
    }

    styleMap.set(currentNode, nodeBreakpointStyles)

    // Determine the color to pass to children (either this node's color or inherited color)
    const nodeColor = accumulatedStyles['color']
    const colorToInherit = isCoralColor(nodeColor) ? nodeColor : parentColor

    // Recursively process children with inherited color
    if (currentNode.children) {
      for (const child of currentNode.children) {
        processNode(child, colorToInherit)
      }
    }
  }

  processNode(node)
  return styleMap
}
