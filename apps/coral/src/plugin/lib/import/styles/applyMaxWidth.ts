import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../../export/utils/extractDimensionValue'
import { ElementWithOptionalText } from '../../types'

export const applyMaxWidth = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  const maxWidth = extractDimensionValue(node.styles?.['maxWidth'])
  if (maxWidth !== undefined) {
    // element.layoutSizingHorizontal = 'HUG'
    element.maxWidth = maxWidth
    element.resize(maxWidth, element.height)
  }
}
