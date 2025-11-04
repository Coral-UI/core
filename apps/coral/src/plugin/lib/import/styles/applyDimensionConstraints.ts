import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../../export/utils/extractDimensionValue'
import { ElementWithOptionalText } from '../../types'

export const applyDimensionConstraints = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  const maxWidth = extractDimensionValue(node.styles?.['maxWidth'])
  if (maxWidth !== undefined && maxWidth > 0) {
    // Set the maxWidth constraint - don't resize as that would set FIXED sizing
    // The element should use FILL sizing (set in applyStyles) and be constrained by maxWidth
    element.maxWidth = maxWidth
  }

  const minWidth = extractDimensionValue(node.styles?.['minWidth'])
  if (minWidth !== undefined && minWidth > 0) {
    element.minWidth = minWidth
  }

  const maxHeight = extractDimensionValue(node.styles?.['maxHeight'])
  if (maxHeight !== undefined && maxHeight > 0) {
    element.maxHeight = maxHeight
  }

  const minHeight = extractDimensionValue(node.styles?.['minHeight'])
  if (minHeight !== undefined && minHeight > 0) {
    element.minHeight = minHeight
  }
}
