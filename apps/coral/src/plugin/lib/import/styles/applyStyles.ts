import { CoralNode, CoralRootNode, CoralStyleType } from '@reallygoodwork/coral-core'

import { extractDimensionValue } from '../../export/utils/extractDimensionValue'
import { Element, ElementWithOptionalText, textAlign } from '../../types'
import { isTextNode } from '../assert/isTextNode'
import { nodeHasTextChildren } from '../assert/nodeHasTextChildren'
import { applyPaint } from '../color/applyPaint'
import { applyTypographyStyles } from '../typography/applyTypographyStyles'
import { applyFlexAlignment } from './applyFlexAlignment'
import { applyFlexDirection } from './applyFlexDirection'
import { applyGap } from './applyGap'
import { applyHidden } from './applyHidden'
import { applyMargin } from './applyMargin'
import { applyMaxWidth } from './applyMaxWidth'
import { applyPadding } from './applyPadding'

export const applyStyles = async (
  element: Element,
  node: CoralNode | CoralRootNode,
  addTextAlign?: textAlign,
  inheritedStyles?: CoralStyleType,
  skipGridConversion = false,
) => {
  // Merge inherited styles with node styles (node styles override)
  // Use Object.assign to avoid issues with frozen/sealed objects from state management
  try {
    const combinedStyles = Object.assign({}, inheritedStyles || {}, node.styles || {})

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
      // Check if parent has auto-layout enabled
      // Safely check parent without accessing properties on potentially frozen objects
      let parentHasAutoLayout = false
      try {
        parentHasAutoLayout = !!(
          element.parent &&
          'layoutMode' in element.parent &&
          element.parent.layoutMode !== 'NONE'
        )
      } catch (_error) {
        parentHasAutoLayout = false
      }

      // Skip FILL sizing for img elements and absolutely positioned elements
      // They will be handled after being appended to parent
      const isImgElement = 'elementType' in node && node.elementType === 'img'
      const isAbsolute = node.styles?.['position'] === 'absolute'

      if (!isImgElement && !isAbsolute) {
        // Override sizing if width is specified
        const shouldFillWidth = node.styles?.['width'] === '100%' || node.styles?.['width'] === 'fill'
        const hasMaxWidth = node.styles?.['maxWidth'] !== undefined

        // Elements with explicit fill width or maxWidth should use FILL sizing
        // (only if parent has auto-layout - can't set FILL without a parent)
        if ((shouldFillWidth || hasMaxWidth) && parentHasAutoLayout) {
          element.layoutSizingHorizontal = 'FILL'
        }

        // Override height if explicitly specified
        const heightStyle = node.styles?.['height']
        const shouldFillHeight = heightStyle === '100%' || heightStyle === 'fill'

        if (shouldFillHeight && parentHasAutoLayout) {
          element.layoutSizingVertical = 'FILL'
        } else {
          const heightValue = extractDimensionValue(heightStyle)
          // Only set FIXED sizing if there's an explicit pixel value
          // Otherwise, keep HUG sizing (default) to prevent collapsing
          if (heightValue !== undefined && heightValue > 0) {
            element.layoutSizingVertical = 'FIXED'
            element.resize(element.width, heightValue)
          } else if (heightStyle === undefined && element.layoutMode !== 'GRID') {
            // No height specified - explicitly set to HUG to ensure proper sizing
            // BUT: Skip this for GRID layouts - they need FIXED sizing
            element.layoutSizingVertical = 'HUG'
          }
        }
      }

      applyHidden(element as ElementWithOptionalText, node)

      // Apply flex direction (skip grid conversion if requested - will be done after children added)
      applyFlexDirection(element as ElementWithOptionalText, node, skipGridConversion)

      // Apply flex alignment (alignItems, justifyContent, and inherited textAlign)
      applyFlexAlignment(element as ElementWithOptionalText, node, addTextAlign)

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

      // Apply opacity if specified
      const opacity = node.styles?.['opacity']
      if (typeof opacity === 'number') {
        element.opacity = opacity
      }

      // Apply max width if specified
      applyMaxWidth(element as ElementWithOptionalText, node)

      // IMPORTANT: textAlign should NOT affect frame sizing or layout
      // It only applies to child text nodes, not the container frame itself
    }

    const isText = isTextNode(node)

    if (isText && element.type === 'TEXT') {
      // Apply typography styles to actual text nodes with inherited styles
      await applyTypographyStyles(element as TextNode, combinedStyles, addTextAlign)
    } else if (addTextAlign && isText && element.type === 'TEXT') {
      const textAlign = combinedStyles?.['textAlign']
      if (textAlign) {
        // Only apply text alignment to text nodes, not frames
        ;(element as TextNode).textAlignHorizontal =
          ((textAlign as string).toUpperCase() as TextNode['textAlignHorizontal']) ?? 'LEFT'
      }
    }

    if (node.styles) {
      // Use combinedStyles (which is already a plain object) instead of node.styles
      // to avoid issues with frozen/sealed objects from state management
      if (combinedStyles['backgroundColor']) {
        if (!nodeHasTextChildren(node) && element.type !== 'TEXT') {
          await applyPaint(element, node)
        }
      }
    }

    // Apply image fills for img elements (even if no backgroundColor)
    if ('elementType' in node && node.elementType === 'img') {
      await applyPaint(element, node)
    }
  } catch (error) {
    console.error(`[applyStyles] ERROR for ${node.name}:`, error)
    throw error
  }
}
