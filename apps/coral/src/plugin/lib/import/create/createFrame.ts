import { CoralNode } from '@reallygoodwork/coral-core'

import { isInlineElement } from '../assert/isInlineElement'
import { applyStyles } from '../styles/applyStyles'

export const createFrame = async (spec: CoralNode) => {
  const frame = figma.createFrame()
  frame.name = spec.name

  // Remove default white background - only apply fills if explicitly specified in styles
  frame.fills = []

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

  await applyStyles(frame, spec)
  return frame
}
