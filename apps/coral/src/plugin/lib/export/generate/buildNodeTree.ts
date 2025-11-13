import { CoralDesignTokenType, CoralNode } from '@reallygoodwork/coral-core'

import { handleFigmaStyles } from '../handleFigmaStyles'
import { isWrapperNode } from '../utils/isWrapperNode'
import { mergeWrapperStyles } from '../utils/mergeWrapperStyles'
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

  // Check if this is a wrapper node BEFORE processing children
  const isWrapper = isWrapperNode(node.name)
  const hasSingleTextChild =
    'children' in node && node.children && node.children.length === 1 && node.children[0]?.type === 'TEXT'

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
