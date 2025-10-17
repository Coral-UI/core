import { UIElement } from '@/transformReactComponentToSpec'

import type { CoralComponentPropertyType, CoralElementType, CoralRootNode } from '@reallygoodwork/coral-core'
import { extractResponsiveStylesFromObject } from '@reallygoodwork/coral-core'
import { tailwindToCSS } from '@reallygoodwork/coral-tw2css'

export const transformUIElementToBaseNode = (element: UIElement): CoralRootNode => {
  const extractValue = (prop: any): any => {
    // Handle new format with type and value
    if (prop && typeof prop === 'object' && 'value' in prop) {
      return prop.value
    }
    // Handle legacy format (direct value)
    return prop
  }

  const extractedProps: Record<string, any> = {}

  // Extract values from the new component property format
  Object.entries(element.componentProperties || {}).forEach(([key, prop]) => {
    extractedProps[key] = extractValue(prop)
  })

  const { className, styles, ...otherProps } = extractedProps

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

  // Preserve the original component properties format (with types)
  const preservedComponentProperties: CoralComponentPropertyType = {}
  Object.entries(element.componentProperties || {}).forEach(([key, prop]) => {
    if (key !== 'className' && key !== 'styles') {
      preservedComponentProperties[key] = prop
    }
  })

  // Combine inline styles and Tailwind classes
  const combinedStyles = {
    ...(styles ? styles : {}),
    ...tailwindToCSS(className || ''),
  }

  // Extract responsive styles from media queries
  const { baseStyles, responsiveStyles } = extractResponsiveStylesFromObject(combinedStyles)

  const node: CoralRootNode = {
    elementType: element.elementType as CoralElementType,
    componentProperties: preservedComponentProperties,
    // isComponent: element.isComponent,
    name: element.elementType,
    methods: [],
    stateHooks: [],
    componentName: element.elementType,
    styles: baseStyles,
    children: element.children.map(transformUIElementToBaseNode),
    elementAttributes,
  }

  // Add responsive styles if any were found
  if (responsiveStyles.length > 0) {
    node.responsiveStyles = responsiveStyles
  }

  if (element.textContent) {
    node.textContent = element.textContent
  }

  return node
}
