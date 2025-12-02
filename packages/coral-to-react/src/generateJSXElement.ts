import type { CoralNode } from '@reallygoodwork/coral-core'

// import { stylesToInlineStyle } from './convertStyles'

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
  className?: string,
  inlineStyle?: string,
): string {
  const attrs: string[] = []
  let existingClassName: string | undefined

  if (elementAttributes) {
    for (const [key, value] of Object.entries(elementAttributes)) {
      if (key === 'class' || key === 'className') {
        // Store existing className to combine with generated classes later
        existingClassName = Array.isArray(value) ? value.join(' ') : String(value)
        continue // Skip adding it now, we'll add it later
      }

      if (Array.isArray(value)) {
        attrs.push(`${key}={[${value.map((v) => `'${v}'`).join(', ')}]}`)
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

  // Combine existing className with generated CSS classes
  if (className || existingClassName) {
    const combinedClasses = [existingClassName, className].filter(Boolean).join(' ')
    attrs.push(`className="${combinedClasses}"`)
  }

  if (inlineStyle) {
    attrs.push(`style={${inlineStyle}}`)
  }

  return attrs.length > 0 ? ` ${attrs.join(' ')}` : ''
}

/**
 * Generate unique ID for a node based on its path in the tree
 */
function generateNodeId(node: CoralNode, parentPath: string = '', index: number = 0): string {
  const nodeName = node.name || node.elementType
  const currentPath = parentPath ? `${parentPath}-${index}` : 'root'
  return `coral-${currentPath}-${nodeName}`
}

/**
 * Generates JSX element from Coral node
 * @param node - Coral node specification
 * @param indent - Current indentation level
 * @param idMapping - Map of nodes to their generated IDs for CSS classes
 * @param parentPath - Parent path for ID generation
 * @param index - Index of this node among siblings
 * @returns JSX element string
 */
export function generateJSXElement(
  node: CoralNode,
  indent: number = 0,
  idMapping: Map<CoralNode, string> = new Map(),
  parentPath: string = '',
  index: number = 0,
): string {
  const indentStr = '  '.repeat(indent)
  const elementType = node.elementType
  const isSelfClosing = selfClosingTags.includes(elementType)

  // Ensure node has an ID in the mapping (create if doesn't exist)
  const nodeId = idMapping.get(node) || generateNodeId(node, parentPath, index)
  if (!idMapping.has(node)) {
    idMapping.set(node, nodeId)
  }
  const className = nodeId

  // Format attributes (no inline styles when using CSS classes)
  const attributes = formatJSXAttributes(node.elementAttributes, className)

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
    for (let idx = 0; idx < node.children.length; idx++) {
      const child = node.children[idx] as CoralNode
      children.push(generateJSXElement(child, indent + 1, idMapping, nodeId, idx))
    }
  }

  if (children.length === 0) {
    return `${indentStr}<${elementType}${attributes}></${elementType}>`
  }

  const childrenStr = children.join('\n')
  return `${indentStr}<${elementType}${attributes}>\n${childrenStr}\n${indentStr}</${elementType}>`
}
