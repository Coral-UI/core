import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

export const buildNodeText = (node: CoralNode | CoralRootNode) => {
  return node.children?.map((child) => child['textContent']).join(' ') ?? ''
}
