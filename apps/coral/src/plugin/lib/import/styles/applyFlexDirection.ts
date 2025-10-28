import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { ElementWithOptionalText } from '../../types'

export const applyFlexDirection = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  if (node.styles?.['display'] === 'flex') {
    if (node.styles?.['flexDirection'] === 'column' || node.styles?.['flexDirection'] === 'column-reverse') {
      element.layoutMode = 'VERTICAL'
    } else {
      element.layoutMode = 'HORIZONTAL'
    }
  }
}
