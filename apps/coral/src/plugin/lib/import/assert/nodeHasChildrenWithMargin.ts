import { CoralNode, CoralRootNode, CoralStyleType } from '@reallygoodwork/coral-core'

export const nodeHasChildrenWithMargin = (node: CoralNode | CoralRootNode) => {
  return (
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['marginInlineStart']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['marginInlineEnd']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['marginBlockStart']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['marginBlockEnd']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['paddingInlineStart']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['paddingInlineEnd']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['paddingBlockStart']) ||
    node.children?.some((child) => (child['styles'] as CoralStyleType)?.['paddingBlockEnd'])
  )
}
