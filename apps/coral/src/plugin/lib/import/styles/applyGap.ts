import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../../export/utils/extractDimensionValue'
import { ElementWithOptionalText } from '../../types'

export const applyGap = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  // columnGap for horizontal layouts, rowGap for vertical layouts
  const isHorizontal = element.layoutMode === 'HORIZONTAL'

  if (isHorizontal && node.styles?.['columnGap']) {
    const gapValue = extractDimensionValue(node.styles['columnGap'])
    if (gapValue !== undefined) element.itemSpacing = gapValue
  } else if (!isHorizontal && node.styles?.['rowGap']) {
    const gapValue = extractDimensionValue(node.styles['rowGap'])
    if (gapValue !== undefined) element.itemSpacing = gapValue
  }

  // Generic 'gap' property applies to both
  if (node.styles?.['gap']) {
    const gapValue = extractDimensionValue(node.styles['gap'])
    if (gapValue !== undefined) element.itemSpacing = gapValue
  }
}
