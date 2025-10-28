import { CoralRootNode } from '@reallygoodwork/coral-core'

import { traverseNodes } from './utils/traverseNodes'

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

    // Ensure root-level properties
    const rootSchema: CoralRootNode = {
      ...schema,
      $schema: 'https://coral.design/schema.json',
      ...(Object.keys(designTokens).length > 0 ? { designTokens } : {}),
    }

    return rootSchema
  } catch (error) {
    console.error('Error exporting schema:', error)
    figma.notify(`Error exporting: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return null
  }
}
