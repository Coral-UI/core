import { extractDimensionValue } from '@/plugin/lib/export/utils/extractDimensionValue'
import { ElementWithOptionalText } from '@/plugin/lib/types'

import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

export const applyGap = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  const isHorizontal = element.layoutMode === 'HORIZONTAL'
  const isGrid = element.layoutMode === 'GRID'

  // For grid layouts, use grid-specific gap properties
  if (isGrid) {
    // gridColumnGap for horizontal gap between columns
    if (node.styles?.['columnGap']) {
      const columnGapValue = extractDimensionValue(node.styles['columnGap'])
      if (columnGapValue !== undefined && 'gridColumnGap' in element) {
        element.gridColumnGap = columnGapValue
      }
    }

    // gridRowGap for vertical gap between rows
    if (node.styles?.['rowGap']) {
      const rowGapValue = extractDimensionValue(node.styles['rowGap'])
      if (rowGapValue !== undefined && 'gridRowGap' in element) {
        element.gridRowGap = rowGapValue
      }
    }

    // Generic 'gap' applies to both column and row gaps
    if (node.styles?.['gap']) {
      const gapValue = extractDimensionValue(node.styles['gap'])
      if (gapValue !== undefined) {
        if ('gridColumnGap' in element) element.gridColumnGap = gapValue
        if ('gridRowGap' in element) element.gridRowGap = gapValue
      }
    }
  } else {
    // Standard flex layout gap handling
    if (isHorizontal && node.styles?.['columnGap']) {
      const gapValue = extractDimensionValue(node.styles['columnGap'])
      if (gapValue !== undefined) element.itemSpacing = gapValue
    } else if (!isHorizontal && node.styles?.['rowGap']) {
      const gapValue = extractDimensionValue(node.styles['rowGap'])
      if (gapValue !== undefined) element.itemSpacing = gapValue
    }

    // Generic 'gap' property applies to both
    if (node.styles?.['gap']) {
      const gapValue = extractDimensionValue(node.styles['gap'])
      if (gapValue !== undefined) element.itemSpacing = gapValue
    }
  }
}
