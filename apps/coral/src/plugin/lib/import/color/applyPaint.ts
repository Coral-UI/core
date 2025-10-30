import { CoralColorType, CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { Element } from '../../types'
import { loadImage } from '../image/loadImage'
import { cloneAPIObject } from '../../utils/cloneAPIObject'

export const applyPaint = async (element: Element, node: CoralNode | CoralRootNode): Promise<void> => {
  // Handle image fills for img elements or elements with background images
  const isImgElement = 'elementType' in node && node.elementType === 'img'
  const src = node.elementAttributes?.['src'] as string | undefined

  if (isImgElement && src) {
    try {
      const image = await loadImage(src)
      element.fills = [
        {
          type: 'IMAGE',
          imageHash: image.hash,
          scaleMode: 'FILL',
        },
      ]
      return
    } catch (error) {
      console.error(`Failed to apply image fill from ${src}:`, error)
      // Continue to apply backgroundColor if available as fallback
    }
  }

  const backgroundColor = node.styles?.['backgroundColor'] as CoralColorType

  if (backgroundColor) {
    const fills = cloneAPIObject(element.fills) as Paint[]
    const existingFill = fills[0]?.type === 'SOLID' ? (fills[0] as SolidPaint) : undefined
    fills[0] = figma.util.solidPaint(backgroundColor.hex, existingFill)
    element.fills = fills
  }
}
