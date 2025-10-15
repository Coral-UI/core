import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { handleFigmaStyles } from './handleFigmaStyles'
import { normalizeName } from './normalizeName'

export const generateNode = async (node: SceneNode): Promise<CoralRootNode | CoralNode> => {
  const { styles, designTokens } = await handleFigmaStyles(node)

  const nodeData: CoralNode | CoralRootNode = {
    name: node.name,
    elementType: 'div',
    figmaNodeRef: node.id,
    styles,
    designTokens,
    children: [],
    type: 'NODE',
    figmaType: node.type,
  }

  if (node.type === 'INSTANCE') {
    // const mainComponent = await node.getMainComponentAsync()
    nodeData.isComponentInstance = true
    nodeData.type = 'INSTANCE'
    // nodeData.componentParentFigmaNodeRef = mainComponent?.parent?.id ?? mainComponent?.id
    let variantProperties: Record<string, { type: string; value: string | boolean }> = {}
    variantProperties = Object.entries(node.componentProperties).reduce<
      Record<string, { type: string; value: string | boolean }>
    >((acc, [key, value]) => {
      acc[normalizeName(key)] = {
        type: value.value === 'true' || value.value === 'false' ? 'boolean' : 'string',
        value: value.value,
      }
      return acc
    }, {})
    nodeData.variantProperties = variantProperties
  }

  if (node.type === 'COMPONENT') {
    const componentNode = node as ComponentNode
    nodeData.type = 'COMPONENT' // Correctly assign the type
    ;(nodeData as any).componentProperties = Object.entries(componentNode.variantProperties ?? {}).reduce<
      Record<string, { type: string; value: string }>
    >((acc, [key, value]) => {
      acc[normalizeName(key)] = {
        type: value === 'true' || value === 'false' ? 'boolean' : 'string',
        value: value,
      }
      return acc
    }, {})
  }

  if (node.type === 'TEXT') {
    nodeData.elementType = 'p'
    nodeData.textContent = node.characters
  }

  return nodeData
}
