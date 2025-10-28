import { CoralRootNode } from '@reallygoodwork/coral-core'

import { handleFigmaStyles } from '../handleFigmaStyles'
import { transformComponentProperties } from '../transformComponentProperties'

export const generateComponentSet = async (node: ComponentSetNode): Promise<CoralRootNode> => {
  const { styles } = await handleFigmaStyles(node)

  return {
    name: node.name,
    componentName: node.name,
    isComponentSet: true,
    elementType: 'div',
    figmaNodeRef: node.id,
    componentProperties: transformComponentProperties(node.componentPropertyDefinitions),
    styles,
    variants: [],
    children: [],
    figmaType: node.type,
    numberOfVariants: node.children.length,
    $schema: 'https://coral.design/schema.json',
  }
}
