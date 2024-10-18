import { CoralColorType, CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { buildNodeText, isTextNode, nodeHasTextChildren } from './importSpec'

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

type Element = FrameNode | ComponentNode | InstanceNode | TextNode
type ElementWithOptionalText = FrameNode | ComponentNode | InstanceNode

export const applyStyles = async (element: Element, node: CoralNode | CoralRootNode, addTextAlign: boolean = false) => {
  if (!nodeHasTextChildren(node) && (childRequiresAutoLayout(node) || shouldApplyAutoLayout(node))) {
    applyAutoLayout(element as ElementWithOptionalText)

    applyFlexDirection(element as ElementWithOptionalText, node)
    applyPadding(element as ElementWithOptionalText, node)
    applyMaxWidth(element as ElementWithOptionalText, node)
  }

  if (isTextNode(node) || nodeHasTextChildren(node)) {
    await applyTypographyStyles(element as TextNode, node)
  }

  if (shouldApplyAutoLayout(node) && node.styles?.['textAlign']) {
    // console.log(node)
    element.counterAxisAlignItems = 'CENTER'
  } else if (addTextAlign && isTextNode(node) && node.styles?.['textAlign']) {
    ;(element as TextNode).textAlignHorizontal = node.styles?.['textAlign'] as TextNode['textAlignHorizontal']
  }

  if (node.styles) {
    // Object.entries(node.styles).forEach(async ([key, value]) => {
    // switch (key) {
    //   case 'backgroundColor':
    //     console.log(value)
    //     // solidPaint((value as CoralColorType).hex, element)
    //     // element.fills[0] = [{ type: 'SOLID', color: (value as CoralColorType).rgb }]
    //     break
    //   case 'color':
    //     // solidPaint((value as CoralColorType).hex, element)
    //     break
    //   case 'paddingInlineStart':
    //     element.paddingLeft = value as number
    //     break
    //   case 'paddingInlineEnd':
    //     element.paddingRight = value as number
    //     break
    //   case 'paddingBlockStart':
    //     element.paddingTop = value as number
    //     break
    //   case 'paddingBlockEnd':
    //     element.paddingBottom = value as number
    //     break
    //   default:
    //     console.warn(`Unsupported style property: ${key}`)
    //     break
    // }
    // })
  }
}

const transformFontWeightToFigmaFontStyle = (fontWeight: number) => {
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

const applyTypographyStyles = async (element: TextNode, node: CoralNode | CoralRootNode) => {
  const fontFamily = (node.styles?.['fontFamily'] as string) ?? 'Inter'
  const fontWeight = (node.styles?.['fontWeight'] as number) ?? 400
  // const fontStyle = (node.styles?.['fontStyle'] as string) ?? 'Regular'

  try {
    await figma.loadFontAsync({
      family: fontFamily,
      style: 'Regular',
    })
  } catch (error) {
    console.error(`Failed to load font: ${fontFamily} ${fontWeight}`, error)
  }

  element.name = buildNodeText(node)
  // element.layoutSizingHorizontal = 'HUG'

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
  }

  if (node.styles?.['textDecoration']) {
    element.textDecoration = node.styles?.['textDecoration'] as TextNode['textDecoration']
  }
}
