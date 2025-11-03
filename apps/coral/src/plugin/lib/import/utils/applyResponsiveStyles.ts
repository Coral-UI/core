import { CoralNode, CoralRootNode, ResponsiveStyle } from '@reallygoodwork/coral-core'

/**
 * Apply responsive styles to a spec for a given breakpoint (mobile-first)
 * Merges styles from base up to and including the target breakpoint
 */
export function applyResponsiveStyles(
  spec: CoralRootNode,
  targetBreakpoint?: ResponsiveStyle['breakpoint'],
): CoralRootNode {
  if (!targetBreakpoint) {
    // Return base spec as-is
    return spec
  }

  // Deep clone the spec to avoid mutations
  const clonedSpec = JSON.parse(JSON.stringify(spec)) as CoralRootNode

  // Get target breakpoint width
  const targetWidth = getBreakpointWidth(targetBreakpoint)

  // Recursively apply responsive styles to all nodes
  applyResponsiveStylesToNode(clonedSpec, targetWidth)

  return clonedSpec
}

/**
 * Recursively apply responsive styles to a node and its children
 */
function applyResponsiveStylesToNode(node: CoralNode | CoralRootNode, targetWidth: number): void {
  // Apply responsive styles from smallest to target width (mobile-first)
  if (node.responsiveStyles && node.responsiveStyles.length > 0) {
    // Sort by breakpoint width (smallest first)
    const sortedStyles = [...node.responsiveStyles].sort((a, b) => {
      const aWidth = getBreakpointWidth(a.breakpoint)
      const bWidth = getBreakpointWidth(b.breakpoint)
      return aWidth - bWidth
    })

    // Apply each breakpoint's styles up to target width
    for (const responsiveStyle of sortedStyles) {
      const breakpointWidth = getBreakpointWidth(responsiveStyle.breakpoint)

      // Only apply if this breakpoint is at or below target width (mobile-first)
      if (breakpointWidth <= targetWidth) {
        // Merge styles (later styles override earlier)
        node.styles = {
          ...node.styles,
          ...responsiveStyle.styles,
        }
      }
    }
  }

  // Recursively apply to children
  if (node.children) {
    for (const child of node.children) {
      applyResponsiveStylesToNode(child, targetWidth)
    }
  }
}

/**
 * Extract width from breakpoint
 */
function getBreakpointWidth(breakpoint: ResponsiveStyle['breakpoint']): number {
  if ('type' in breakpoint && breakpoint.type === 'min-width' && breakpoint.value) {
    const value = breakpoint.value.toString().replace('px', '')
    return parseInt(value, 10)
  }

  if ('min' in breakpoint && breakpoint.min) {
    const value = breakpoint.min.value.toString().replace('px', '')
    return parseInt(value, 10)
  }

  return 0
}
