import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { ElementWithOptionalText } from '../../types'

/**
 * Parse gridTemplateColumns to extract the number of columns
 * Supports patterns like:
 * - "repeat(2, minmax(0, 1fr))" -> 2 columns
 * - "repeat(3, 1fr)" -> 3 columns
 * - "1fr 1fr 1fr" -> 3 columns
 */
export const parseGridColumnCount = (gridTemplateColumns: string): number => {
  // Try to match repeat(N, ...) pattern
  const repeatMatch = gridTemplateColumns.match(/repeat\((\d+),/)
  if (repeatMatch && repeatMatch[1] !== undefined) {
    return parseInt(repeatMatch[1], 10)
  }

  // Count explicit columns (e.g., "1fr 1fr 1fr" = 3 columns)
  const frMatch = gridTemplateColumns.match(/\d*\.?\d+fr/g)
  if (frMatch) {
    return frMatch.length
  }

  // Default to 1 column if we can't parse
  return 1
}

export const applyFlexDirection = (
  element: ElementWithOptionalText,
  node: CoralNode | CoralRootNode,
  skipGridConversion = false,
) => {
  const display = node.styles?.['display']
  const flexDirection = node.styles?.['flexDirection']

  if (display === 'flex') {
    if (flexDirection === 'column' || flexDirection === 'column-reverse') {
      element.layoutMode = 'VERTICAL'
      // Reverse the direction by setting primary axis to MAX (bottom to top)
      if (flexDirection === 'column-reverse' && 'primaryAxisAlignItems' in element) {
        element.primaryAxisAlignItems = 'MAX'
      }
    } else {
      element.layoutMode = 'HORIZONTAL'
      // Handle row-reverse by setting primary axis to MAX (right to left)
      if (flexDirection === 'row-reverse' && 'primaryAxisAlignItems' in element) {
        element.primaryAxisAlignItems = 'MAX'
      }
    }
  } else if (display === 'grid' && !skipGridConversion) {
    // Use Figma's native grid layout
    console.log(`Setting grid layout for ${node.name}`)
    element.layoutMode = 'GRID'

    // Parse gridTemplateColumns to determine number of columns
    const gridTemplateColumns = node.styles?.['gridTemplateColumns'] as string | undefined
    if (gridTemplateColumns) {
      const columnCount = parseGridColumnCount(gridTemplateColumns)
      console.log(`Grid column count for ${node.name}: ${columnCount}`)
      // Set the number of columns for the grid layout
      // Must set this after layoutMode is set to GRID
      if ('gridColumnCount' in element) {
        element.gridColumnCount = columnCount
        console.log(`Successfully set gridColumnCount to ${columnCount}`)
      } else {
        console.warn('gridColumnCount not available on this element')
      }
    }
  } else if (display === 'grid' && skipGridConversion) {
    // Mark element as needing grid conversion later
    console.log(`Deferring grid layout for ${node.name} until after children are added`)
    element.setPluginData('pendingGridLayout', 'true')
    const gridTemplateColumns = node.styles?.['gridTemplateColumns'] as string | undefined
    if (gridTemplateColumns) {
      const columnCount = parseGridColumnCount(gridTemplateColumns)
      element.setPluginData('gridColumnCount', columnCount.toString())
    }
  }
}
