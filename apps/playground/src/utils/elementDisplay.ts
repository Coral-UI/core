import { CoralElementType } from '@reallygoodwork/coral-core'

/**
 * Elements that have an inline display by default in HTML/CSS
 */
const INLINE_ELEMENTS: CoralElementType[] = [
  'span',
  'a',
  'strong',
  'em',
  'code',
  'time',
  'b',
  'i',
  'u',
  's',
  'small',
  'mark',
  'abbr',
  'cite',
  'kbd',
  'samp',
  'var',
  'sub',
  'sup',
  'label',
]

/**
 * Determines if an element type is an inline element
 * @param elementType The coral element type
 * @returns true if the element is inline by default
 */
export function isInlineElement(elementType: CoralElementType): boolean {
  return INLINE_ELEMENTS.includes(elementType)
}

/**
 * Gets the default display value for an element type
 * @param elementType The coral element type
 * @returns 'inline' for inline elements, 'block' for block elements
 */
export function getDefaultDisplayValue(elementType: CoralElementType): 'inline' | 'block' {
  return isInlineElement(elementType) ? 'inline' : 'block'
}
