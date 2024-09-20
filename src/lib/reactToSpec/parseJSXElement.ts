import { findImportSource } from '@/lib/reactToSpec/findImportSource'
import { parseJSXAttributeValue } from '@/lib/reactToSpec/parseJSXAttributeValue'
import { Result, UIElement } from '@/lib/reactToSpec/transformReactComponentToSpec'
import * as t from '@babel/types'

export const parseJSXElement = (node: t.JSXElement, result: Result): UIElement => {
  const elementName = (node.openingElement.name as t.JSXIdentifier).name
  const isComponent = elementName[0] === elementName[0]?.toUpperCase()
  const importSource = isComponent ? findImportSource(elementName, result) : undefined

  const props: Record<string, unknown> = {}
  const children: UIElement[] = []

  // Parse props
  node.openingElement.attributes.forEach((attr) => {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
      props[attr.name.name] = parseJSXAttributeValue(attr.value, result)
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
          props: { content: text },
          children: [],
        })
      }
    }
  })

  return { elementType: elementName, isComponent, importSource, props, children }
}
