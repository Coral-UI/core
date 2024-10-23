import { CoralColorType, CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { applyPaint } from './applyPaint'
import { isTextNode, nodeHasTextChildren } from './importSpec'
import { applyTypographyStyles, textAlign } from './styleText'

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

const applyAutoLayout = (element: ElementWithOptionalText) => {
  element.layoutMode = 'VERTICAL'
  element.layoutSizingHorizontal = 'HUG'
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

export const applyMaxWidth = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  if (node.styles?.['maxWidth']) {
    // element.layoutSizingHorizontal = 'HUG'
    element.maxWidth = node.styles?.['maxWidth'] as number
    element.resize(node.styles?.['maxWidth'] as number, element.height)
  }
}

export type Element = FrameNode | ComponentNode | InstanceNode | TextNode
type ElementWithOptionalText = FrameNode | ComponentNode | InstanceNode

export const applyStyles = async (element: Element, node: CoralNode | CoralRootNode, addTextAlign?: textAlign) => {
  if (!nodeHasTextChildren(node) && (childRequiresAutoLayout(node) || shouldApplyAutoLayout(node))) {
    applyAutoLayout(element as ElementWithOptionalText)

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
