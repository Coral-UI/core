import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../../export/utils/extractDimensionValue'
import { ElementWithOptionalText } from '../../types'

export const applyMargin = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  // In Figma, we simulate margins by converting them to padding on the element
  // This only works for frames with auto-layout enabled

  // Only apply margins if the element has auto-layout (layoutMode is not NONE)
  if ('layoutMode' in element && element.layoutMode === 'NONE') {
    return
  }

  // Get margin values (only numeric ones, ignore 'auto')
  const marginLeft = extractDimensionValue(node.styles?.['marginInlineStart']) || 0
  const marginRight = extractDimensionValue(node.styles?.['marginInlineEnd']) || 0
  const marginTop = extractDimensionValue(node.styles?.['marginBlockStart']) || 0
  const marginBottom = extractDimensionValue(node.styles?.['marginBlockEnd']) || 0

  // Get padding values
  const paddingLeft = extractDimensionValue(node.styles?.['paddingInlineStart']) || 0
  const paddingRight = extractDimensionValue(node.styles?.['paddingInlineEnd']) || 0
  const paddingTop = extractDimensionValue(node.styles?.['paddingBlockStart']) || 0
  const paddingBottom = extractDimensionValue(node.styles?.['paddingBlockEnd']) || 0

  // Always set padding (even if margin is 0), to ensure padding is applied
  if (paddingLeft > 0 || marginLeft > 0) {
    element.paddingLeft = paddingLeft + marginLeft
  }

  if (paddingRight > 0 || marginRight > 0) {
    element.paddingRight = paddingRight + marginRight
  }

  if (paddingTop > 0 || marginTop > 0) {
    element.paddingTop = paddingTop + marginTop
  }

  if (paddingBottom > 0 || marginBottom > 0) {
    element.paddingBottom = paddingBottom + marginBottom
  }
}
