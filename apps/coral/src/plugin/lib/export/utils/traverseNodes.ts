import { CoralDesignTokenType, CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { generateNode } from '../generate/generateNode'
import { handleFigmaStyles } from '../handleFigmaStyles'
import { isWrapperNode } from '../utils/isWrapperNode'
import { mergeWrapperStyles } from '../utils/mergeWrapperStyles'
import { processComponentSet } from './processComponentSet'

/**
 * Traverse and build the node tree
 */
export const traverseNodes = async (
  node: SceneNode,
  designTokens: Record<string, CoralDesignTokenType> = {},
): Promise<[CoralRootNode | CoralNode | null, Record<string, CoralDesignTokenType>]> => {
  if (node.type === 'COMPONENT_SET') {
    return processComponentSet(node as ComponentSetNode, designTokens)
  }

  // Regular node or component
  const nodeData = await generateNode(node)

  if (nodeData === null) {
    return [null, designTokens]
  }

  // Extract design tokens from current node
  const { designTokens: nodeDesignTokens } = await handleFigmaStyles(node)
  Object.assign(designTokens, nodeDesignTokens)

  // Check if this is a wrapper node BEFORE processing children
  const isWrapper = isWrapperNode(node.name)
  const hasSingleTextChild =
    'children' in node && node.children && node.children.length === 1 && node.children[0]?.type === 'TEXT'

  // Handle children
  if ('children' in node && node.children && node.children.length > 0) {
    for (const childNode of node.children) {
      const [childData, childTokens] = await traverseNodes(childNode, designTokens)
      if (childData && nodeData.children) {
        nodeData.children.push(childData)
      }
      Object.assign(designTokens, childTokens)
    }
  }

  // If this node is a wrapper with a TEXT child, merge styles and return the child instead
  if (isWrapper && hasSingleTextChild) {
    const child = nodeData.children?.[0]
    if (child) {
      // Merge wrapper's padding/margin styles into the text child
      mergeWrapperStyles(nodeData, child)
      // Return the child instead of the wrapper (flatten the wrapper)
      return [child, designTokens]
    }
  }

  return [nodeData, designTokens]
}
