import type { CoralNode } from '@reallygoodwork/coral-core'

import { stylesToInlineStyle } from './convertStyles'

/**
 * List of self-closing HTML elements
 */
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

/**
 * Formats attributes for JSX
 */
function formatJSXAttributes(
  elementAttributes?: Record<string, string | number | boolean | string[]>,
  styles?: string,
): string {
  const attrs: string[] = []

  if (elementAttributes) {
    for (const [key, value] of Object.entries(elementAttributes)) {
      if (Array.isArray(value)) {
        // Handle class arrays specially - join them
        if (key === 'class') {
          attrs.push(`className="${value.join(' ')}"`)
        } else {
          attrs.push(`${key}={[${value.map((v) => `'${v}'`).join(', ')}]}`)
        }
      } else if (key === 'class') {
        attrs.push(`className="${value}"`)
      } else if (typeof value === 'boolean') {
        if (value) {
          attrs.push(key)
        }
      } else if (typeof value === 'number') {
        attrs.push(`${key}={${value}}`)
      } else {
        attrs.push(`${key}="${String(value).replace(/"/g, '&quot;')}"`)
      }
    }
  }

  if (styles) {
    attrs.push(`style={${styles}}`)
  }

  return attrs.length > 0 ? ` ${attrs.join(' ')}` : ''
}

/**
 * Generates JSX element from Coral node
 * @param node - Coral node specification
 * @param indent - Current indentation level
 * @returns JSX element string
 */
export function generateJSXElement(node: CoralNode, indent: number = 0): string {
  const indentStr = '  '.repeat(indent)
  const elementType = node.elementType
  const isSelfClosing = selfClosingTags.includes(elementType)

  // Convert styles to inline style
  const inlineStyle = node.styles ? stylesToInlineStyle(node.styles) : ''

  // Format attributes
  const attributes = formatJSXAttributes(node.elementAttributes, inlineStyle)

  // Handle self-closing elements
  if (isSelfClosing) {
    return `${indentStr}<${elementType}${attributes} />`
  }

  // Handle text content
  const textContent = node.textContent || ''

  // Handle children
  const children: string[] = []
  if (textContent) {
    children.push(`${indentStr}  ${textContent}`)
  }
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      children.push(generateJSXElement(child, indent + 1))
    }
  }

  if (children.length === 0) {
    return `${indentStr}<${elementType}${attributes}></${elementType}>`
  }

  const childrenStr = children.join('\n')
  return `${indentStr}<${elementType}${attributes}>\n${childrenStr}\n${indentStr}</${elementType}>`
}
