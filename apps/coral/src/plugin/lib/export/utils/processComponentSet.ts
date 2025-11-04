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
    let breakpointValue = breakpointKey ? componentNode.variantProperties?.[breakpointKey] : null

    // If breakpoint property not found, try to extract from variant name
    // Variants might be named like "min-width-768px", "max-width-1024px", or "base"
    if (!breakpointValue) {
      const variantName = componentNode.name.toLowerCase()
      if (variantName === 'base') {
        breakpointValue = 'base'
      } else {
        // Try to match pattern like "min-width-768px" or "max-width-1024px"
        const nameMatch = variantName.match(/^(min-width|max-width|min-height|max-height)[-:](\d+px)/)
        if (nameMatch) {
          breakpointValue = `${nameMatch[1]}-${nameMatch[2]}`
        } else {
          // Default to base if we can't determine
          breakpointValue = 'base'
        }
      }
    }

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

  // Check if there are any non-breakpoint variant properties
  // If all variants only have breakpoint properties, we should remove componentProperties
  // Otherwise, keep componentProperties but remove the breakpoint property
  if (componentSetData.componentProperties) {
    const normalizedBreakpointKey = normalizeName('breakpoint')

    // Check if all variants have only breakpoint property (or no properties)
    const allVariantsOnlyBreakpoint = variantsWithBreakpoints.every((variant) => {
      const variantProps = variant.variantNode?.variantProperties || {}
      const propKeys = Object.keys(variantProps)
      // Only breakpoint property or no properties
      return propKeys.length === 0 || (propKeys.length === 1 && propKeys[0]?.toLowerCase() === 'breakpoint')
    })

    if (allVariantsOnlyBreakpoint) {
      // All variants are breakpoint-only, remove componentProperties entirely
      componentSetData.componentProperties = undefined
    } else {
      // Some variants have other properties, keep componentProperties but remove breakpoint
      delete componentSetData.componentProperties[normalizedBreakpointKey]

      // If componentProperties is now empty, remove it
      if (Object.keys(componentSetData.componentProperties).length === 0) {
        componentSetData.componentProperties = undefined
      }
    }
  }

  return [componentSetData, designTokens]
}
