import { findImportSource } from '@/findImportSource'
import { parseJSXAttributeValue } from '@/parseJSXAttributeValue'
import { Result, UIElement } from '@/transformReactComponentToSpec'
import * as t from '@babel/types'

import type { CoralComponentPropertyType, CoralMethodType, CoralStateType } from '@reallygoodwork/coral-core'

export const parseJSXElement = (node: t.JSXElement, result: Result): UIElement => {
  const elementName = (node.openingElement.name as t.JSXIdentifier).name
  const isComponent = elementName[0] === elementName[0]?.toUpperCase()
  const importSource = isComponent ? findImportSource(elementName, result) : undefined

  const componentProperties: CoralComponentPropertyType = {}
  const children: UIElement[] = []
  let textContent: string | undefined = undefined

  // Parse props
  node.openingElement.attributes.forEach((attr) => {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
      const value = parseJSXAttributeValue(
        attr.value,
        result as {
          methods: Array<CoralMethodType>
          stateHooks: Array<CoralStateType>
          componentProperties: Array<CoralComponentPropertyType>
        },
      )
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
        textContent = text
      }
    }
  })

  return { elementType: elementName, isComponent, importSource, componentProperties, children, textContent }
}
