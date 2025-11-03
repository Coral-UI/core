import { ElementWithOptionalText } from '@/plugin/lib/types'

import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

export const applyHidden = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  if (node.styles?.['display'] === 'none') {
    element.visible = false
  }
}
