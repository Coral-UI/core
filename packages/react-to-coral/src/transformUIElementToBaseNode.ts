import { UIElement } from '@/transformReactComponentToSpec'

import type { CoralComponentPropertyType, CoralElementType, CoralRootNode } from '@reallygoodwork/coral-core'
import { tailwindToCSS } from '@reallygoodwork/coral-tw2css'

export const transformUIElementToBaseNode = (element: UIElement): CoralRootNode => {
  const { className, styles, ...otherProps } =
    (element.componentProperties as {
      className?: string
      styles?: unknown
      [key: string]: unknown
    }) ?? {}

  const node: CoralRootNode = {
    $schema: 'https://coral.design/schema.json',
    elementType: element.elementType as CoralElementType,
    componentProperties: otherProps as CoralComponentPropertyType,
    // isComponent: element.isComponent,
    name: element.elementType,
    methods: [],
    stateHooks: [],
    componentName: element.elementType,
    styles: {
      ...(styles ? styles : {}),
      ...tailwindToCSS(className || ''),
    },
    children: element.children.map(transformUIElementToBaseNode),
    elementAttributes: {}, // Add this line with appropriate attributes
  }

  if (element.elementType === 'text' && element.textContent) {
    node.textContent = element.textContent
  }

  return node
}
