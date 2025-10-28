import { CoralDesignTokenType, CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { generateNode } from '../generate/generateNode'
import { handleFigmaStyles } from '../handleFigmaStyles'
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

  return [nodeData, designTokens]
}
