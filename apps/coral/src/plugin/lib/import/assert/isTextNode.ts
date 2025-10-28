import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

export const isTextNode = (node: CoralNode | CoralRootNode): node is CoralNode | CoralRootNode => {
  return node.textContent !== undefined
}
