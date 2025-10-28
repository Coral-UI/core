import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../../export/utils/extractDimensionValue'
import { Element, ElementWithOptionalText, textAlign } from '../../types'
import { isTextNode } from '../assert/isTextNode'
import { nodeHasTextChildren } from '../assert/nodeHasTextChildren'
import { applyPaint } from '../color/applyPaint'
import { applyTypographyStyles } from '../typography/applyTypographyStyles'
import { applyFlexAlignment } from './applyFlexAlignment'
import { applyFlexDirection } from './applyFlexDirection'
import { applyGap } from './applyGap'
import { applyMargin } from './applyMargin'
import { applyMaxWidth } from './applyMaxWidth'
import { applyPadding } from './applyPadding'

export const applyStyles = async (element: Element, node: CoralNode | CoralRootNode, addTextAlign?: textAlign) => {
  // Special case for text nodes that should fill
  if (isTextNode(node) && node.styles?.['width'] === '100%') {
    // Only set layoutSizingHorizontal if the element is in an auto-layout frame
    if (
      'layoutSizingHorizontal' in element &&
      element.parent &&
      'layoutMode' in element.parent &&
      element.parent.layoutMode !== 'NONE'
    ) {
      element.layoutSizingHorizontal = 'FILL'
    }
    // Don't return early for text nodes - they need other styles applied
  }

  // Auto-layout is now enabled by default in createFrame/createComponent
  // Here we just need to apply specific style overrides

  if (element.type !== 'TEXT' && 'layoutMode' in element) {
    // Override sizing if width is specified
    const shouldFill = node.styles?.['width'] === '100%' || node.styles?.['width'] === 'fill'
    if (shouldFill) {
      element.layoutSizingHorizontal = 'FILL'
    }

    // Override height if explicitly specified
    const heightValue = extractDimensionValue(node.styles?.['height'])
    if (heightValue !== undefined) {
      element.layoutSizingVertical = 'FIXED'
      element.resize(element.width, heightValue)
    }

    // Apply flex direction
    applyFlexDirection(element as ElementWithOptionalText, node)

    // Apply flex alignment (alignItems, justifyContent)
    applyFlexAlignment(element as ElementWithOptionalText, node)

    // Apply gap (columnGap, rowGap, gap)
    applyGap(element as ElementWithOptionalText, node)

    // Apply margin and padding together (margin is converted to padding in Figma)
    // Check if element has any margin properties (even if they're 'auto')
    const hasMarginProperty =
      node.styles &&
      ('marginInlineStart' in node.styles ||
        'marginInlineEnd' in node.styles ||
        'marginBlockStart' in node.styles ||
        'marginBlockEnd' in node.styles)

    if (hasMarginProperty) {
      // Has margin properties - applyMargin will combine padding + margin
      // (it handles 'auto' margins by ignoring them and still applying padding)
      applyMargin(element as ElementWithOptionalText, node)
    } else {
      // No margin properties at all - just apply padding normally
      applyPadding(element as ElementWithOptionalText, node)
    }

    // Apply border radius if specified
    const borderRadius = extractDimensionValue(node.styles?.['borderRadius'])
    if (borderRadius !== undefined) {
      element.cornerRadius = borderRadius
    }

    // Apply max width if specified
    applyMaxWidth(element as ElementWithOptionalText, node)

    // IMPORTANT: textAlign should NOT affect frame sizing or layout
    // It only applies to child text nodes, not the container frame itself
  }

  if (isTextNode(node) && element.type === 'TEXT') {
    // Apply typography styles to actual text nodes
    await applyTypographyStyles(element as TextNode, node.styles || {}, addTextAlign)
  } else if (addTextAlign && isTextNode(node) && node.styles?.['textAlign']) {
    // Only apply text alignment to text nodes, not frames
    ;(element as TextNode).textAlignHorizontal =
      ((node.styles?.['textAlign'] as string).toUpperCase() as TextNode['textAlignHorizontal']) ?? 'LEFT'
  }

  if (node.styles) {
    Object.entries(node.styles).forEach(([key]) => {
      if (key === 'backgroundColor') {
        if (!nodeHasTextChildren(node) && element.type !== 'TEXT') {
          applyPaint(element, node)
        }
      }

      // Color should NEVER be applied to frames - it's only for text fills
      // It's already handled by applyTypographyStyles for actual text nodes
    })
  }
}
