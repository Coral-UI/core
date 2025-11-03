import { CoralNode } from '@reallygoodwork/coral-core'

import { isInlineElement } from '../assert/isInlineElement'
import { applyStyles } from '../styles/applyStyles'
import { convertNameToElementType } from '../utils/convertNameToElementType'

export const createFrame = async (spec: CoralNode) => {
  const frame = figma.createFrame()
  frame.name = convertNameToElementType(spec.elementType)

  // Remove default white background - only apply fills if explicitly specified in styles
  frame.fills = []

  // Special handling for img elements - they should not use auto-layout initially
  // Auto-layout will be set after the element is appended to its parent
  const isImgElement = spec.elementType === 'img'

  // Check if this will be a grid layout - if so, don't set layoutMode yet
  // Grid layout needs to be set AFTER children are appended
  const isGridLayout = spec.styles?.['display'] === 'grid'

  if (!isImgElement && !isGridLayout) {
    // Enable auto-layout by default with HUG sizing
    // Use horizontal layout for inline elements (a, span, etc.), vertical for block elements
    const isInline = isInlineElement(spec)
    frame.layoutMode = isInline ? 'HORIZONTAL' : 'VERTICAL'
    frame.layoutSizingHorizontal = 'HUG'
    frame.layoutSizingVertical = 'HUG'

    // Center-align inline elements vertically
    if (isInline) {
      frame.counterAxisAlignItems = 'CENTER'
    }
  } else if (isImgElement) {
    // For img elements, set a fixed size initially
    // This will be overridden to FILL after being appended to parent
    frame.layoutMode = 'VERTICAL'
    // Set fixed sizing initially to avoid HUG collapsing to 1px
    frame.resize(100, 100)
  } else if (isGridLayout) {
    // For grid layouts, start with VERTICAL layout
    // This will be converted to GRID after children are added
    frame.layoutMode = 'VERTICAL'
    frame.layoutSizingHorizontal = 'HUG'
    frame.layoutSizingVertical = 'HUG'
  }

  // Skip grid conversion initially - it will be applied after children are added
  const skipGridConversion = isGridLayout
  await applyStyles(frame, spec, undefined, undefined, skipGridConversion)
  return frame
}
