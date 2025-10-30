import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { ElementWithOptionalText, textAlign } from '../../types'

export const applyFlexAlignment = (
  element: ElementWithOptionalText,
  node: CoralNode | CoralRootNode,
  inheritedTextAlign?: textAlign,
) => {
  // alignItems controls cross-axis alignment
  if (node.styles?.['alignItems']) {
    const alignItems = node.styles['alignItems'] as string

    if (alignItems === 'center') {
      element.counterAxisAlignItems = 'CENTER'
    } else if (alignItems === 'flex-start' || alignItems === 'start') {
      element.counterAxisAlignItems = 'MIN'
    } else if (alignItems === 'flex-end' || alignItems === 'end') {
      element.counterAxisAlignItems = 'MAX'
    }
  }

  // justifyContent controls main-axis alignment
  if (node.styles?.['justifyContent']) {
    const justifyContent = node.styles['justifyContent'] as string

    if (justifyContent === 'center') {
      element.primaryAxisAlignItems = 'CENTER'
    } else if (justifyContent === 'flex-start' || justifyContent === 'start') {
      element.primaryAxisAlignItems = 'MIN'
    } else if (justifyContent === 'flex-end' || justifyContent === 'end') {
      element.primaryAxisAlignItems = 'MAX'
    } else if (justifyContent === 'space-between') {
      element.primaryAxisAlignItems = 'SPACE_BETWEEN'
    }
  }

  // Convert textAlign to alignment for container elements
  // In CSS, text-align centers both inline content AND block children (like buttons)
  // In Figma auto-layout with vertical layout (column), we need counterAxisAlignItems
  // to center children horizontally
  // Use inherited textAlign if node doesn't have its own
  const effectiveTextAlign = (node.styles?.['textAlign'] as string) || inheritedTextAlign

  if (effectiveTextAlign) {
    const isVertical = element.layoutMode === 'VERTICAL'

    if (effectiveTextAlign === 'center') {
      // For vertical layouts, counterAxis is horizontal (what we want for centering)
      // For horizontal layouts, primaryAxis is horizontal
      if (isVertical) {
        element.counterAxisAlignItems = 'CENTER'
      } else {
        element.primaryAxisAlignItems = 'CENTER'
      }
    } else if (effectiveTextAlign === 'left' || effectiveTextAlign === 'start') {
      if (isVertical) {
        element.counterAxisAlignItems = 'MIN'
      } else {
        element.primaryAxisAlignItems = 'MIN'
      }
    } else if (effectiveTextAlign === 'right' || effectiveTextAlign === 'end') {
      if (isVertical) {
        element.counterAxisAlignItems = 'MAX'
      } else {
        element.primaryAxisAlignItems = 'MAX'
      }
    }
  }
}
