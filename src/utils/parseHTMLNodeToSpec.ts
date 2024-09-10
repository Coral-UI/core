import { BaseNode } from '@/config/UISpec'
import { tailwindToCSS } from '@/lib/tailwindToCSS/tailwindToCSS'
import { createAttributesObject } from '@/utils/createAttributesObject'
import { pascalCaseString } from '@/utils/pascalCaseString'
import { styleAttributeToObject } from '@/utils/styleAttributeToObject'
import { HTMLElement, TextNode } from 'node-html-parser'

export const parseHTMLNodeToSpec = (node: HTMLElement): BaseNode => {
  const hasText = node.childNodes.some((child) => child.nodeType === 3 && !(child as TextNode).isWhitespace)

  // Create the spec object
  const spec: BaseNode = {
    name: pascalCaseString(node.rawTagName),
    elementType: node.rawTagName.toLowerCase() as BaseNode['elementType'],
    styles: {
      ...styleAttributeToObject(node.getAttribute('style')),
      ...tailwindToCSS(node.getAttribute('class') || ''),
    },
  }

  // console.log(tailwindToCSS(node.getAttribute('class') || ''))

  // If the node has attributes, add them to the spec
  if (Object.keys(node.attributes).length) {
    const { class: _className, style: _styles, ...attributes } = node.attributes
    if (Object.keys(attributes).length) {
      spec.elementAttributes = createAttributesObject(attributes)
    }
  }

  // If the node has text content, add it to the spec
  if (hasText) {
    spec.textContent = node.childNodes
      .filter((childNode) => childNode.nodeType === 3)
      .map((childNode) => childNode.innerText.trim())
      .join(' ')
  }

  // If the node has children and no text content, set the children to an empty array
  if (node.childNodes.length > 0 && !hasText) {
    spec.children = []
  }

  // Parse the children and add them to the spec
  node.childNodes.forEach((childNode) => {
    if (childNode instanceof HTMLElement) {
      spec.children?.push(parseHTMLNodeToSpec(childNode))
    }
  })

  return spec
}
