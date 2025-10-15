import { CoralNode, CoralRootNode, CoralStyleType } from '@reallygoodwork/coral-core'

import { createSVGFrame, isSVGElement, isSVGShapeElement } from './createVector'
import { applyStyles, createFrameWithFillingText } from './styles'
import { textAlign } from './styleText'

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
export const isTextNode = (node: CoralNode | CoralRootNode): node is CoralNode | CoralRootNode => {
  return node.textContent !== undefined
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

  // Check if this node has textContent directly on it (not just in children)
  const hasDirectTextContent = 'textContent' in node && node.textContent !== undefined && node.textContent !== ''

  // Check if node needs a wrapper frame (has padding, margin, or background)
  const needsWrapper = node.styles && (
    node.styles['paddingInlineStart'] ||
    node.styles['paddingInlineEnd'] ||
    node.styles['paddingBlockStart'] ||
    node.styles['paddingBlockEnd'] ||
    node.styles['marginInlineStart'] ||
    node.styles['marginInlineEnd'] ||
    node.styles['marginBlockStart'] ||
    node.styles['marginBlockEnd'] ||
    node.styles['backgroundColor']
  )

  // If it has direct text content and no children
  if (hasDirectTextContent && (!node.children || node.children.length === 0)) {
    if (needsWrapper) {
      // Create a frame wrapper with text inside
      const { frame } = await createTextandWrapper(node)
      frame.name = node.name
      await applyStyles(frame, node, textAlign)
      return frame
    } else {
      // Just create a text node directly
      const textNode = await createTextNode(node)
      await applyStyles(textNode, node, textAlign)
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
    const { frame } = await createTextandWrapper(node)
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

  // Process children (skip for SVG elements as they're handled by createSVGFrame)
  if (!isSVGElement(currentNode) && 'children' in node && currentNode.children) {
    // Process children in sequence to maintain order
    for (const child of currentNode.children) {
      try {
        const childElement = await createElement(child, textAlign, combinedStyles)
        if (childElement && 'appendChild' in element) {
          console.log(`Appending ${child.name} to ${currentNode.name}`)
          element.appendChild(childElement)
        } else if (!childElement) {
          console.warn(`Child element ${child.name} was null, skipping`)
        }
      } catch (error) {
        console.error(`Error creating child element ${child.name}:`, error)
        // Continue processing other children even if one fails
      }
    }
  }

  // If element has both children AND textContent, add the text as a final child
  if (hasDirectTextContent && node.children && node.children.length > 0 && 'appendChild' in element) {
    const textNode = await createTextNode(node)
    await applyStyles(textNode, node, textAlign)
    element.appendChild(textNode)
  }

  // Apply styles (skip for SVG elements as createSVGFrame already handles sizing)
  if (!isSVGElement(currentNode)) {
    await applyStyles(element, node, textAlign)
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

async function createTextandWrapper(spec: CoralNode) {
  const { frame, textNode } = await createFrameWithFillingText(spec)
  return { frame, textNode }
}

async function createFrame(spec: CoralNode) {
  const frame = figma.createFrame()
  frame.name = spec.name

  // Enable auto-layout by default with HUG sizing (like HTML divs)
  frame.layoutMode = 'VERTICAL'
  frame.layoutSizingHorizontal = 'HUG'
  frame.layoutSizingVertical = 'HUG'

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
