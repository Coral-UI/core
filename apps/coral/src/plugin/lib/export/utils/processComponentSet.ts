import { CoralDesignTokenType, CoralRootNode } from '@reallygoodwork/coral-core'

import { VariantWithBreakpoint } from '../../types'
import { buildNodeTree } from '../generate/buildNodeTree'
import { generateComponentSet } from '../generate/generateComponentSet'
import { applyResponsiveStyles } from './applyResponsiveStyles'
import { normalizeName } from './normalizeName'

/**
 * Process a component set with potential responsive variants
 */
export const processComponentSet = async (
  node: ComponentSetNode,
  designTokens: Record<string, CoralDesignTokenType>,
): Promise<[CoralRootNode | null, Record<string, CoralDesignTokenType>]> => {
  const componentSetData = await generateComponentSet(node)

  // Check if this component set has a "breakpoint" property in componentPropertyDefinitions
  const hasBreakpointProperty = Object.keys(node.componentPropertyDefinitions || {}).some(
    (key) => key.toLowerCase() === 'breakpoint',
  )

  if (!hasBreakpointProperty) {
    // Standard component set - process variants normally
    for (const variant of node.children) {
      const [variantData, variantTokens] = await buildNodeTree(variant, designTokens)
      if (variantData && componentSetData.variants) {
        componentSetData.variants.push(variantData)
      }
      Object.assign(designTokens, variantTokens)
    }

    return [componentSetData, designTokens]
  }

  // Responsive component set - build all variants and merge styles
  const variantsWithBreakpoints: VariantWithBreakpoint[] = []

  for (const variant of node.children) {
    const componentNode = variant as ComponentNode

    // Find the breakpoint property key (case-insensitive)
    const breakpointKey = Object.keys(componentNode.variantProperties || {}).find(
      (key) => key.toLowerCase() === 'breakpoint',
    )
    const breakpointValue = breakpointKey ? componentNode.variantProperties?.[breakpointKey] : 'base'

    const [variantData, variantTokens] = await buildNodeTree(componentNode, designTokens)

    if (variantData) {
      variantsWithBreakpoints.push({
        variantNode: componentNode,
        breakpoint: String(breakpointValue),
        nodeData: variantData,
      })
    }

    Object.assign(designTokens, variantTokens)
  }

  // Find the base variant (or use the first one)
  const baseVariant = variantsWithBreakpoints.find((v) => v.breakpoint === 'base') || variantsWithBreakpoints[0]

  if (!baseVariant) {
    return [componentSetData, designTokens]
  }

  // Use base variant as the component structure
  const baseNodeData = baseVariant.nodeData

  // Apply responsive styles by comparing other variants with base
  const otherVariants = variantsWithBreakpoints.filter((v) => v !== baseVariant)

  if (otherVariants.length > 0) {
    applyResponsiveStyles(baseNodeData, otherVariants)
  }

  // Update component set data with the merged structure
  componentSetData.children = baseNodeData.children ?? null
  componentSetData.styles = baseNodeData.styles ?? {}
  componentSetData.responsiveStyles = baseNodeData.responsiveStyles

  // Remove the breakpoint property since it's now internal to the structure
  if (componentSetData.componentProperties) {
    const normalizedBreakpointKey = normalizeName('breakpoint')
    delete componentSetData.componentProperties[normalizedBreakpointKey]
  }

  return [componentSetData, designTokens]
}
