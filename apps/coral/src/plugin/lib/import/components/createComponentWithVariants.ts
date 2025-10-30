import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { textAlign } from '../../types'
import { createElement } from '../create/createElement'
import { collectResponsiveStyles } from '../utils/collectResponsiveStyles'
import { generateVariantName } from '../utils/generateVariantName'
import { parseBreakpointValue } from '../utils/parseBreakpointValue'
import { sortResponsiveStylesByBreakpoint } from '../utils/sortResponsiveStylesByBreakpoint'
import { applyColorInheritance } from './applyColorInheritance'
import { applyPrecomputedStyles } from './applyPrecomputedStyles'
import { precomputeMergedStylesForAllNodes } from './precomputeMergedStylesForAllNodes'

// Create a component set with variants for responsive styles
export const createComponentWithVariants = async (
  spec: CoralNode | CoralRootNode,
  textAlign?: textAlign,
): Promise<ComponentSetNode> => {
  // Collect all responsive styles from the spec tree
  const allResponsiveStyles = collectResponsiveStyles(spec)

  // Deduplicate by breakpoint (keep first occurrence of each unique breakpoint)
  const uniqueResponsiveStyles = allResponsiveStyles.filter(
    (style, index, self) =>
      index === self.findIndex((s) => JSON.stringify(s.breakpoint) === JSON.stringify(style.breakpoint)),
  )

  // Sort responsive styles by breakpoint order (mobile-first: smallest to largest)
  const sortedResponsiveStyles = sortResponsiveStylesByBreakpoint(uniqueResponsiveStyles)

  // Pre-compute all merged styles for every node at every breakpoint
  const styleMap = precomputeMergedStylesForAllNodes(spec, sortedResponsiveStyles)

  // Create base variant (without any responsive overrides, but with color inheritance)
  const baseSpec = applyColorInheritance(spec)
  const baseNode = (await createElement(baseSpec, textAlign)) as ComponentNode

  // Convert to component if it isn't already
  const baseComponent = baseNode.type === 'COMPONENT' ? baseNode : figma.createComponentFromNode(baseNode)

  baseComponent.name = `${spec.name}=Base`

  // Position base component at origin
  baseComponent.x = 0
  baseComponent.y = 0

  // Set minimum width for base variant (480px default) since it represents mobile-first
  const mobileWidth = 480
  if ('minWidth' in baseComponent) {
    baseComponent.minWidth = mobileWidth
  }
  // Ensure the base component is at least the minimum width
  if (baseComponent.width < mobileWidth) {
    baseComponent.resize(mobileWidth, baseComponent.height)
  }

  // Create variants for each responsive style with cascading inheritance
  const variantComponents: ComponentNode[] = [baseComponent]
  let currentX = baseComponent.width + 24 // Start 24px to the right of base component

  for (const responsiveStyle of sortedResponsiveStyles) {
    // Apply precomputed styles for this breakpoint
    const mergedSpec = applyPrecomputedStyles(spec, responsiveStyle.breakpoint, styleMap)

    // Create the variant node
    const variantNode = (await createElement(mergedSpec, textAlign)) as ComponentNode

    // Convert to component if it isn't already
    const variantComponent = variantNode.type === 'COMPONENT' ? variantNode : figma.createComponentFromNode(variantNode)

    // Name the variant
    const variantName = generateVariantName(responsiveStyle)
    variantComponent.name = `${spec.name}=${variantName}`

    // Set minimum width based on breakpoint
    // For min-width breakpoints, set minWidth to the breakpoint value
    if (responsiveStyle.breakpoint.type === 'min-width') {
      const minWidth = parseBreakpointValue(responsiveStyle.breakpoint.value)
      if (minWidth && 'minWidth' in variantComponent) {
        variantComponent.minWidth = minWidth
      }
      // Ensure the variant is at least the minimum width
      if (minWidth && variantComponent.width < minWidth) {
        variantComponent.resize(minWidth, variantComponent.height)
      }
    }
    // For max-width breakpoints, set maxWidth to the breakpoint value
    else if (responsiveStyle.breakpoint.type === 'max-width') {
      const maxWidth = parseBreakpointValue(responsiveStyle.breakpoint.value)
      if (maxWidth && 'maxWidth' in variantComponent) {
        variantComponent.maxWidth = maxWidth
      }
      // Ensure the variant doesn't exceed the maximum width
      if (maxWidth && variantComponent.width > maxWidth) {
        variantComponent.resize(maxWidth, variantComponent.height)
      }
    }

    // Position variant horizontally with 24px spacing
    variantComponent.x = currentX
    variantComponent.y = 0

    // Update position for next variant
    currentX += variantComponent.width + 24

    variantComponents.push(variantComponent)
  }

  // Create the component set from the variants
  const componentSet = figma.combineAsVariants(variantComponents, figma.currentPage)
  componentSet.name = spec.name

  // Find the tallest variant to ensure the component set is tall enough
  const maxHeight = Math.max(...variantComponents.map((v) => v.height))

  // Ensure the component set frame is at least as tall as the tallest variant
  // The component set might need to expand to accommodate all variants
  if (componentSet.height < maxHeight) {
    componentSet.resize(componentSet.width, maxHeight + 48) // Add padding
  }

  return componentSet
}
