import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { applyPaint } from './applyPaint'
import { isTextNode, nodeHasTextChildren } from './importSpec'
import { applyTypographyStyles, textAlign, transformFontWeightToFigmaFontStyle } from './styleText'

const shouldApplyAutoLayout = (node: CoralNode | CoralRootNode) => {
  if (node.textContent && nodeHasTextChildren(node)) {
    return false
  }

  return (
    Object.prototype.hasOwnProperty.call(node.styles, 'marginInlineStart') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'marginInlineEnd') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'marginBlockStart') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'marginBlockEnd') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'paddingInlineStart') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'paddingInlineEnd') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'paddingBlockStart') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'paddingBlockEnd')
  )
}

const childRequiresAutoLayout = (node: CoralNode | CoralRootNode) => {
  return node.children?.some((child) => shouldApplyAutoLayout(child)) ?? false
}

const applyAutoLayout = (element: ElementWithOptionalText, shouldFill: boolean = false, node?: CoralNode | CoralRootNode) => {
  // Step 3: Enable autoLayout (must happen after children are added)
  element.layoutMode = 'VERTICAL'

  // Step 4 & 5: Set sizing (must happen after autoLayout)
  element.layoutSizingHorizontal = shouldFill ? 'FILL' : 'HUG'

  // Only set fixed height if explicitly specified, otherwise hug contents
  if (node?.styles?.['height'] && typeof node.styles['height'] === 'number') {
    element.layoutSizingVertical = 'FIXED'
    element.resize(element.width, node.styles['height'] as number)
  } else {
    element.layoutSizingVertical = 'HUG'
  }

  return element
}

const applyFlexDirection = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  if (node.styles?.['display'] === 'flex') {
    if (node.styles?.['flexDirection'] === 'column' || node.styles?.['flexDirection'] === 'column-reverse') {
      element.layoutMode = 'VERTICAL'
    } else {
      element.layoutMode = 'HORIZONTAL'
    }
  }
}

const applyPadding = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  if (node.styles?.['paddingInlineStart']) {
    element.paddingLeft = node.styles?.['paddingInlineStart'] as number
  }

  if (node.styles?.['paddingInlineEnd']) {
    element.paddingRight = node.styles?.['paddingInlineEnd'] as number
  }

  if (node.styles?.['paddingBlockStart']) {
    element.paddingTop = node.styles?.['paddingBlockStart'] as number
  }

  if (node.styles?.['paddingBlockEnd']) {
    element.paddingBottom = node.styles?.['paddingBlockEnd'] as number
  }
}

const applyMarginToFrame = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  if (node.styles?.['marginInlineStart']) {
    element.paddingLeft = node.styles?.['marginInlineStart'] as number
  }

  if (node.styles?.['marginInlineEnd']) {
    element.paddingRight = node.styles?.['marginInlineEnd'] as number
  }

  if (node.styles?.['marginBlockStart']) {
    element.paddingTop = node.styles?.['marginBlockStart'] as number
  }

  if (node.styles?.['marginBlockEnd']) {
    element.paddingBottom = node.styles?.['marginBlockEnd'] as number
  }
}

export const applyMaxWidth = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  if (node.styles?.['maxWidth']) {
    // element.layoutSizingHorizontal = 'HUG'
    element.maxWidth = node.styles?.['maxWidth'] as number
    element.resize(node.styles?.['maxWidth'] as number, element.height)
  }
}

export type Element = FrameNode | ComponentNode | InstanceNode | TextNode
type ElementWithOptionalText = FrameNode | ComponentNode | InstanceNode

