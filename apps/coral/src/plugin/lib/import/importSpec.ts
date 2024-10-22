import { CoralNode, CoralRootNode, CoralStyleType } from '@reallygoodwork/coral-core'

import { applyStyles, loadFont, transformFontWeightToFigmaFontStyle } from './styles'

export type textAlign = 'left' | 'center' | 'right' | 'justify' | 'start' | 'end'

export const isTextNode = (node: CoralNode | CoralRootNode): node is CoralNode | CoralRootNode => {
  return node.textContent !== undefined
}

export const nodeHasTextChildren = (node: CoralNode | CoralRootNode) => {
  return node.children?.some((child) => isTextNode(child)) ?? false
}

export const buildNodeText = (node: CoralNode | CoralRootNode) => {
  return node.children?.map((child) => child.textContent).join(' ') ?? ''
}

export const nodeHasChildrenWithMargin = (node: CoralNode | CoralRootNode) => {
  return (
    node.children?.some((child) => child.styles?.['marginInlineStart']) ||
    node.children?.some((child) => child.styles?.['marginInlineEnd']) ||
    node.children?.some((child) => child.styles?.['marginBlockStart']) ||
    node.children?.some((child) => child.styles?.['marginBlockEnd']) ||
    node.children?.some((child) => child.styles?.['paddingInlineStart']) ||
    node.children?.some((child) => child.styles?.['paddingInlineEnd']) ||
    node.children?.some((child) => child.styles?.['paddingBlockStart']) ||
    node.children?.some((child) => child.styles?.['paddingBlockEnd'])
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
): Promise<SceneNode> {
  let element: SceneNode

  const combinedStyles = { ...parentStyles, ...node.styles }

  if (node.type === 'COMPONENT') {
    element = await createComponent(node)
  } else if (isTextNode(node)) {
    element = await createText(node, combinedStyles, textAlign)
  } else {
    element = await createFrame(node)
  }

  // Check if any child has a textContent property
  const hasTextContentChild = node.children?.some((child) => 'textContent' in child && child.textContent !== undefined)

  // Apply layout settings if a child with textContent exists and element supports layoutMode
  if (hasTextContentChild && 'layoutMode' in element) {
    element.layoutMode = 'VERTICAL'
    element.layoutSizingVertical = 'HUG'
    element.primaryAxisSizingMode = 'FIXED'
    element.counterAxisSizingMode = 'AUTO'
    element.primaryAxisAlignItems = 'MIN'
    element.counterAxisAlignItems = 'MIN'
  }

  if ('children' in node && node.children) {
    for (const child of node.children) {
      const childElement = await createElement(child, textAlign, combinedStyles)
      if ('appendChild' in element) {
        element.appendChild(childElement)
      }

      // Apply layoutSizingHorizontal = 'FILL' only if parent has layoutMode
      if (childElement.type === 'TEXT' && 'layoutMode' in element) {
        try {
          childElement.layoutSizingHorizontal = 'FILL'
        } catch (error) {
          console.warn('Could not apply layoutSizingHorizontal to text node:', error)
        }
      }
    }
  }

  await applyStyles(element, node, textAlign)
  return element
}

async function createFrame(spec: CoralNode) {
  const frame = figma.createFrame()
  frame.name = spec.name
  await applyStyles(frame, spec)
  return frame
}

async function createComponent(spec: CoralNode) {
  const component = figma.createComponent()
  component.name = spec.name
  await applyStyles(component, spec)
  return component
}

async function createText(spec: CoralNode, styles: CoralStyleType, textAlign: textAlign | undefined = undefined) {
  const text = figma.createText()
  text.name = spec.name
  const fontFamily = (styles?.['fontFamily'] as string) ?? 'Inter'
  const fontWeight = (styles?.['fontWeight'] as number) ?? 400
  const fontStyle = transformFontWeightToFigmaFontStyle(fontWeight)

  await loadFont(fontFamily, fontStyle)

  text.fontName = {
    family: fontFamily,
    style: fontStyle,
  }

  await applyStyles(text, spec, textAlign)

  // Remove this line as we'll handle it in createElement
  // text.layoutSizingHorizontal = 'FILL'

  text.characters = spec.textContent ?? ''

  return text
}
