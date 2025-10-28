import { CoralNode } from '@reallygoodwork/coral-core'

import { createShapeFromSVG } from './createShapeFromSVG'
import { isSVGShapeElement } from './isSVGShapeElement'

/**
 * Creates a frame to wrap SVG content (acts as the SVG container)
 */
export const createSVGFrame = async (node: CoralNode, parentColor?: RGB): Promise<FrameNode> => {
  const frame = figma.createFrame()
  frame.name = node.name

  // Get viewBox dimensions if present
  const attrs = node.elementAttributes || {}
  const viewBox = attrs['viewBox'] as string | undefined

  let width = parseFloat(node.styles?.['width'] as string) || 100
  let height = parseFloat(node.styles?.['height'] as string) || 100

  if (viewBox) {
    const parts = viewBox.split(' ')
    if (parts.length === 4 && parts[2] && parts[3]) {
      width = parseFloat(parts[2])
      height = parseFloat(parts[3])
    }
  }

  // Set frame size
  frame.resize(width, height)

  // Remove background fill (transparent)
  frame.fills = []

  // Process children (SVG shapes)
  if (node.children) {
    for (const child of node.children) {
      if (isSVGShapeElement(child)) {
        const shape = createShapeFromSVG(child, parentColor)
        if (shape) {
          frame.appendChild(shape)
        }
      }
    }
  }

  return frame
}