// Add this new function
export const createFrameWithFillingText = async (node: CoralNode) => {
  const styles = {
    ...node.styles,
  }

  const textContent = node.children?.find((child) => 'textContent' in child)?.textContent ?? node.textContent

  // Step 1: Create the frame
  const frame = figma.createFrame()

  const fontFamily = (styles?.['fontFamily'] as string) ?? 'Inter'
  const fontWeight = (styles?.['fontWeight'] as number) ?? 400
  const fontStyle = transformFontWeightToFigmaFontStyle(fontWeight)

  // Step 2: Create and immediately append the text node
  const textNode = figma.createText()

  // Try to load the font, with fallbacks
  let loadedFontStyle = fontStyle
  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle })
  } catch (error) {
    // Try with space in style name (e.g., "Semi Bold" instead of "SemiBold")
    const styleWithSpace = fontStyle.replace(/([A-Z])/g, ' $1').trim()
    try {
      await figma.loadFontAsync({ family: fontFamily, style: styleWithSpace })
      loadedFontStyle = styleWithSpace
    } catch {
      // Fall back to Regular
      await figma.loadFontAsync({ family: fontFamily, style: 'Regular' })
      loadedFontStyle = 'Regular'
    }
  }

  textNode.fontName = { family: fontFamily, style: loadedFontStyle }

  textNode.characters = textContent ?? ''

  frame.appendChild(textNode)

  // Enable auto-layout first before setting sizing properties
  frame.layoutMode = 'VERTICAL'

  // Now that the frame has auto-layout, we can set sizing properties
  frame.layoutSizingVertical = 'HUG'
  frame.layoutSizingHorizontal = 'HUG'
  textNode.layoutSizingHorizontal = 'FILL'

  // Set text alignment based on styles
  if (styles?.['textAlign']) {
    textNode.textAlignHorizontal = (styles['textAlign'] as string).toUpperCase() as TextNode['textAlignHorizontal']
  }

  applyMarginToFrame(frame, node)
  applyTypographyStyles(textNode, styles)
  textNode.textAlignHorizontal = 'LEFT'

  return { frame, textNode }
}

// Modify applyStyles to handle this special case
export const applyStyles = async (element: Element, node: CoralNode | CoralRootNode, addTextAlign?: textAlign) => {
  // Special case for text nodes that should fill
  if (isTextNode(node) && node.styles?.['width'] === '100%') {
    // Only set layoutSizingHorizontal if the element is in an auto-layout frame
    if ('layoutSizingHorizontal' in element && element.parent && 'layoutMode' in element.parent && element.parent.layoutMode !== 'NONE') {
      element.layoutSizingHorizontal = 'FILL'
    }
    // Don't return early for text nodes - they need other styles applied
  }

  // Auto-layout is now enabled by default in createFrame/createComponent
  // Here we just need to apply specific style overrides

  if (element.type !== 'TEXT' && 'layoutMode' in element) {
    // Override sizing if width is specified
    const shouldFill = node.styles?.['width'] === '100%' || node.styles?.['width'] === 'fill'
    if (shouldFill) {
      element.layoutSizingHorizontal = 'FILL'
    }

    // Override height if explicitly specified
    if (node.styles?.['height'] && typeof node.styles['height'] === 'number') {
      element.layoutSizingVertical = 'FIXED'
      element.resize(element.width, node.styles['height'] as number)
    }

    // Apply flex direction
    applyFlexDirection(element as ElementWithOptionalText, node)

    // Apply padding if specified
    applyPadding(element as ElementWithOptionalText, node)

    // Apply max width if specified
    applyMaxWidth(element as ElementWithOptionalText, node)

    // IMPORTANT: textAlign should NOT affect frame sizing or layout
    // It only applies to child text nodes, not the container frame itself
  }

  if (isTextNode(node) && element.type === 'TEXT') {
    // Apply typography styles to actual text nodes
    await applyTypographyStyles(element as TextNode, node.styles || {}, addTextAlign)
  } else if (addTextAlign && isTextNode(node) && node.styles?.['textAlign']) {
    // Only apply text alignment to text nodes, not frames
    ;(element as TextNode).textAlignHorizontal = (node.styles?.['textAlign'] as string).toUpperCase() as TextNode['textAlignHorizontal'] ?? 'LEFT'
  }

  if (node.styles) {
    Object.entries(node.styles).forEach(([key]) => {
      if (key === 'backgroundColor') {
        if (!nodeHasTextChildren(node) && element.type !== 'TEXT') {
          applyPaint(element, node)
        }
      }

      // Color should NEVER be applied to frames - it's only for text fills
      // It's already handled by applyTypographyStyles for actual text nodes
    })
  }
}
