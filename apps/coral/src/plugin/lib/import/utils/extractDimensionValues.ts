import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { extractStyleValue } from './extractStyleValue'

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
 * Check if a node has width constraints (explicit width or maxWidth)
 * @param node - Coral node to check
 * @returns True if node has width constraints
 */
export function hasWidthConstraints(node: CoralNode | CoralRootNode): boolean {
  if (!node.styles) return false

  const width = node.styles['width']
  const maxWidth = node.styles['maxWidth']

  // Check for explicit width or maxWidth (not 100% or auto)
  const hasExplicitWidth = width !== undefined && width !== '100%' && width !== 'auto'
  const hasMaxWidth = maxWidth !== undefined

  return hasExplicitWidth || hasMaxWidth
}
