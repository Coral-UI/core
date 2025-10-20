import { CoralDesignTokenType, CoralNode, CoralRootNode, ResponsiveStyle } from '@reallygoodwork/coral-core'

import { generateComponentSet } from './generateComponentSet'
import { generateNode } from './generateNode'
import { handleFigmaStyles } from './handleFigmaStyles'
import { normalizeName } from './normalizeName'

type VariantWithBreakpoint = {
  variantNode: ComponentNode
  breakpoint: string
  nodeData: CoralNode
}

/**
 * Parse breakpoint string into ResponsiveStyle breakpoint format
 * Examples: "min-width:640px", "max-width:1024px", "base"
 */
const parseBreakpoint = (breakpointStr: string): ResponsiveStyle['breakpoint'] | null => {
  if (breakpointStr === 'base') {
    return null // base doesn't need a breakpoint
  }

  const parts = breakpointStr.split(':')
  if (parts.length !== 2) {
    console.warn(`Invalid breakpoint format: ${breakpointStr}. Expected format: "type:value" (e.g., "min-width:640px")`)
    return null
  }

  const [type, value] = parts

  if (type === 'min-width' || type === 'max-width' || type === 'min-height' || type === 'max-height') {
    return {
      type,
      value,
    }
  }

  console.warn(`Invalid breakpoint type: ${type}. Must be one of: min-width, max-width, min-height, max-height`)
  return null
}

/**
 * Build a complete node tree for a single variant
 */
const buildNodeTree = async (
  node: SceneNode,
  designTokens: Record<string, CoralDesignTokenType>,
): Promise<[CoralNode | null, Record<string, CoralDesignTokenType>]> => {
  console.log('node', node)
  const nodeData = await generateNode(node)

  if (nodeData === null) {
    return [null, designTokens]
  }


  // Extract design tokens from current node
  const { designTokens: nodeDesignTokens } = await handleFigmaStyles(node)
  Object.assign(designTokens, nodeDesignTokens)

  // Recursively build children
  if ('children' in node && node.children && node.children.length > 0) {
    for (const childNode of node.children) {
      const [childData, childTokens] = await buildNodeTree(childNode, designTokens)
      if (childData && nodeData.children) {
        nodeData.children.push(childData)
      }
      Object.assign(designTokens, childTokens)
    }
  }

  return [nodeData, designTokens]
}

/**
 * Get only the style properties that differ between two style objects
 * Returns an object with only the changed/new properties
 */
const getStyleDifferences = (baseStyles: any, variantStyles: any): any | null => {
  if (!variantStyles) return null
  if (!baseStyles) return variantStyles

  const differences: any = {}
  let hasDifferences = false

  // Check all properties in variant styles
  for (const [key, value] of Object.entries(variantStyles)) {
    // If the property doesn't exist in base or has a different value, include it
    if (!(key in baseStyles) || JSON.stringify(baseStyles[key]) !== JSON.stringify(value)) {
      differences[key] = value
      hasDifferences = true
    }
  }

  return hasDifferences ? differences : null
}

/**
 * Apply responsive styles from variants to the base node tree
 * This compares each variant's node tree with the base and adds responsive styles
 * where style differences are detected. Deduplicates styles across breakpoints.
 */
const applyResponsiveStyles = (
  baseNode: CoralNode,
  variantsWithBreakpoints: VariantWithBreakpoint[],
): void => {
  // Track styles we've already applied at previous breakpoints
  const appliedStyles: Record<string, any> = { ...baseNode.styles }

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
    const label = breakpointDef.value

    // Get only the styles that differ from what we've already applied (base + previous breakpoints)
    const styleDifferences = getStyleDifferences(appliedStyles, nodeData.styles)

    if (styleDifferences) {
      if (!baseNode.responsiveStyles) {
        baseNode.responsiveStyles = []
      }

      console.log(
        `Node ${baseNode.name} at breakpoint ${label}:`,
        '\n  Applied styles:', appliedStyles,
        '\n  Variant styles:', nodeData.styles,
        '\n  Differences:', styleDifferences
      )

      baseNode.responsiveStyles.push({
        breakpoint: breakpointDef,
        label,
        styles: styleDifferences,
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
      const childVariants: VariantWithBreakpoint[] = variantsWithBreakpoints
        .map(({ breakpoint, nodeData }) => {
          const variantChild = nodeData.children?.[childIndex]
          return variantChild
            ? {
                variantNode: null as any,
                breakpoint,
                nodeData: variantChild,
              }
            : null
        })
        .filter(Boolean) as VariantWithBreakpoint[]

      // Process this child with all its variants at once
      if (childVariants.length > 0) {
        applyResponsiveStyles(baseChild, childVariants)
      }
    })
  }
}

