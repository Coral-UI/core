import { CoralNode, CoralRootNode, CoralStyleType } from '@reallygoodwork/coral-core'

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
  // Skip text nodes entirely
  if (isTextNode(node)) {
    return null
  }

  const currentNode = node as CoralNode

  let element: SceneNode

  const combinedStyles =
    'styles' in currentNode && currentNode.styles
      ? 'textContent' in node
        ? { ...parentStyles, ...currentNode.styles }
        : currentNode.styles
      : parentStyles

  const hasTextContentChild = currentNode.children?.some(
    (child) => 'textContent' in child && child['textContent'] !== undefined,
  )

  if (hasTextContentChild) {
    const { frame } = await createTextandWrapper(node)
    element = frame
  } else if ('type' in node && currentNode.type === 'COMPONENT') {
    element = await createComponent(node)
  } else {
    element = await createFrame(node)
  }

  // Apply layout settings if a child with textContent exists and element supports layoutMode
  if (hasTextContentChild && 'layoutMode' in element) {
    element.layoutMode = 'VERTICAL'
    element.layoutSizingVertical = 'HUG'
    element.primaryAxisSizingMode = 'FIXED'
    element.counterAxisSizingMode = 'AUTO'
    element.primaryAxisAlignItems = 'MIN'
    element.counterAxisAlignItems = 'MIN'
  }

  if ('children' in node && currentNode.children) {
    // Process children in sequence to maintain order
    for (const child of currentNode.children) {
      await new Promise<void>((resolve) => {
        createElement(child, textAlign, combinedStyles).then((childElement) => {
          if (childElement && 'appendChild' in element) {
            element.appendChild(childElement)
          }
          resolve()
        })
      })
      // Give the event loop a chance to breathe
      await wait(100)
    }
  }

  await applyStyles(element, node, textAlign)
  return element
}

async function createTextandWrapper(spec: CoralNode) {
  const { frame, textNode } = await createFrameWithFillingText(spec)
  return { frame, textNode }
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
