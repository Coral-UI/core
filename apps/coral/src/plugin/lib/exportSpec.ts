import { CoralDesignTokenType, CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { generateComponentSet } from './generateComponentSet'
import { generateNode } from './generateNode'

const traverseNodes = async (
  node: SceneNode,
  designTokens: Record<string, CoralDesignTokenType> = {},
): Promise<[CoralRootNode | CoralNode | null, Record<string, CoralDesignTokenType>]> => {
  let nodeData = null

  if (node.type === 'COMPONENT_SET') {
    nodeData = await generateComponentSet(node as ComponentSetNode)
  } else {
    nodeData = await generateNode(node as ComponentNode)
  }

  if (nodeData === null) {
    return [null, designTokens]
  }

  // Merge design tokens
  if ('designTokens' in nodeData) {
    Object.assign(designTokens, nodeData.designTokens)
    delete (nodeData as CoralRootNode).designTokens
  }

  if ('variants' in nodeData && node.type === 'COMPONENT_SET') {
    for (const variant of node.children) {
      const [variantData, variantTokens] = await traverseNodes(variant, designTokens)
      if (variantData) {
        nodeData.variants?.push(variantData)
      }
      Object.assign(designTokens, variantTokens)
    }
  } else if ('children' in node) {
    for (const childNode of node.children) {
      const [childData, childTokens] = await traverseNodes(childNode, designTokens)
      if (childData) {
        nodeData.children?.push(childData)
      }
      Object.assign(designTokens, childTokens)
    }
  }

  let finalDesignTokens = designTokens
  if (Object.keys(designTokens).length > 0) {
    finalDesignTokens = Object.fromEntries(
      Object.entries(designTokens).filter(
        (entry, index, self) => index === self.findIndex((t) => t[1].property === entry[1].property),
      ),
    )
  }
  return [nodeData, finalDesignTokens]
}

export async function exportSpec(): Promise<CoralRootNode | null> {
  const selection = figma.currentPage.selection

  if (selection.length === 0) {
    figma.notify('Please select a node to extract schema from')
    return null
  }

  const rootNode = selection[0]

  try {
    const [schema, designTokens] = await traverseNodes(rootNode as SceneNode)

    if (schema === null) {
      return null
    }

    return { ...schema, designTokens, $schema: 'https://coral.design/schema.json' }
  } catch (error) {
    console.error('Error exporting schema:', error)
    return null
  }
}
