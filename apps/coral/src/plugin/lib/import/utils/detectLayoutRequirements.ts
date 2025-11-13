import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { hasWidthConstraints } from './extractDimensionValues'
import { isDimension } from '../../export/assert/isDimension'

/**
 * Check if a margin value is 'auto'
 */
function isAutoMargin(value: unknown): boolean {
  if (value === 'auto') return true
  // Dimension objects don't have 'auto' as a unit, so if it's a Dimension object, it's not auto
  if (isDimension(value)) return false
  return false
}

/**
 * Check if a node has centering margin (margin: auto or mx-auto pattern)
 * @param node - Coral node to check
 * @returns True if node has centering margin
 */
export function hasCenteringMargin(node: CoralNode | CoralRootNode): boolean {
  if (!node.styles) return false

  const marginInlineStart = node.styles['marginInlineStart']
  const marginInlineEnd = node.styles['marginInlineEnd']
  const marginLeft = node.styles['marginLeft']
  const marginRight = node.styles['marginRight']

  // Check for auto margins (horizontal centering)
  return (
    isAutoMargin(marginInlineStart) ||
    isAutoMargin(marginInlineEnd) ||
    isAutoMargin(marginLeft) ||
    isAutoMargin(marginRight)
  )
}

/**
 * Check if a node needs to be centered by its parent
 * This happens when a node has both centering margins and width constraints
 * @param node - Coral node to check
 * @returns True if node needs parent centering
 */
export function needsParentCentering(node: CoralNode | CoralRootNode): boolean {
  return hasCenteringMargin(node) && hasWidthConstraints(node)
}

/**
 * Check if a node needs a wrapper frame (has margin or padding)
 * @param node - Coral node to check
 * @returns True if node needs a wrapper frame
 */
export function needsWrapperFrame(node: CoralNode | CoralRootNode): boolean {
  if (!node.styles) return false

  const spacingProps = [
    'marginBlockStart',
    'marginBlockEnd',
    'marginInlineStart',
    'marginInlineEnd',
    'paddingBlockStart',
    'paddingBlockEnd',
    'paddingInlineStart',
    'paddingInlineEnd',
  ]

  return spacingProps.some((prop) => node.styles![prop] !== undefined)
}

/**
 * Check if a node has margin (needs wrapper to handle margin spacing)
 * Excludes "auto" margins which are used for centering
 * @param node - Coral node to check
 * @returns True if node has non-auto margin values
 */
export function hasMargin(node: CoralNode | CoralRootNode): boolean {
  if (!node.styles) return false

  const marginProps = ['marginBlockStart', 'marginBlockEnd', 'marginInlineStart', 'marginInlineEnd']

  return marginProps.some((prop) => {
    const value = node.styles![prop]
    // Ignore "auto" margins (used for centering), undefined, and Dimension objects with 0 value
    if (value === undefined || isAutoMargin(value)) return false
    if (isDimension(value)) {
      // If it's a Dimension object, check if it has a non-zero value
      if (typeof value === 'number') return value !== 0
      return value.value !== 0
    }
    return true
  })
}
