import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../../export/utils/extractDimensionValue'
import { ElementWithOptionalText } from '../../types'

export const applyPadding = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  const paddingLeft = extractDimensionValue(node.styles?.['paddingInlineStart'])
  if (paddingLeft !== undefined) {
    element.paddingLeft = paddingLeft
  }

  const paddingRight = extractDimensionValue(node.styles?.['paddingInlineEnd'])
  if (paddingRight !== undefined) {
    element.paddingRight = paddingRight
  }

  const paddingTop = extractDimensionValue(node.styles?.['paddingBlockStart'])
  if (paddingTop !== undefined) {
    element.paddingTop = paddingTop
  }

  const paddingBottom = extractDimensionValue(node.styles?.['paddingBlockEnd'])
  if (paddingBottom !== undefined) {
    element.paddingBottom = paddingBottom
  }
}
