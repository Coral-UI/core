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

const applyAutoLayout = (element: ElementWithOptionalText, shouldFill: boolean = false) => {
  // Step 3: Enable autoLayout (must happen after children are added)
  element.layoutMode = 'VERTICAL'

  // Step 4 & 5: Set sizing (must happen after autoLayout)
  element.layoutSizingHorizontal = shouldFill ? 'FILL' : 'HUG'
  element.layoutSizingVertical = 'HUG'

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

  const textContent = node.children?.find((child) => 'textContent' in child)?.textContent

  // Step 1: Create the frame
  const frame = figma.createFrame()

  const fontFamily = (styles?.['fontFamily'] as string) ?? 'Inter'
  const fontWeight = (styles?.['fontWeight'] as number) ?? 400
  const fontStyle = transformFontWeightToFigmaFontStyle(fontWeight)

  // Step 2: Create and immediately append the text node
  const textNode = figma.createText()

  if (fontStyle !== 'Regular' || fontFamily !== 'Inter') {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle })
  } else {
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
  }

  textNode.fontName = { family: fontFamily, style: fontStyle }

  textNode.characters = textContent ?? ''

  frame.appendChild(textNode)

  // await wait(2000)
  setTimeout(() => {
    frame.layoutSizingHorizontal = 'FILL'
    textNode.layoutSizingHorizontal = 'FILL'
    textNode.textAlignHorizontal = 'CENTER'
    frame.layoutSizingVertical = 'HUG'
  }, 2000)

  applyMarginToFrame(frame, node)
  applyTypographyStyles(textNode, styles)
  textNode.textAlignHorizontal = 'LEFT'

  return { frame, textNode }
}

// Modify applyStyles to handle this special case
export const applyStyles = async (element: Element, node: CoralNode | CoralRootNode, addTextAlign?: textAlign) => {
  // Special case for text nodes that should fill
  if (isTextNode(node) && node.styles?.['width'] === '100%') {
    element.layoutSizingHorizontal = 'FILL'
    return
  }

  // Step 1 & 2 happen before this function is called (frame creation and child appending)

  if (!nodeHasTextChildren(node) && (childRequiresAutoLayout(node) || shouldApplyAutoLayout(node))) {
    // Step 3, 4, 5: Apply autoLayout and sizing
    const shouldFill = node.styles?.['width'] === '100%' || node.styles?.['width'] === 'fill'
    applyAutoLayout(element as ElementWithOptionalText, shouldFill)

    applyFlexDirection(element as ElementWithOptionalText, node)
    applyPadding(element as ElementWithOptionalText, node)
    applyMaxWidth(element as ElementWithOptionalText, node)
  }

  if (isTextNode(node)) {
    // await applyTypographyStyles(element as TextNode, node, addTextAlign)
    // styles = {}
    // Apply layoutSizingHorizontal if shouldHugHorizontal is true
  }

  if (shouldApplyAutoLayout(node) && node.styles?.['textAlign']) {
    if ('counterAxisAlignItems' in element) {
      element.counterAxisAlignItems = 'CENTER'
    }
  } else if (addTextAlign && isTextNode(node) && node.styles?.['textAlign']) {
    ;(element as TextNode).textAlignHorizontal = node.styles?.['textAlign'] as TextNode['textAlignHorizontal']
  }

  if (node.styles) {
    Object.entries(node.styles).forEach(([key]) => {
      if (key === 'backgroundColor') {
        if (!nodeHasTextChildren(node)) {
          applyPaint(element, node)
        }
      }

      if (key === 'color' && isTextNode(node)) {
        applyPaint(element, node)
        // console.log('color', value)
      }
    })
  }
}
