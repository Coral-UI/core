import { CoralNode, CoralRootNode, CoralStyleType, ResponsiveStyle } from '@reallygoodwork/coral-core'

import { createSVGFrame, isSVGElement, isSVGShapeElement } from './createVector'
import { applyStyles, createFrameWithFillingText } from './styles'
import { textAlign } from './styleText'

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
export const isTextNode = (node: CoralNode | CoralRootNode): node is CoralNode | CoralRootNode => {
  return node.textContent !== undefined
}

// Recursively check if a node or any of its descendants has responsiveStyles
export const hasResponsiveStyles = (node: CoralNode | CoralRootNode): boolean => {
  if (node.responsiveStyles && node.responsiveStyles.length > 0) {
    return true
  }

  if (node.children) {
    return node.children.some(child => hasResponsiveStyles(child))
  }

  return false
}

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

// Generate a variant name from a responsive style
export const generateVariantName = (responsiveStyle: ResponsiveStyle): string => {
  // Use label if provided
  if (responsiveStyle.label) {
    return responsiveStyle.label
  }

  // Otherwise generate from breakpoint
  const bp = responsiveStyle.breakpoint

  // Check if it's a range breakpoint
  if ('min' in bp || 'max' in bp) {
    const parts: string[] = []
    if (bp.min) {
      parts.push(`${bp.min.type}:${bp.min.value}`)
    }
    if (bp.max) {
      parts.push(`${bp.max.type}:${bp.max.value}`)
    }
    return parts.join(' AND ')
  }

  // Simple breakpoint
  return `${bp.type}:${bp.value}`
}

