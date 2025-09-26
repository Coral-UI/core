import * as parserHtml from 'prettier/parser-html'
import * as prettier from 'prettier/standalone'

import type { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

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

// Helper function to convert elementAttributes object to HTML attribute string
const formatAttributes = (attributes: Record<string, string | number | boolean | string[]>): string => {
  return Object.entries(attributes)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}="${value.join(' ')}"`
      }
      if (typeof value === 'boolean') {
        return value ? key : ''
      }
      return `${key}="${value}"`
    })
    .filter(Boolean)
    .join(' ')
}

const nodeToHTML = (node: CoralNode): string => {
  const attributes = node.elementAttributes ? ` ${formatAttributes(node.elementAttributes)}` : ''
  const children = node.children ? (node.children as CoralNode[]).map(nodeToHTML).join('') : ''

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
