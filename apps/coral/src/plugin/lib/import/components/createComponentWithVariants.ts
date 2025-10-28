import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { textAlign } from '../../types'
import { createElement } from '../create/createElement'
import { collectResponsiveStyles } from '../utils/collectResponsiveStyles'
import { generateVariantName } from '../utils/generateVariantName'
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

  return componentSet
}
