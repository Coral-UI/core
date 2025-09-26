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

  const elementAttributes: Record<string, string | number | boolean | string[]> = {}

  // Add other props as element attributes, filtering to allowed types
  Object.entries(otherProps).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || Array.isArray(value)) {
      elementAttributes[key] = value as string | number | boolean | string[]
    }
  })

  if (className) {
    elementAttributes.class = className
  }

  const node: CoralRootNode = {
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
    elementAttributes,
  }

  if (element.textContent) {
    node.textContent = element.textContent
  }

  return node
}
