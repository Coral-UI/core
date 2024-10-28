import * as parserHtml from 'prettier/parser-html'
import * as prettier from 'prettier/standalone'

import type { CoralNodeWithChildren, CoralRootNode } from '@reallygoodwork/coral-core'

// List of self-closing HTML elements
const selfClosingTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]

const nodeToHTML = (node: CoralNodeWithChildren): string => {
  const attributes = node.elementAttributes ? ` ${node.elementAttributes}` : ''
  const children = node.children ? node.children.map(nodeToHTML).join('') : ''

  // Check if the element is self-closing
  if (selfClosingTags.includes(node.elementType)) {
    return `<${node.elementType}${attributes} />`
  }

  if (node.textContent) {
    return `<${node.elementType}${attributes}>${node.textContent}${children}</${node.elementType}>`
  }

  return `<${node.elementType}${attributes}>${children}</${node.elementType}>`
}

export const coralToHTML = async (coralSpec: CoralRootNode): Promise<string> => {
  const node = nodeToHTML(coralSpec)

  return prettier.format(node, {
    parser: 'html',
    plugins: [parserHtml],
  })
}
