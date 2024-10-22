import { CoralColorType, CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { isTextNode, nodeHasTextChildren } from './importSpec'
import { textAlign } from './styleText'

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

export const applyStyles = async (
  element: Element,
  // importedStyles: Record<string, unknown> | CoralStyleType,
  node: CoralNode | CoralRootNode,
  addTextAlign?: textAlign,
) => {
  // let styles = importedStyles
  // if (nodeHasTextChildren(node)) {
  //   if (node.styles) {
  //     styles = node.styles
  //   }

  //   // return styles
  // }

  if (!nodeHasTextChildren(node) && (childRequiresAutoLayout(node) || shouldApplyAutoLayout(node))) {
    applyAutoLayout(element as ElementWithOptionalText)

    applyFlexDirection(element as ElementWithOptionalText, node)
    applyPadding(element as ElementWithOptionalText, node)
    applyMaxWidth(element as ElementWithOptionalText, node)
  }

  if (isTextNode(node)) {
    await applyTypographyStyles(element as TextNode, node, addTextAlign)
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

// TODO: fix this
function clone(val: any): any {
  const type = typeof val
  if (val === null) {
    return null
  } else if (type === 'undefined' || type === 'number' || type === 'string' || type === 'boolean') {
    return val
  } else if (type === 'object') {
    if (val instanceof Array) {
      return val.map((x) => clone(x))
    } else if (val instanceof Uint8Array) {
      return new Uint8Array(val)
    } else {
      const o = {}
      for (const key in val) {
        o[key] = clone(val[key])
      }
      return o
    }
  }
  throw 'unknown'
}

const applyPaint = (element: Element, node: CoralNode | CoralRootNode) => {
  const backgroundColor = node.styles?.['backgroundColor'] as CoralColorType
  const color = node.styles?.['color'] as CoralColorType

  const fills = clone(element.fills)

  if (backgroundColor) {
    fills[0] = figma.util.solidPaint(backgroundColor.hex, fills[0])
    element.fills = fills
  }

  if (color) {
    fills[0] = figma.util.solidPaint(color.hex, fills[0])
    element.fills = fills
  }
}

export const transformFontWeightToFigmaFontStyle = (fontWeight: number) => {
  switch (fontWeight) {
    case 100:
      return 'Thin'
    case 200:
      return 'Extra Light'
    case 300:
      return 'Light'
    case 400:
      return 'Regular'
    case 500:
      return 'Medium'
    case 600:
      return 'Semi Bold'
    case 700:
      return 'Bold'
    case 800:
      return 'Extra Bold'
    case 900:
      return 'Black'
    default:
      return 'Regular'
  }
}

export const loadFont = async (fontFamily: string, fontStyle: string) => {
  try {
    await figma.loadFontAsync({
      family: fontFamily,
      style: fontStyle,
    })
  } catch (error) {
    console.error(`Failed to load font: ${fontFamily} ${fontStyle}`, error)
  }
}

export const applyTypographyStyles = async (
  element: TextNode,
  node: CoralNode | CoralRootNode,
  textAlign?: textAlign,
) => {
  if (node.styles?.['fontSize']) {
    element.fontSize = node.styles?.['fontSize'] as number
  }

  if (node.styles?.['lineHeight']) {
    element.lineHeight = {
      unit: 'PIXELS',
      value: node.styles?.['lineHeight'] as number,
    }
  }

  if (node.styles?.['letterSpacing']) {
    element.letterSpacing = {
      unit: 'PERCENT',
      value: node.styles?.['letterSpacing'] as number,
    }
  }

  if (node.styles?.['textAlign']) {
    element.textAlignHorizontal = node.styles?.['textAlign'] as TextNode['textAlignHorizontal']
  } else if (textAlign) {
    element.textAlignHorizontal = textAlign.toUpperCase() as TextNode['textAlignHorizontal']
  }

  if (node.styles?.['textDecoration']) {
    element.textDecoration = node.styles?.['textDecoration'] as TextNode['textDecoration']
  }

  // if (!node.styles?.['width']) {
  //   const width = (element.parent as FrameNode).width
  //   // element.layoutSizingHorizontal = 'FILL'
  //   element.resize(width, element.height)
  // } else {
  //   // element.layoutSizingHorizontal = 'FILL'
  //   element.resize(node.styles?.['width'] as number, element.height)
  // }
}
