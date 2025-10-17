import { createAttributesObject } from '@/utils/createAttributesObject'
import { extractResponsiveStylesFromObject } from '@/utils/parseMediaQuery'
import { pascalCaseString } from '@/utils/pascalCaseString'
import { styleAttributeToObject } from '@/utils/styleAttributeToObject'
import { HTMLElement, TextNode } from 'node-html-parser'

import { tailwindToCSS } from '@reallygoodwork/coral-tw2css'

import { CoralRootNode } from '../structures/coral'

export const parseHTMLNodeToSpec = (node: HTMLElement): CoralRootNode => {
  // Combine inline styles and Tailwind classes
  const combinedStyles = {
    ...styleAttributeToObject(node.getAttribute('style')),
    ...tailwindToCSS(node.getAttribute('class') || ''),
  }

  // Extract responsive styles from media queries (if any exist in the style object)
  const { baseStyles, responsiveStyles } = extractResponsiveStylesFromObject(combinedStyles)

  // Create the spec object
  const spec: CoralRootNode = {
    name: pascalCaseString(node.rawTagName),
    elementType: node.rawTagName.toLowerCase() as CoralRootNode['elementType'],
    styles: baseStyles,
  }

  // Add responsive styles if any were found
  if (responsiveStyles.length > 0) {
    spec.responsiveStyles = responsiveStyles
  }

  // If the node has attributes, add them to the spec
  if (Object.keys(node.attributes).length) {
    const { style: _styles, ...attributes } = node.attributes
    if (Object.keys(attributes).length) {
      spec.elementAttributes = createAttributesObject(attributes)
    }
  }

  // Initialize children array if there are child nodes
  if (node.childNodes.length > 0) {
    spec.children = []
  }

  // Get direct text nodes (not from child elements)
  const directTextNodes = node.childNodes.filter(
    (childNode) => childNode.nodeType === 3 && !(childNode as TextNode).isWhitespace,
  )

  // Set text content only from direct text nodes
  if (directTextNodes.length > 0) {
    spec.textContent = directTextNodes.map((childNode) => (childNode as TextNode).text.trim()).join(' ')
  }

  // Parse child elements and add them to children
  node.childNodes.forEach((childNode) => {
    if (childNode instanceof HTMLElement) {
      spec.children?.push(parseHTMLNodeToSpec(childNode))
    }
  })

  return spec
}
