import { CoralNode, CoralRootNode, CoralStyleType } from '@reallygoodwork/coral-core'

import { createSVGFrame, isSVGElement, isSVGShapeElement } from './createVector'
import { applyStyles, createFrameWithFillingText } from './styles'
import { textAlign } from './styleText'

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
export const isTextNode = (node: CoralNode | CoralRootNode): node is CoralNode | CoralRootNode => {
  return node.textContent !== undefined
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

  return createElement(spec, effectiveTextAlign) as Promise<SceneNode>
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
