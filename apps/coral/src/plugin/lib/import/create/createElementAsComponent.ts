import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { textAlign } from '../../types'
import { applyColorInheritance } from '../components/applyColorInheritance'
import { createElement } from './createElement'

// Modified to always return components for top-level elements
export const createElementAsComponent = async (
  spec: CoralNode | CoralRootNode,
  textAlign?: textAlign,
): Promise<ComponentNode> => {
  // Apply color inheritance before creating element
  const specWithInheritedColor = applyColorInheritance(spec)

  // Create the element structure first
  const element = await createElement(specWithInheritedColor, textAlign)

  // Convert to component if it isn't already
  if (element && element.type === 'COMPONENT') {
    return element as ComponentNode
  }

  if (element) {
    return figma.createComponentFromNode(element)
  }

  // Fallback: create an empty component
  const component = figma.createComponent()
  component.name = spec.name
  return component
}