// Pre-compute all merged styles for each node at each breakpoint
// This creates a lookup: node -> breakpoint -> fully merged styles
const precomputeMergedStylesForAllNodes = (
  node: CoralNode | CoralRootNode,
  sortedResponsiveStyles: ResponsiveStyle[]
): Map<CoralNode | CoralRootNode, Map<string, CoralStyleType>> => {
  const styleMap = new Map<CoralNode | CoralRootNode, Map<string, CoralStyleType>>()

  const processNode = (currentNode: CoralNode | CoralRootNode) => {
    const nodeBreakpointStyles = new Map<string, CoralStyleType>()

    // For each breakpoint, compute the fully cascaded styles for this node
    let accumulatedStyles: CoralStyleType = { ...currentNode.styles }

    for (const responsiveStyle of sortedResponsiveStyles) {
      const breakpointKey = JSON.stringify(responsiveStyle.breakpoint)

      // Check if this node has styles for this breakpoint
      const nodeResponsiveStyle = currentNode.responsiveStyles?.find(rs =>
        JSON.stringify(rs.breakpoint) === breakpointKey
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

    // Recursively process children
    if (currentNode.children) {
      for (const child of currentNode.children) {
        processNode(child)
      }
    }
  }

  processNode(node)
  return styleMap
}

// Apply precomputed styles to a node tree for a specific breakpoint
const applyPrecomputedStyles = (
  node: CoralNode | CoralRootNode,
  breakpoint: ResponsiveStyle['breakpoint'],
  styleMap: Map<CoralNode | CoralRootNode, Map<string, CoralStyleType>>
): CoralNode | CoralRootNode => {
  const breakpointKey = JSON.stringify(breakpoint)
  const nodeStyles = styleMap.get(node)?.get(breakpointKey)

  // Create new node with precomputed styles
  const newNode: CoralNode | CoralRootNode = {
    ...node,
    styles: nodeStyles || node.styles,
  }

  // Recursively apply to children
  if (newNode.children) {
    newNode.children = newNode.children.map(child =>
      applyPrecomputedStyles(child, breakpoint, styleMap)
    )
  }

  return newNode
}

// Parse breakpoint value to number for sorting (convert px, rem, em to comparable values)
const parseBreakpointValue = (value: string): number => {
  const numValue = parseFloat(value)
  if (value.endsWith('rem') || value.endsWith('em')) {
    return numValue * 16 // Convert rem/em to px (assuming 16px base)
  }
  return numValue // Assume px
}

// Sort responsive styles by breakpoint order (mobile-first: smallest to largest)
export const sortResponsiveStylesByBreakpoint = (styles: ResponsiveStyle[]): ResponsiveStyle[] => {
  return [...styles].sort((a, b) => {
    // Handle simple breakpoints
    const aBreakpoint = a.breakpoint
    const bBreakpoint = b.breakpoint

    // Get the minimum value for each breakpoint
    let aValue: number
    let bValue: number

    if ('min' in aBreakpoint && aBreakpoint.min) {
      aValue = parseBreakpointValue(aBreakpoint.min.value)
    } else if ('max' in aBreakpoint && aBreakpoint.max) {
      aValue = parseBreakpointValue(aBreakpoint.max.value)
    } else if ('type' in aBreakpoint) {
      aValue = parseBreakpointValue(aBreakpoint.value)
    } else {
      aValue = 0
    }

    if ('min' in bBreakpoint && bBreakpoint.min) {
      bValue = parseBreakpointValue(bBreakpoint.min.value)
    } else if ('max' in bBreakpoint && bBreakpoint.max) {
      bValue = parseBreakpointValue(bBreakpoint.max.value)
    } else if ('type' in bBreakpoint) {
      bValue = parseBreakpointValue(bBreakpoint.value)
    } else {
      bValue = 0
    }

    // Sort by value (smaller first for mobile-first approach)
    return aValue - bValue
  })
}

// Determine if an element should use horizontal layout (inline elements)
export const isInlineElement = (node: CoralNode | CoralRootNode): boolean => {
  const inlineElements = ['a', 'span', 'strong', 'em', 'b', 'i', 'u', 'code', 'abbr', 'cite', 'kbd', 'mark', 'small', 'sub', 'sup', 'time']
  return inlineElements.includes(node.elementType)
}

export const nodeHasTextChildren = (node: CoralNode | CoralRootNode) => {
  return node.children?.some((child) => isTextNode(child)) ?? false
}

export const buildNodeText = (node: CoralNode | CoralRootNode) => {
  return node.children?.map((child) => child['textContent']).join(' ') ?? ''
}

export const nodeHasChildrenWithMargin = (node: CoralNode | CoralRootNode) => {
  return (
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['marginInlineStart']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['marginInlineEnd']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['marginBlockStart']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['marginBlockEnd']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['paddingInlineStart']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['paddingInlineEnd']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['paddingBlockStart']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['paddingBlockEnd'])
  )
}

export const createElements = (spec: CoralRootNode | CoralNode, textAlign?: textAlign) => {
  const parentTextAlign = spec.styles?.['textAlign'] as textAlign | undefined
  const effectiveTextAlign = parentTextAlign || textAlign

  // Check if this spec or any of its descendants has responsive styles
  if (hasResponsiveStyles(spec)) {
    // Create a component set with variants
    return createComponentWithVariants(spec, effectiveTextAlign) as Promise<SceneNode>
  }

  // Otherwise, create a regular component (all imports become components by default)
  return createElementAsComponent(spec, effectiveTextAlign) as Promise<SceneNode>
}

// Modified to always return components for top-level elements
async function createElementAsComponent(
  spec: CoralNode | CoralRootNode,
  textAlign?: textAlign
): Promise<ComponentNode> {
  // Create the element structure first
  const element = await createElement(spec, textAlign)

  // Convert to component if it isn't already
  if (element && element.type === 'COMPONENT') {
    return element as ComponentNode
  }

  if (element) {
    return figma.createComponentFromNode(element)
  }

  // Fallback: create an empty component
  const component = figma.createComponent()
  component.name = spec.name
  return component
}

async function createElement(
  node: CoralNode | CoralRootNode,
  textAlign?: textAlign,
  parentStyles: CoralStyleType = {},
): Promise<SceneNode | null> {
  const currentNode = node as CoralNode

  // Don't create separate nodes for SVG shape elements - they're handled by their parent SVG
  if (isSVGShapeElement(currentNode)) {
    return null
  }

  // Inherit textAlign from parent, but override if this node has its own textAlign
  const nodeTextAlign = node.styles?.['textAlign'] as textAlign | undefined
  const effectiveTextAlign = nodeTextAlign || textAlign

  // Check if this node has textContent directly on it (not just in children)
  const hasDirectTextContent = 'textContent' in node && node.textContent !== undefined && node.textContent !== ''

  // Check if node needs a wrapper frame (has padding, margin, background, or maxWidth)
  const needsWrapper = node.styles && (
    node.styles['paddingInlineStart'] ||
    node.styles['paddingInlineEnd'] ||
    node.styles['paddingBlockStart'] ||
    node.styles['paddingBlockEnd'] ||
    node.styles['marginInlineStart'] ||
    node.styles['marginInlineEnd'] ||
    node.styles['marginBlockStart'] ||
    node.styles['marginBlockEnd'] ||
    node.styles['backgroundColor'] ||
    node.styles['maxWidth']
  )

  // If it has direct text content and no children
  if (hasDirectTextContent && (!node.children || node.children.length === 0)) {
    if (needsWrapper) {
      // Create a frame wrapper with text inside
      // The text node gets text-related styles (color, font, etc.)
      // The frame gets box-related styles (backgroundColor, padding, etc.)
      const { frame, textNode } = await createTextandWrapper(node, effectiveTextAlign)
      frame.name = node.name
      // Apply box model styles to frame only
      await applyStyles(frame, node, effectiveTextAlign)
      // Text styles (including inherited textAlign) are already applied in createTextandWrapper
      return frame
    } else {
      // Just create a text node directly
      const textNode = await createTextNode(node)
      await applyStyles(textNode, node, effectiveTextAlign)
      return textNode
    }
  }

  let element: SceneNode

  const combinedStyles =
    'styles' in currentNode && currentNode.styles
      ? 'textContent' in node
        ? { ...parentStyles, ...currentNode.styles }
        : currentNode.styles
      : parentStyles

  // Check if children have textContent AND no other properties (inline text children)
  // We don't want to merge structural elements like <h2>, <dt>, <dd> into one text node
  // Only true inline text without any distinguishing styles should be merged
  const hasInlineTextChildren = !hasDirectTextContent && currentNode.children?.some(
    (child) => 'textContent' in child && child['textContent'] !== undefined &&
    (!child.children || child.children.length === 0) &&
    // Only merge if child has minimal structure (no significant styles at all)
    !(child.styles && (
      child.styles['paddingInlineStart'] ||
      child.styles['paddingInlineEnd'] ||
      child.styles['paddingBlockStart'] ||
      child.styles['paddingBlockEnd'] ||
      child.styles['marginInlineStart'] ||
      child.styles['marginInlineEnd'] ||
      child.styles['marginBlockStart'] ||
      child.styles['marginBlockEnd'] ||
      child.styles['backgroundColor'] ||
      child.styles['fontSize'] ||
      child.styles['fontWeight'] ||
      child.styles['lineHeight'] ||
      child.styles['letterSpacing']
    ))
  )

  // Handle SVG elements specially - create frame and process SVG children as vectors
  if (isSVGElement(currentNode)) {
    // Get parent color for currentColor resolution
    const parentColorHex = (combinedStyles?.['color'] as any)?.hex
    let parentColor: RGB | undefined
    if (parentColorHex && typeof parentColorHex === 'string') {
      const hex = parentColorHex.replace('#', '')
      parentColor = {
        r: parseInt(hex.substring(0, 2), 16) / 255,
        g: parseInt(hex.substring(2, 4), 16) / 255,
        b: parseInt(hex.substring(4, 6), 16) / 255,
      }
    }

    // Create SVG frame with vector children
    element = await createSVGFrame(currentNode, parentColor)
  } else if (hasInlineTextChildren) {
    const { frame } = await createTextandWrapper(node, effectiveTextAlign)
    element = frame
  } else if ('type' in node && currentNode.type === 'COMPONENT') {
    element = await createComponent(node)
  } else {
    element = await createFrame(node)
  }

  // Apply layout settings if a child with textContent exists and element supports layoutMode
  if (hasInlineTextChildren && 'layoutMode' in element) {
    element.layoutMode = 'VERTICAL'
    element.layoutSizingVertical = 'HUG'
    element.layoutSizingHorizontal = 'HUG'
    element.primaryAxisAlignItems = 'MIN'
    element.counterAxisAlignItems = 'MIN'
  }

  // If element has both children AND textContent, add the text as the FIRST child
  // This matches typical HTML where parent text content comes before child elements
  if (hasDirectTextContent && node.children && node.children.length > 0 && 'appendChild' in element) {
    const textNode = await createTextNode(node)
    await applyStyles(textNode, node, effectiveTextAlign)
    element.appendChild(textNode)
    // Set text node sizing: FILL for block elements (for proper text alignment),
    // HUG for inline elements (for natural content flow)
    textNode.layoutSizingHorizontal = isInlineElement(node) ? 'HUG' : 'FILL'
  }

  // Process children (skip for SVG elements as they're handled by createSVGFrame)
  if (!isSVGElement(currentNode) && 'children' in node && currentNode.children) {
    // Determine if current element is inline (affects child text node sizing)
    const isParentInline = isInlineElement(node)

    // Process children in sequence to maintain order
    for (const child of currentNode.children) {
      try {
        // Pass down the effective textAlign so children inherit it
        const childElement = await createElement(child, effectiveTextAlign, combinedStyles)
        if (childElement && 'appendChild' in element) {
          console.log(`Appending ${child.name} to ${currentNode.name}`)
          element.appendChild(childElement)
          // Set text node sizing: FILL for block parents (for proper text alignment),
          // HUG for inline parents (for natural content flow)
          if (childElement.type === 'TEXT') {
            childElement.layoutSizingHorizontal = isParentInline ? 'HUG' : 'FILL'
          }
        } else if (!childElement) {
          console.warn(`Child element ${child.name} was null, skipping`)
        }
      } catch (error) {
        console.error(`Error creating child element ${child.name}:`, error)
        // Continue processing other children even if one fails
      }
    }
  }

  // Apply styles (skip for SVG elements as createSVGFrame already handles sizing)
  if (!isSVGElement(currentNode)) {
    await applyStyles(element, node, effectiveTextAlign)
  }

  return element
}

async function createTextNode(spec: CoralNode) {
  const textNode = figma.createText()

  const fontFamily = (spec.styles?.['fontFamily'] as string) ?? 'Inter'
  const fontWeight = (spec.styles?.['fontWeight'] as number) ?? 400

  // Import font style transformation
  const transformFontWeightToFigmaFontStyle = (weight: number): string => {
    if (weight >= 700) return 'Bold'
    if (weight >= 600) return 'SemiBold'
    if (weight >= 500) return 'Medium'
    return 'Regular'
  }

  const fontStyle = transformFontWeightToFigmaFontStyle(fontWeight)

  // Try to load the font, with fallbacks
  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle })
    textNode.fontName = { family: fontFamily, style: fontStyle }
  } catch (error) {
    // Try with space in style name (e.g., "Semi Bold" instead of "SemiBold")
    const styleWithSpace = fontStyle.replace(/([A-Z])/g, ' $1').trim()
    try {
      await figma.loadFontAsync({ family: fontFamily, style: styleWithSpace })
      textNode.fontName = { family: fontFamily, style: styleWithSpace }
    } catch {
      // Fall back to Regular
      await figma.loadFontAsync({ family: fontFamily, style: 'Regular' })
      textNode.fontName = { family: fontFamily, style: 'Regular' }
    }
  }

  textNode.characters = spec.textContent ?? ''
  textNode.name = spec.name

  return textNode
}

