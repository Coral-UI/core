import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { applyStyles } from './styles'

export const isTextNode = (node: CoralNode | CoralRootNode): node is CoralNode | CoralRootNode => {
  return node.textContent !== undefined
}

export const nodeHasTextChildren = (node: CoralNode | CoralRootNode) => {
  return node.children?.some((child) => isTextNode(child)) ?? false
}

export const buildNodeText = (node: CoralNode | CoralRootNode) => {
  return node.children?.map((child) => child.textContent).join(' ') ?? ''
}

const parentHasTextAlign = (node: CoralNode | CoralRootNode) => {
  // Since there's no parent property, we'll check the node itself
  const hasTextAlign = (node.styles && 'textAlign' in node.styles) ?? false
  const hasTextChildren = nodeHasTextChildren(node)

  // Return true if the node has both textAlign and text children
  // This information can be used to apply textAlign to children later
  return hasTextAlign || hasTextChildren
}

export const createElements = async (spec: CoralRootNode | CoralNode, addTextAlign: boolean = false) => {
  const element = await createElement(spec, addTextAlign)
  const shouldApplyTextAlign = addTextAlign || parentHasTextAlign(spec)

  if (spec.children) {
    spec.children.forEach(async (childSpec) => {
      const child = await createElements(childSpec, shouldApplyTextAlign ?? false)
      if (child) {
        element?.appendChild(child)
      }
    })
  }

  return element
}

function createElement(node: CoralNode | CoralRootNode, addTextAlign: boolean = false) {
  if (nodeHasTextChildren(node)) {
    return createText(node, addTextAlign)
  }

  if (node.type === 'COMPONENT') {
    return createComponent(node)
  }

  if (!node.textContent) {
    return createFrame(node)
  }
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

async function createText(spec: CoralNode, addTextAlign: boolean = false) {
  const text = figma.createText()
  text.name = spec.name
  await applyStyles(text, spec, addTextAlign)

  text.characters = buildNodeText(spec)

  return text as unknown as FrameNode
}
