import { CoralDesignTokenType, CoralNode } from '@reallygoodwork/coral-core'

import { handleFigmaStyles } from '../handleFigmaStyles'
import { generateNode } from './generateNode'

/**
 * Build a complete node tree for a single variant
 */
export const buildNodeTree = async (
  node: SceneNode,
  designTokens: Record<string, CoralDesignTokenType>,
): Promise<[CoralNode | null, Record<string, CoralDesignTokenType>]> => {
  const nodeData = await generateNode(node)

  if (nodeData === null) {
    return [null, designTokens]
  }

  // Extract design tokens from current node
  const { designTokens: nodeDesignTokens } = await handleFigmaStyles(node)
  Object.assign(designTokens, nodeDesignTokens)

  // Recursively build children
  if ('children' in node && node.children && node.children.length > 0) {
    for (const childNode of node.children) {
      const [childData, childTokens] = await buildNodeTree(childNode, designTokens)
      if (childData && nodeData.children) {
        nodeData.children.push(childData)
      }
      Object.assign(designTokens, childTokens)
    }
  }

  return [nodeData, designTokens]
}