async function createTextandWrapper(spec: CoralNode, textAlign?: textAlign) {
  const { frame, textNode } = await createFrameWithFillingText(spec, textAlign)
  return { frame, textNode }
}

async function createFrame(spec: CoralNode) {
  const frame = figma.createFrame()
  frame.name = spec.name

  // Enable auto-layout by default with HUG sizing
  // Use horizontal layout for inline elements (a, span, etc.), vertical for block elements
  const isInline = isInlineElement(spec)
  frame.layoutMode = isInline ? 'HORIZONTAL' : 'VERTICAL'
  frame.layoutSizingHorizontal = 'HUG'
  frame.layoutSizingVertical = 'HUG'

  // Center-align inline elements vertically
  if (isInline) {
    frame.counterAxisAlignItems = 'CENTER'
  }

  await applyStyles(frame, spec)
  return frame
}

async function createComponent(spec: CoralNode) {
  const component = figma.createComponent()
  component.name = spec.name

  // Enable auto-layout by default with HUG sizing
  component.layoutMode = 'VERTICAL'
  component.layoutSizingHorizontal = 'HUG'
  component.layoutSizingVertical = 'HUG'

  await applyStyles(component, spec)
  return component
}

// Create a component set with variants for responsive styles
async function createComponentWithVariants(
  spec: CoralNode | CoralRootNode,
  textAlign?: textAlign
): Promise<ComponentSetNode> {
  // Collect all responsive styles from the spec tree
  const allResponsiveStyles = collectResponsiveStyles(spec)

  // Deduplicate by breakpoint (keep first occurrence of each unique breakpoint)
  const uniqueResponsiveStyles = allResponsiveStyles.filter((style, index, self) =>
    index === self.findIndex(s =>
      JSON.stringify(s.breakpoint) === JSON.stringify(style.breakpoint)
    )
  )

  // Sort responsive styles by breakpoint order (mobile-first: smallest to largest)
  const sortedResponsiveStyles = sortResponsiveStylesByBreakpoint(uniqueResponsiveStyles)

  // Pre-compute all merged styles for every node at every breakpoint
  const styleMap = precomputeMergedStylesForAllNodes(spec, sortedResponsiveStyles)

  // Create base variant (without any responsive overrides)
  const baseSpec = { ...spec }
  const baseNode = await createElement(baseSpec, textAlign) as ComponentNode

  // Convert to component if it isn't already
  const baseComponent = baseNode.type === 'COMPONENT'
    ? baseNode
    : figma.createComponentFromNode(baseNode)

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
    const variantNode = await createElement(mergedSpec, textAlign) as ComponentNode

    // Convert to component if it isn't already
    const variantComponent = variantNode.type === 'COMPONENT'
      ? variantNode
      : figma.createComponentFromNode(variantNode)

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
