import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { VariantProperties, VariantPropertyValue } from '../../types'
import { handleFigmaStyles } from '../handleFigmaStyles'
import { extractElementType } from '../utils/extractElementType'
import { normalizeName } from '../utils/normalizeName'

export const generateNode = async (node: SceneNode): Promise<CoralRootNode | CoralNode> => {
  const { styles } = await handleFigmaStyles(node)

  // Extract element type from angle brackets in name (e.g., "Title <h2>" -> "h2")
  const extractedElementType = extractElementType(node.name)
  const defaultElementType = node.type === 'TEXT' ? 'p' : 'div'

  const nodeData: CoralNode = {
    name: node.name,
    elementType: (extractedElementType || defaultElementType) as CoralNode['elementType'],
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
    if (mainComponent) {
      nodeData.componentParentFigmaNodeRef = mainComponent.parent?.id ?? mainComponent.id
    }

    const variantProperties: VariantProperties = {}
    for (const [key, prop] of Object.entries(node.componentProperties)) {
      const normalizedKey = normalizeName(key)
      variantProperties[normalizedKey] = {
        type: prop.type === 'BOOLEAN' ? 'boolean' : 'string',
        value: prop.value as VariantPropertyValue,
      }
    }
    nodeData.variantProperties = variantProperties
  }

  if (node.type === 'COMPONENT') {
    const componentNode = node as ComponentNode
    nodeData.type = 'COMPONENT'

    const variantProperties: VariantProperties = {}
    for (const [key, value] of Object.entries(componentNode.variantProperties ?? {})) {
      const normalizedKey = normalizeName(key)
      const propValue: VariantPropertyValue = value === 'true' || value === 'false' ? value === 'true' : value
      variantProperties[normalizedKey] = {
        type: value === 'true' || value === 'false' ? 'boolean' : 'string',
        value: propValue,
      }
    }
    nodeData.variantProperties = variantProperties
  }

  if (node.type === 'TEXT') {
    // Element type may have been set from angle brackets, otherwise use 'p'
    if (!extractedElementType) {
      nodeData.elementType = 'p'
    }
    nodeData.textContent = (node as TextNode).characters
  }

  return nodeData
}