/**
 * Process a component set with potential responsive variants
 */
const processComponentSet = async (
  node: ComponentSetNode,
  designTokens: Record<string, CoralDesignTokenType>,
): Promise<[CoralRootNode | null, Record<string, CoralDesignTokenType>]> => {
  const componentSetData = await generateComponentSet(node)

  // Check if this component set has a "breakpoint" property in componentPropertyDefinitions
  const hasBreakpointProperty = Object.keys(node.componentPropertyDefinitions || {}).some(
    (key) => key.toLowerCase() === 'breakpoint',
  )

  console.log('Component Set:', node.name)
  console.log('Property Definitions:', node.componentPropertyDefinitions)
  console.log('Has Breakpoint Property:', hasBreakpointProperty)

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
    console.log('Variant:', componentNode.name)
    console.log('Variant Properties:', componentNode.variantProperties)

    // Find the breakpoint property key (case-insensitive)
    const breakpointKey = Object.keys(componentNode.variantProperties || {}).find(
      (key) => key.toLowerCase() === 'breakpoint',
    )
    const breakpointValue = breakpointKey ? componentNode.variantProperties?.[breakpointKey] : 'base'

    console.log('Breakpoint Value:', breakpointValue)

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

  console.log('Variants with breakpoints:', variantsWithBreakpoints.map((v) => v.breakpoint))

  // Find the base variant (or use the first one)
  const baseVariant = variantsWithBreakpoints.find((v) => v.breakpoint === 'base') || variantsWithBreakpoints[0]

  if (!baseVariant) {
    return [componentSetData, designTokens]
  }

  console.log('Base variant:', baseVariant.breakpoint)

  // Use base variant as the component structure
  const baseNodeData = baseVariant.nodeData

  // Apply responsive styles by comparing other variants with base
  const otherVariants = variantsWithBreakpoints.filter((v) => v !== baseVariant)
  console.log('Other variants to compare:', otherVariants.map((v) => v.breakpoint))

  if (otherVariants.length > 0) {
    applyResponsiveStyles(baseNodeData, otherVariants)
  }

  console.log('Base node responsive styles after applying:', baseNodeData.responsiveStyles)

  // Update component set data with the merged structure
  componentSetData.children = baseNodeData.children
  componentSetData.styles = baseNodeData.styles
  componentSetData.responsiveStyles = baseNodeData.responsiveStyles

  // Remove the breakpoint property since it's now internal to the structure
  if (componentSetData.componentProperties) {
    const normalizedBreakpointKey = normalizeName('breakpoint')
    delete componentSetData.componentProperties[normalizedBreakpointKey]
  }

  return [componentSetData, designTokens]
}

/**
 * Traverse and build the node tree
 */
const traverseNodes = async (
  node: SceneNode,
  designTokens: Record<string, CoralDesignTokenType> = {},
): Promise<[CoralRootNode | CoralNode | null, Record<string, CoralDesignTokenType>]> => {
  if (node.type === 'COMPONENT_SET') {
    return processComponentSet(node as ComponentSetNode, designTokens)
  }

  // Regular node or component
  const nodeData = await generateNode(node)

  if (nodeData === null) {
    return [null, designTokens]
  }

  // Extract design tokens from current node
  const { designTokens: nodeDesignTokens } = await handleFigmaStyles(node)
  Object.assign(designTokens, nodeDesignTokens)

  // Handle children
  if ('children' in node && node.children && node.children.length > 0) {
    for (const childNode of node.children) {
      const [childData, childTokens] = await traverseNodes(childNode, designTokens)
      if (childData && nodeData.children) {
        nodeData.children.push(childData)
      }
      Object.assign(designTokens, childTokens)
    }
  }

  return [nodeData, designTokens]
}

export async function exportSpec(): Promise<CoralRootNode | null> {
  const selection = figma.currentPage.selection

  if (selection.length === 0) {
    figma.notify('Please select a node to extract schema from')
    return null
  }

  const rootNode = selection[0]

  try {
    const [schema, designTokens] = await traverseNodes(rootNode as SceneNode)

    if (schema === null) {
      return null
    }

    // Ensure root-level properties
    const rootSchema: CoralRootNode = {
      ...schema,
      $schema: 'https://coral.design/schema.json',
      designTokens: Object.keys(designTokens).length > 0 ? designTokens : undefined,
    }

    return rootSchema
  } catch (error) {
    console.error('Error exporting schema:', error)
    figma.notify(`Error exporting: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return null
  }
}
