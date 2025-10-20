import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { handleFigmaStyles } from './handleFigmaStyles'
import { normalizeName } from './normalizeName'

export const generateNode = async (node: SceneNode): Promise<CoralRootNode | CoralNode> => {
  const { styles } = await handleFigmaStyles(node)

  const nodeData: CoralNode = {
    name: node.name,
    elementType: 'div',
    figmaNodeRef: node.id,
    styles,
    children: [],
    type: 'NODE',
    figmaType: node.type,
  }

  if (node.type === 'INSTANCE') {
    const mainComponent = await node.getMainComponentAsync()
    nodeData.isComponentInstance = true
    nodeData.type = 'INSTANCE'
    nodeData.componentParentFigmaNodeRef = mainComponent?.parent?.id ?? mainComponent?.id

    const variantProperties: Record<string, { type: string | string[]; value: unknown }> = {}
    for (const [key, prop] of Object.entries(node.componentProperties)) {
      const normalizedKey = normalizeName(key)
      variantProperties[normalizedKey] = {
        type: prop.type === 'BOOLEAN' ? 'boolean' : 'string',
        value: prop.value,
      }
    }
    nodeData.variantProperties = variantProperties
  }

  if (node.type === 'COMPONENT') {
    const componentNode = node as ComponentNode
    nodeData.type = 'COMPONENT'

    const variantProperties: Record<string, { type: string | string[]; value: unknown }> = {}
    for (const [key, value] of Object.entries(componentNode.variantProperties ?? {})) {
      const normalizedKey = normalizeName(key)
      variantProperties[normalizedKey] = {
        type: value === 'true' || value === 'false' ? 'boolean' : 'string',
        value: value,
      }
    }
    nodeData.variantProperties = variantProperties
  }

  if (node.type === 'TEXT') {
    nodeData.elementType = 'p'
    nodeData.textContent = (node as TextNode).characters
  }

  return nodeData
}
