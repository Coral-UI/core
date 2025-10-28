import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

// Determine if an element should use horizontal layout (inline elements)
export const isInlineElement = (node: CoralNode | CoralRootNode): boolean => {
  const inlineElements = [
    'a',
    'span',
    'strong',
    'em',
    'b',
    'i',
    'u',
    'code',
    'abbr',
    'cite',
    'kbd',
    'mark',
    'small',
    'sub',
    'sup',
    'time',
  ]
  return inlineElements.includes(node.elementType)
}
