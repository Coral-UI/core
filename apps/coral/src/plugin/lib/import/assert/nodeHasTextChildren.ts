import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { isTextNode } from './isTextNode'

export const nodeHasTextChildren = (node: CoralNode | CoralRootNode) => {
  return node.children?.some((child) => isTextNode(child)) ?? false
}
