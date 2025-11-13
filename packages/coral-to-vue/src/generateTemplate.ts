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
 * Converts React event handler name to Vue event handler name
 * onClick -> click, onChange -> change, etc.
 */
function convertEventHandlerName(reactHandler: string): string {
  // Remove 'on' prefix and lowercase first letter
  if (reactHandler.startsWith('on')) {
    return reactHandler.slice(2).toLowerCase()
  }
  return reactHandler.toLowerCase()
}

/**
 * Formats attributes for Vue template
 */
function formatVueAttributes(
  elementAttributes?: Record<string, string | number | boolean | string[]>,
  styles?: string,
): string {
  const attrs: string[] = []

  if (elementAttributes) {
    for (const [key, value] of Object.entries(elementAttributes)) {
      // Convert React event handlers to Vue event handlers
      if (key.startsWith('on') && key.length > 2 && key[2]?.toUpperCase() === key[2]?.toUpperCase()) {
        const eventName = convertEventHandlerName(key)
        attrs.push(`@${eventName}="${String(value)}"`)
        continue
      }

      // Handle class attribute (Vue uses 'class', not 'className')
      if (key === 'class' || key === 'className') {
        if (Array.isArray(value)) {
          attrs.push(`class="${value.join(' ')}"`)
        } else {
          attrs.push(`class="${value}"`)
        }
        continue
      }

      // Handle dynamic attributes (should use v-bind)
      // For now, we'll use static attributes. In a full implementation,
      // we'd detect if the value is a variable/expression
      if (Array.isArray(value)) {
        attrs.push(`:${key}="[${value.map((v) => `'${v}'`).join(', ')}]"`)
      } else if (key === 'id' || key.startsWith('data-') || key.startsWith('aria-')) {
        // Static attributes
        if (typeof value === 'boolean') {
          if (value) {
            attrs.push(key)
          }
        } else if (typeof value === 'number') {
          attrs.push(`${key}="${value}"`)
        } else {
          attrs.push(`${key}="${String(value).replace(/"/g, '&quot;')}"`)
        }
      } else {
        // Use v-bind for other attributes
        if (typeof value === 'boolean') {
          attrs.push(`:${key}="${value}"`)
        } else if (typeof value === 'number') {
          attrs.push(`:${key}="${value}"`)
        } else {
          attrs.push(`:${key}="'${String(value).replace(/'/g, "\\'")}'"`)
        }
      }
    }
  }

  if (styles) {
    attrs.push(`:style="${styles}"`)
  }

  return attrs.length > 0 ? ` ${attrs.join(' ')}` : ''
}

/**
 * Generates Vue template element from Coral node
 * @param node - Coral node specification
 * @param indent - Current indentation level
 * @returns Vue template element string
 */
export function generateTemplateElement(node: CoralNode, indent: number = 0): string {
  const indentStr = '  '.repeat(indent)
  const elementType = node.elementType
  const isSelfClosing = selfClosingTags.includes(elementType)

  // Convert styles to inline style
  const inlineStyle = node.styles ? stylesToInlineStyle(node.styles) : ''

  // Format attributes
  const attributes = formatVueAttributes(node.elementAttributes, inlineStyle)

  // Handle self-closing elements
  if (isSelfClosing) {
    return `${indentStr}<${elementType}${attributes} />`
  }

  // Handle text content
  const textContent = node.textContent || ''

  // Handle children
  const children: string[] = []
  if (textContent) {
    // In Vue templates, static text is written directly
    // Escape HTML entities if needed
    const escapedText = textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    children.push(`${indentStr}  ${escapedText}`)
  }
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      children.push(generateTemplateElement(child, indent + 1))
    }
  }

  if (children.length === 0) {
    return `${indentStr}<${elementType}${attributes}></${elementType}>`
  }

  const childrenStr = children.join('\n')
  return `${indentStr}<${elementType}${attributes}>\n${childrenStr}\n${indentStr}</${elementType}>`
}
