import { CoralNode, CoralRootNode, Dimension } from '@reallygoodwork/coral-core'

import { extractStyleValue } from './extractStyleValue'
import { isDimension } from '../../export/assert/isDimension'

export interface DimensionValues {
  width?: number
  height?: number
  maxWidth?: number
  maxHeight?: number
  minWidth?: number
  minHeight?: number
}

/**
 * Extract dimension values from a node's styles
 * @param node - Coral node to extract dimensions from
 * @returns Object containing dimension values in pixels
 */
export function extractDimensionValues(node: CoralNode | CoralRootNode): DimensionValues {
  const styles = node.styles || {}
  return {
    width: extractStyleValue(styles['width']),
    height: extractStyleValue(styles['height']),
    maxWidth: extractStyleValue(styles['maxWidth']),
    maxHeight: extractStyleValue(styles['maxHeight']),
    minWidth: extractStyleValue(styles['minWidth']),
    minHeight: extractStyleValue(styles['minHeight']),
  }
}

/**
 * Check if a value represents a percentage or auto (not a concrete dimension)
 */
function isPercentageOrAuto(value: unknown): boolean {
  if (value === undefined) return false
  if (value === 'auto' || value === '100%') return true
  if (typeof value === 'string' && value.endsWith('%')) return true
  if (isDimension(value) && typeof value !== 'number' && value.unit === '%') return true
  return false
}

/**
 * Check if a node has width constraints (explicit width or maxWidth)
 * @param node - Coral node to check
 * @returns True if node has width constraints
 */
export function hasWidthConstraints(node: CoralNode | CoralRootNode): boolean {
  if (!node.styles) return false

  const width = node.styles['width']
  const maxWidth = node.styles['maxWidth']

  // Check for explicit width or maxWidth (not 100% or auto)
  const hasExplicitWidth = width !== undefined && !isPercentageOrAuto(width)
  const hasMaxWidth = maxWidth !== undefined && !isPercentageOrAuto(maxWidth)

  return hasExplicitWidth || hasMaxWidth
}
