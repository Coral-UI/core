import { CoralNode, CoralRootNode, CoralStyleType } from '@reallygoodwork/coral-core'

import { isCoralColor, textAlign } from '../../types'
import { isInlineElement } from '../assert/isInlineElement'
import { createComponent } from '../components/createComponent'
import { applyStyles } from '../styles/applyStyles'
import { createSVGFrame } from '../vector/createSVGFrame'
import { isSVGElement } from '../vector/isSVGElement'
import { isSVGShapeElement } from '../vector/isSVGShapeElement'
import { createFrame } from './createFrame'
import { createTextandWrapper } from './createTextandWrapper'
import { createTextNode } from './createTextNode'

export const createElement = async (
  node: CoralNode | CoralRootNode,
  textAlign?: textAlign,
  parentStyles: CoralStyleType = {},
): Promise<SceneNode | null> => {
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
  const needsWrapper =
    node.styles &&
    (node.styles['paddingInlineStart'] ||
      node.styles['paddingInlineEnd'] ||
      node.styles['paddingBlockStart'] ||
      node.styles['paddingBlockEnd'] ||
      node.styles['marginInlineStart'] ||
      node.styles['marginInlineEnd'] ||
      node.styles['marginBlockStart'] ||
      node.styles['marginBlockEnd'] ||
      node.styles['backgroundColor'] ||
      node.styles['maxWidth'])

  // If it has direct text content and no children
  if (hasDirectTextContent && (!node.children || node.children.length === 0)) {
    if (needsWrapper) {
      // Create a frame wrapper with text inside
      // The text node gets text-related styles (color, font, etc.)
      // The frame gets box-related styles (backgroundColor, padding, etc.)
      const { frame } = await createTextandWrapper(node, effectiveTextAlign)
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
  const hasInlineTextChildren =
    !hasDirectTextContent &&
    currentNode.children?.some(
      (child) =>
        'textContent' in child &&
        child['textContent'] !== undefined &&
        (!child.children || child.children.length === 0) &&
        // Only merge if child has minimal structure (no significant styles at all)
        !(
          child.styles &&
          (child.styles['paddingInlineStart'] ||
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
            child.styles['letterSpacing'])
        ),
    )

  // Handle SVG elements specially - create frame and process SVG children as vectors
  if (isSVGElement(currentNode)) {
    // Get parent color for currentColor resolution
    const colorValue = combinedStyles?.['color']
    let parentColor: RGB | undefined
    if (isCoralColor(colorValue)) {
      const hex = colorValue.hex.replace('#', '')
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
