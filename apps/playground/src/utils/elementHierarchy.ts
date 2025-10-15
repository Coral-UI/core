import { CoralElementType } from '@reallygoodwork/coral-core'

// Define element categories for proper nesting rules
export const ELEMENT_CATEGORIES = {
  // Structural block-level elements that can contain other block elements
  STRUCTURAL_BLOCK: [
    'div', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav',
    'blockquote', 'pre', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'form', 'fieldset', 'legend', 'figure', 'figcaption',
    'address', 'details', 'summary', 'button', 'textarea'
  ] as CoralElementType[],

  // Text block elements that can only contain inline elements and text
  TEXT_BLOCK: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'
  ] as CoralElementType[],

  // Inline elements that can only contain other inline elements and text
  INLINE: [
    'span', 'a', 'strong', 'em', 'code', 'mark', 'small', 'sub', 'sup',
    'time', 'abbr', 'cite', 'q', 'samp', 'kbd', 'var', 'dfn',
    'b', 'i', 'u', 's', 'del', 'ins'
  ] as CoralElementType[],

  // Self-closing or void elements
  VOID: [
    'img', 'br', 'hr', 'input', 'select', 'option',
    'audio', 'video', 'source', 'canvas', 'embed', 'iframe', 'object', 'param'
  ] as CoralElementType[],

  // Text content elements
  TEXT: ['text'] as CoralElementType[]
}

// Check if an element is a structural block element
export const isStructuralBlockElement = (elementType: CoralElementType): boolean => {
  return ELEMENT_CATEGORIES.STRUCTURAL_BLOCK.includes(elementType)
}

// Check if an element is a text block element (h1-h6, p)
export const isTextBlockElement = (elementType: CoralElementType): boolean => {
  return ELEMENT_CATEGORIES.TEXT_BLOCK.includes(elementType)
}

// Check if an element is inline
export const isInlineElement = (elementType: CoralElementType): boolean => {
  return ELEMENT_CATEGORIES.INLINE.includes(elementType)
}

// Check if an element is void/self-closing
export const isVoidElement = (elementType: CoralElementType): boolean => {
  return ELEMENT_CATEGORIES.VOID.includes(elementType)
}

// Check if an element is text content
export const isTextElement = (elementType: CoralElementType): boolean => {
  return ELEMENT_CATEGORIES.TEXT.includes(elementType)
}

// Check if an element is any kind of block element
export const isBlockElement = (elementType: CoralElementType): boolean => {
  return isStructuralBlockElement(elementType) || isTextBlockElement(elementType)
}

// Check if a parent can contain a child element
export const canContain = (parentType: CoralElementType, childType: CoralElementType): boolean => {
  // Void elements cannot contain anything
  if (isVoidElement(parentType)) {
    return false
  }

  // Text elements can only contain text content
  if (isTextElement(parentType)) {
    return isTextElement(childType)
  }

  // Text block elements (h1-h6, p) can only contain inline elements and text
  if (isTextBlockElement(parentType)) {
    return isInlineElement(childType) || isTextElement(childType)
  }

  // Structural block elements can contain other block elements, inline elements, and text
  if (isStructuralBlockElement(parentType)) {
    return isBlockElement(childType) || isInlineElement(childType) || isTextElement(childType)
  }

  // Inline elements can only contain other inline elements and text
  if (isInlineElement(parentType)) {
    return isInlineElement(childType) || isTextElement(childType)
  }

  return false
}

// Get valid child element types for a given parent
export const getValidChildTypes = (parentType: CoralElementType): CoralElementType[] => {
  if (isVoidElement(parentType)) {
    return []
  }

  if (isTextElement(parentType)) {
    return ELEMENT_CATEGORIES.TEXT
  }

  if (isTextBlockElement(parentType)) {
    return [...ELEMENT_CATEGORIES.INLINE, ...ELEMENT_CATEGORIES.TEXT]
  }

  if (isStructuralBlockElement(parentType)) {
    return [...ELEMENT_CATEGORIES.STRUCTURAL_BLOCK, ...ELEMENT_CATEGORIES.TEXT_BLOCK, ...ELEMENT_CATEGORIES.INLINE, ...ELEMENT_CATEGORIES.TEXT]
  }

  if (isInlineElement(parentType)) {
    return [...ELEMENT_CATEGORIES.INLINE, ...ELEMENT_CATEGORIES.TEXT]
  }

  return []
}

// Get element category for styling purposes
export const getElementCategory = (elementType: CoralElementType): 'structural-block' | 'text-block' | 'inline' | 'void' | 'text' => {
  if (isStructuralBlockElement(elementType)) return 'structural-block'
  if (isTextBlockElement(elementType)) return 'text-block'
  if (isInlineElement(elementType)) return 'inline'
  if (isVoidElement(elementType)) return 'void'
  if (isTextElement(elementType)) return 'text'
  return 'structural-block' // fallback
}
