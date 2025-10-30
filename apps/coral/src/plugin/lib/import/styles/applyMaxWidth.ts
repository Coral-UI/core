import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../../export/utils/extractDimensionValue'
import { ElementWithOptionalText } from '../../types'

export const applyMaxWidth = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  const maxWidth = extractDimensionValue(node.styles?.['maxWidth'])
  if (maxWidth !== undefined) {
    // Set the maxWidth constraint - don't resize as that would set FIXED sizing
    // The element should use FILL sizing (set in applyStyles) and be constrained by maxWidth
    element.maxWidth = maxWidth
  }
}
