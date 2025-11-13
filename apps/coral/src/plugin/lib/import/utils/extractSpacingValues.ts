import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { extractStyleValue } from './extractStyleValue'

export interface SpacingValues {
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
  paddingTop: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
}

/**
 * Extract spacing values (margin and padding) from a node's styles
 * Converts logical properties (marginBlockStart, marginInlineStart, etc.) to physical properties
 * @param node - Coral node to extract spacing from
 * @returns Object containing all spacing values in pixels
 */
export function extractSpacingValues(node: CoralNode | CoralRootNode): SpacingValues {
  const styles = node.styles || {}
  return {
    marginTop: extractStyleValue(styles['marginBlockStart']) || 0,
    marginBottom: extractStyleValue(styles['marginBlockEnd']) || 0,
    marginLeft: extractStyleValue(styles['marginInlineStart']) || 0,
    marginRight: extractStyleValue(styles['marginInlineEnd']) || 0,
    paddingTop: extractStyleValue(styles['paddingBlockStart']) || 0,
    paddingBottom: extractStyleValue(styles['paddingBlockEnd']) || 0,
    paddingLeft: extractStyleValue(styles['paddingInlineStart']) || 0,
    paddingRight: extractStyleValue(styles['paddingInlineEnd']) || 0,
  }
}
