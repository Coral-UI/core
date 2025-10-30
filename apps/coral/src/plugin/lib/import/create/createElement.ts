import { CoralNode, CoralRootNode, CoralStyleType } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../../export/utils/extractDimensionValue'
import { isCoralColor, textAlign } from '../../types'
import { isInlineElement } from '../assert/isInlineElement'
import { createComponent } from '../components/createComponent'
import { applyStyles } from '../styles/applyStyles'
import { deferredActionsQueue } from '../utils/deferredActions'
import { createSVGFrame } from '../vector/createSVGFrame'
import { isSVGElement } from '../vector/isSVGElement'
import { isSVGShapeElement } from '../vector/isSVGShapeElement'
import { createFrame } from './createFrame'
import { createTextandWrapper } from './createTextandWrapper'
import { createTextNode } from './createTextNode'

export const createElement = async (
  node: CoralNode | CoralRootNode,
  textAlign?: textAlign,
  parentStyles: CoralStyleType = {},
): Promise<SceneNode | null> => {
  const currentNode = node as CoralNode

  // Don't create separate nodes for SVG shape elements - they're handled by their parent SVG
  if (isSVGShapeElement(currentNode)) {
    return null
  }

  // Inherit textAlign from parent, but override if this node has its own textAlign
  const nodeTextAlign = node.styles?.['textAlign'] as textAlign | undefined
  const effectiveTextAlign = nodeTextAlign || textAlign

  // Check if this node has textContent directly on it (not just in children)
  const hasDirectTextContent = 'textContent' in node && node.textContent !== undefined && node.textContent !== ''

  // Check if node needs a wrapper frame (has padding, margin, background, or maxWidth)
  const needsWrapper =
    node.styles &&
    (node.styles['paddingInlineStart'] ||
      node.styles['paddingInlineEnd'] ||
      node.styles['paddingBlockStart'] ||
      node.styles['paddingBlockEnd'] ||
      node.styles['marginInlineStart'] ||
      node.styles['marginInlineEnd'] ||
      node.styles['marginBlockStart'] ||
      node.styles['marginBlockEnd'] ||
      node.styles['backgroundColor'] ||
      node.styles['maxWidth'])

  // If it has direct text content and no children
  if (hasDirectTextContent && (!node.children || node.children.length === 0)) {
    if (needsWrapper) {
      // Create a frame wrapper with text inside
      // The text node gets text-related styles (color, font, etc.)
      // The frame gets box-related styles (backgroundColor, padding, etc.)
      const { frame } = await createTextandWrapper(node, effectiveTextAlign)
      frame.name = node.name
      // Apply box model styles to frame only
      await applyStyles(frame, node, effectiveTextAlign, parentStyles)
      // Text styles (including inherited textAlign) are already applied in createTextandWrapper
      return frame
    } else {
      // Just create a text node directly - pass parent styles for inheritance
      const textNode = await createTextNode(node, parentStyles)
      await applyStyles(textNode, node, effectiveTextAlign, parentStyles)
      return textNode
    }
  }

  let element: SceneNode

  // Combine parent styles with current node styles for inheritance
  // Typography styles should cascade to children
  // Use Object.assign to avoid issues with frozen/sealed objects from state management
  const combinedStyles =
    'styles' in currentNode && currentNode.styles
      ? Object.assign({}, parentStyles || {}, currentNode.styles)
      : parentStyles

  // Check if children have textContent AND no other properties (inline text children)
  // We don't want to merge structural elements like <h2>, <dt>, <dd> into one text node
  // Only true inline text without any distinguishing styles should be merged
  const hasInlineTextChildren =
    !hasDirectTextContent &&
    currentNode.children?.some(
      (child) =>
        'textContent' in child &&
        child['textContent'] !== undefined &&
        (!child.children || child.children.length === 0) &&
        // Only merge if child has minimal structure (no significant styles at all)
        !(
          child.styles &&
          (child.styles['paddingInlineStart'] ||
            child.styles['paddingInlineEnd'] ||
            child.styles['paddingBlockStart'] ||
            child.styles['paddingBlockEnd'] ||
            child.styles['marginInlineStart'] ||
            child.styles['marginInlineEnd'] ||
            child.styles['marginBlockStart'] ||
            child.styles['marginBlockEnd'] ||
            child.styles['backgroundColor'] ||
            child.styles['fontSize'] ||
            child.styles['fontWeight'] ||
            child.styles['lineHeight'] ||
            child.styles['letterSpacing'])
        ),
    )

  // Handle img elements - create frame that will have image fill applied in applyStyles
  if (currentNode.elementType === 'img') {
    element = await createFrame(node)
  } else if (isSVGElement(currentNode)) {
    // Get parent color for currentColor resolution
    const colorValue = combinedStyles?.['color']
    let parentColor: RGB | undefined
    if (isCoralColor(colorValue)) {
      const hex = colorValue.hex.replace('#', '')
      parentColor = {
        r: parseInt(hex.substring(0, 2), 16) / 255,
        g: parseInt(hex.substring(2, 4), 16) / 255,
        b: parseInt(hex.substring(4, 6), 16) / 255,
      }
    }

    // Create SVG frame with vector children
    element = await createSVGFrame(currentNode, parentColor)
  } else if (hasInlineTextChildren) {
    const { frame } = await createTextandWrapper(node, effectiveTextAlign)
    element = frame
  } else if ('type' in node && currentNode.type === 'COMPONENT') {
    element = await createComponent(node)
  } else {
    element = await createFrame(node)
  }

  // Apply layout settings if a child with textContent exists and element supports layoutMode
  if (hasInlineTextChildren && 'layoutMode' in element) {
    element.layoutMode = 'VERTICAL'
    element.layoutSizingVertical = 'HUG'
    element.layoutSizingHorizontal = 'HUG'
    element.primaryAxisAlignItems = 'MIN'
    element.counterAxisAlignItems = 'MIN'
  }

  // If element has both children AND textContent, add the text as the FIRST child
  // This matches typical HTML where parent text content comes before child elements
  if (hasDirectTextContent && node.children && node.children.length > 0 && 'appendChild' in element) {
    const textNode = await createTextNode(node, combinedStyles)
    await applyStyles(textNode, node, effectiveTextAlign, combinedStyles)
    element.appendChild(textNode)
    // Set text node sizing: FILL for block elements (for proper text alignment),
    // HUG for inline elements (for natural content flow)
    textNode.layoutSizingHorizontal = isInlineElement(node) ? 'HUG' : 'FILL'
  }

  // Process children (skip for SVG elements as they're handled by createSVGFrame)
  if (!isSVGElement(currentNode) && 'children' in node && currentNode.children) {
    // Determine if current element is inline (affects child text node sizing)
    const isParentInline = isInlineElement(node)

    // Check if this element will become a grid
    const isGridLayout = node.styles?.['display'] === 'grid'

    // For grid layouts, we'll use appendChildAt to position children correctly
    // For non-grid layouts, process children normally
    const childrenToProcess = currentNode.children

    // Process children in sequence to maintain order
    for (let childIndex = 0; childIndex < childrenToProcess.length; childIndex++) {
      const child = childrenToProcess[childIndex]
      try {
        // Pass down the effective textAlign so children inherit it
        const childElement = await createElement(child, effectiveTextAlign, combinedStyles)
        if (childElement && 'appendChild' in element) {
          element.appendChild(childElement)
          // Set text node sizing: FILL for block parents (for proper text alignment),
          // HUG for inline parents (for natural content flow)
          if (childElement.type === 'TEXT') {
            childElement.layoutSizingHorizontal = isParentInline ? 'HUG' : 'FILL'
          }

          // After appending, apply FILL sizing for:
          // 1. Elements with maxWidth or width 100%
          // 2. Block-level elements (non-inline) - they should fill by default in CSS
          if ('layoutMode' in childElement && 'layoutSizingHorizontal' in childElement) {
            const hasMaxWidth = child.styles?.['maxWidth'] !== undefined
            const shouldFillWidth = child.styles?.['width'] === '100%' || child.styles?.['width'] === 'fill'
            const isBlockElement = !isInlineElement(child)

            if ((hasMaxWidth || shouldFillWidth || isBlockElement) && element.layoutMode !== 'NONE') {
              childElement.layoutSizingHorizontal = 'FILL'
            }
          }

          // Apply text-align centering to wrapper frames
          // In CSS, text-align: center centers text content. In Figma, we also need to center the frame itself
          if ('getPluginData' in childElement && childElement.getPluginData('textAlignCenter') === 'true') {
            // Center this element within its parent
            if ('layoutMode' in element && element.layoutMode !== 'NONE' && 'layoutAlign' in childElement) {
              childElement.layoutAlign = 'CENTER'
              childElement.setPluginData('textAlignCenter', '') // Clear the flag
            }
          }

          // Handle absolute positioning and sizing for all elements after being appended
          if ('layoutMode' in childElement && 'layoutMode' in element && element.layoutMode !== 'NONE') {
            try {
              const isAbsolute = child.styles?.['position'] === 'absolute'
              const hasInset = child.styles?.['inset'] !== undefined
              const insetValue = child.styles?.['inset']
              const shouldFillWidth = child.styles?.['width'] === '100%' || child.styles?.['width'] === 'fill'
              const shouldFillHeight = child.styles?.['height'] === '100%' || child.styles?.['height'] === 'fill'

              // Handle absolute positioning
              if (isAbsolute && 'layoutPositioning' in childElement) {
                childElement.layoutPositioning = 'ABSOLUTE'

                // Handle inset: 0 (stretch to fill parent)
                if (hasInset && insetValue === 0) {
                  childElement.x = 0
                  childElement.y = 0
                  childElement.constraints = {
                    horizontal: 'STRETCH',
                    vertical: 'STRETCH',
                  }
                  if ('width' in element && 'height' in element) {
                    childElement.resize(element.width, element.height)
                  }
                } else {
                  // Handle individual position properties (top, right, bottom, left)
                  const top = child.styles?.['top']
                  const right = child.styles?.['right']
                  const bottom = child.styles?.['bottom']
                  const left = child.styles?.['left']

                  // Calculate x position (left or right)
                  if (left !== undefined) {
                    const leftValue = typeof left === 'number' ? left : extractDimensionValue(left)
                    if (leftValue !== undefined) {
                      childElement.x = leftValue
                    }
                  } else if (right !== undefined) {
                    const rightValue = typeof right === 'number' ? right : extractDimensionValue(right)
                    if (rightValue !== undefined && 'width' in element) {
                      childElement.x = element.width - childElement.width - rightValue
                    }
                  } else {
                    childElement.x = 0
                  }

                  // Calculate y position (top or bottom)
                  if (top !== undefined) {
                    const topValue = typeof top === 'number' ? top : extractDimensionValue(top)
                    if (topValue !== undefined) {
                      childElement.y = topValue
                    }
                  } else if (bottom !== undefined) {
                    const bottomValue = typeof bottom === 'number' ? bottom : extractDimensionValue(bottom)
                    if (bottomValue !== undefined && 'height' in element) {
                      childElement.y = element.height - childElement.height - bottomValue
                    }
                  } else {
                    childElement.y = 0
                  }

                  // Set appropriate constraints based on which sides are set
                  if (left !== undefined && right !== undefined) {
                    childElement.constraints = { horizontal: 'STRETCH', vertical: childElement.constraints.vertical }
                  } else if (left !== undefined) {
                    childElement.constraints = { horizontal: 'MIN', vertical: childElement.constraints.vertical }
                  } else if (right !== undefined) {
                    childElement.constraints = { horizontal: 'MAX', vertical: childElement.constraints.vertical }
                  }

                  if (top !== undefined && bottom !== undefined) {
                    childElement.constraints = { horizontal: childElement.constraints.horizontal, vertical: 'STRETCH' }
                  } else if (top !== undefined) {
                    childElement.constraints = { horizontal: childElement.constraints.horizontal, vertical: 'MIN' }
                  } else if (bottom !== undefined) {
                    childElement.constraints = { horizontal: childElement.constraints.horizontal, vertical: 'MAX' }
                  }
                }
              } else {
                // Not absolutely positioned - use auto-layout FILL sizing if needed
                const isImgElement = 'elementType' in child && child.elementType === 'img'
                if (isImgElement) {
                  if (shouldFillWidth) {
                    childElement.layoutSizingHorizontal = 'FILL'
                  }
                  if (shouldFillHeight) {
                    childElement.layoutSizingVertical = 'FILL'
                  }
                }
              }
            } catch (error) {
              console.error(`Error setting positioning for ${child.name}:`, error)
            }
          }
        } else if (!childElement) {
          console.warn(`Child element ${child.name} was null, skipping`)
        }
      } catch (error) {
        console.error(`Error creating child element ${child.name}:`, error)
        // Continue processing other children even if one fails
      }
    }
  }

  // Apply grid layout conversion if it was deferred
  let gridWasConverted = false
  if ('layoutMode' in element && element.getPluginData('pendingGridLayout') === 'true') {
    // Before converting to GRID, update children sizing
    // Grid children cannot use HUG - they need FIXED sizing
    if ('children' in element) {
      for (const child of element.children) {
        if ('layoutSizingHorizontal' in child && child.layoutSizingHorizontal === 'HUG') {
          child.layoutSizingHorizontal = 'FIXED'
        }
        if ('layoutSizingVertical' in child && child.layoutSizingVertical === 'HUG') {
          child.layoutSizingVertical = 'FIXED'
        }
      }
    }

    const gridColumnCount = element.getPluginData('gridColumnCount')
    const columnCount = gridColumnCount ? parseInt(gridColumnCount, 10) : 2

    // Calculate the number of rows needed based on children count
    const childrenCount = 'children' in element ? element.children.length : 0
    const rowCount = Math.ceil(childrenCount / columnCount)

    element.layoutMode = 'GRID'

    // Set gridColumnCount and gridRowCount
    if (gridColumnCount && 'gridColumnCount' in element) {
      element.gridColumnCount = columnCount
    }
    if (rowCount > 0 && 'gridRowCount' in element) {
      element.gridRowCount = rowCount
      console.log(`Setting grid to ${columnCount} columns x ${rowCount} rows for ${childrenCount} children`)
    }

    // GRID elements cannot have HUG sizing - set to FIXED
    if ('layoutSizingHorizontal' in element) {
      element.layoutSizingHorizontal = 'FIXED'
    }
    if ('layoutSizingVertical' in element) {
      element.layoutSizingVertical = 'FIXED'
    }

    // Defer grid child repositioning until after the tree is fully built
    // Use appendChildAt to position children at their correct grid cell indices
    if ('children' in element && element.children.length > 0) {
      // Store reference to the grid element for the deferred action
      const gridElement = element

      deferredActionsQueue.add(() => {
        console.log(`\n=== Positioning grid children for ${gridElement.name} with ${gridElement.children.length} children, ${columnCount} columns ===`)

        // Figma grid appendChildAt signature: appendChildAt(node: SceneNode, rowIndex: number, columnIndex: number)
        // Note: Children are already appended, appendChildAt will reposition them
        const children = Array.from(gridElement.children)

        // Re-position children using appendChildAt (it will move them to the correct grid cell)
        children.forEach((child, index) => {
          const row = Math.floor(index / columnCount)
          const column = index % columnCount

          if ('appendChildAt' in gridElement) {
            try {
              gridElement.appendChildAt(child, row, column)

              // Set grid children to HUG height so they size to their content
              if ('layoutSizingVertical' in child) {
                child.layoutSizingVertical = 'HUG'
              }

              console.log(`  ${child.name} positioned at row ${row}, column ${column}`)
            } catch (error) {
              console.warn(`  Failed to position ${child.name}:`, error)
            }
          }
        })

        console.log(`=== Grid positioning complete ===\n`)
      })
    }

    // Clean up plugin data
    element.setPluginData('pendingGridLayout', '')
    element.setPluginData('gridColumnCount', '')
    gridWasConverted = true
  }

  // Apply styles (skip for SVG elements as createSVGFrame already handles sizing)
  // If we just converted to grid, skip grid conversion again
  if (!isSVGElement(currentNode)) {
    await applyStyles(element, node, effectiveTextAlign, combinedStyles, gridWasConverted)
  }

  return element
}
