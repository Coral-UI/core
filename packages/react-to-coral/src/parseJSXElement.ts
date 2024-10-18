import { findImportSource } from '@/findImportSource'
import { parseJSXAttributeValue } from '@/parseJSXAttributeValue'
import { Result, UIElement } from '@/transformReactComponentToSpec'
import * as t from '@babel/types'

import type { CoralComponentPropertyType } from '@reallygoodwork/coral-core'

export const parseJSXElement = (node: t.JSXElement, result: Result): UIElement => {
  const elementName = (node.openingElement.name as t.JSXIdentifier).name
  const isComponent = elementName[0] === elementName[0]?.toUpperCase()
  const importSource = isComponent ? findImportSource(elementName, result) : undefined

  const componentProperties: CoralComponentPropertyType = {}
  const children: UIElement[] = []

  // Parse props
  node.openingElement.attributes.forEach((attr) => {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
      const value = parseJSXAttributeValue(attr.value, result)
      if (value !== null) {
        componentProperties[attr.name.name] = value
      }
    }
  })

  // Parse children
  node.children.forEach((child) => {
    if (t.isJSXElement(child)) {
      children.push(parseJSXElement(child, result))
    } else if (t.isJSXText(child)) {
      const text = child.value.trim()
      if (text) {
        children.push({
          elementType: 'text',
          isComponent: false,
          textContent: text,
          children: [],
        })
      }
    }
  })

  return { elementType: elementName, isComponent, importSource, componentProperties, children }
}
