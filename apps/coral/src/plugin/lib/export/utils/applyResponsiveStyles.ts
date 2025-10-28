import { CoralNode, CoralStyleType } from '@reallygoodwork/coral-core'

import { VariantWithBreakpoint } from '../../types'
import { getStyleDifferences } from './getStyleDifferences'
import { parseBreakpoint } from './parseBreakpoint'

/**
 * Apply responsive styles from variants to the base node tree
 * This compares each variant's node tree with the base and adds responsive styles
 * where style differences are detected. Deduplicates styles across breakpoints.
 */
export const applyResponsiveStyles = (baseNode: CoralNode, variantsWithBreakpoints: VariantWithBreakpoint[]): void => {
  // Track styles we've already applied at previous breakpoints
  const appliedStyles: CoralStyleType = { ...baseNode.styles }

  // Sort variants by breakpoint to process in order (base first, then ascending breakpoints)
  const sortedVariants = [...variantsWithBreakpoints].sort((a, b) => {
    if (a.breakpoint === 'base') return -1
    if (b.breakpoint === 'base') return 1

    // Extract numeric value for sorting (e.g., "640px" -> 640)
    const aValue = parseInt(a.breakpoint.split(':')[1] || '0')
    const bValue = parseInt(b.breakpoint.split(':')[1] || '0')
    return aValue - bValue
  })

  // For each non-base variant, compare styles
  for (const { breakpoint, nodeData } of sortedVariants) {
    if (breakpoint === 'base') continue

    const breakpointDef = parseBreakpoint(breakpoint)
    if (!breakpointDef) {
      console.warn(`Could not parse breakpoint: ${breakpoint}`)
      continue
    }

    // Use the breakpoint value as the label (e.g., "640px", "1024px")
    const label =
      'value' in breakpointDef
        ? breakpointDef.value
        : `${breakpointDef.min?.value ?? ''}-${breakpointDef.max?.value ?? ''}`

    // Get only the styles that differ from what we've already applied (base + previous breakpoints)
    const styleDifferences = getStyleDifferences(appliedStyles, nodeData.styles ?? {})

    if (styleDifferences) {
      if (!baseNode.responsiveStyles) {
        baseNode.responsiveStyles = []
      }

      baseNode.responsiveStyles.push({
        breakpoint: breakpointDef,
        label,
        styles: styleDifferences as CoralStyleType,
      })

      // Update our tracking of applied styles to include the FULL variant styles at this breakpoint
      // This ensures that if styles stay the same at the next breakpoint, getStyleDifferences returns null
      if (nodeData.styles) {
        Object.assign(appliedStyles, nodeData.styles)
      }
    }
  }

  // Now recursively process children - collect all variants for each child position
  if (baseNode.children && baseNode.children.length > 0) {
    baseNode.children.forEach((baseChild, childIndex) => {
      // Collect all variant versions of this child across all breakpoints
      const childVariants = variantsWithBreakpoints
        .map(({ breakpoint, nodeData }): VariantWithBreakpoint | null => {
          const variantChild = nodeData.children?.[childIndex]
          return variantChild
            ? {
                variantNode: null,
                breakpoint,
                nodeData: variantChild,
              }
            : null
        })
        .filter((v): v is VariantWithBreakpoint => v !== null)

      // Process this child with all its variants at once
      if (childVariants.length > 0) {
        applyResponsiveStyles(baseChild, childVariants)
      }
    })
  }
}
