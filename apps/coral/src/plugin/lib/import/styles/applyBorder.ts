import { CoralColorType, CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { isCoralColor } from '../../types'
import { convertCoralColorToRGB, getColorOpacity } from '../color/convertCoralColorToRGB'
import { extractStyleValue } from '../utils/extractStyleValue'

export interface BorderStyle {
  width?: number
  color?: CoralColorType
  style?: 'solid' | 'dashed' | 'dotted'
}

/**
 * Extract border properties from a node
 * @param node - Coral node to extract border from
 * @returns Border style object or null if no border
 */
export function extractBorder(node: CoralNode | CoralRootNode): BorderStyle | null {
  if (!node.styles) return null

  const borderWidth = node.styles['borderWidth']
  const borderColor = node.styles['borderColor']
  const borderStyle = node.styles['borderStyle']

  if (!borderWidth || !borderColor || !isCoralColor(borderColor)) {
    return null
  }

  const strokeWeight = extractStyleValue(borderWidth)
  if (strokeWeight === undefined || strokeWeight <= 0) {
    return null
  }

  return {
    width: strokeWeight,
    color: borderColor,
    style: borderStyle as 'solid' | 'dashed' | 'dotted' | undefined,
  }
}

/**
 * Apply border styles to a Figma element
 * @param element - Figma element to apply border to
 * @param border - Border style object
 */
export function applyBorder(
  element: {
    strokeWeight?: number | typeof figma.mixed
    strokes?: readonly Paint[]
    dashPattern?: readonly number[] | number[]
  },
  border: BorderStyle,
): void {
  if (!border.width || !border.color) return

  element.strokeWeight = border.width
  element.strokes = [
    {
      type: 'SOLID',
      color: convertCoralColorToRGB(border.color),
      opacity: getColorOpacity(border.color),
    },
  ]

  // Handle border style (solid, dashed, dotted)
  if (border.style === 'dashed') {
    element.dashPattern = [border.width * 3, border.width * 2]
  } else if (border.style === 'dotted') {
    element.dashPattern = [border.width, border.width]
  }
  // Default is solid (no dashPattern needed)
}

/**
 * Apply border to a Figma element from a Coral node
 * Convenience function that combines extraction and application
 * @param element - Figma element to apply border to
 * @param node - Coral node to extract border from
 */
export function applyBorderFromNode(
  element: {
    strokeWeight?: number | typeof figma.mixed
    strokes?: readonly Paint[]
    dashPattern?: readonly number[] | number[]
  },
  node: CoralNode | CoralRootNode,
): void {
  const border = extractBorder(node)
  if (border) {
    applyBorder(element, border)
  }
}
