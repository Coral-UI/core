import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { extractDimensionValue, isPercentageDimension } from '../extractDimensionValue'
import { applyPaint } from './applyPaint'
import { isInlineElement, isTextNode, nodeHasTextChildren } from './importSpec'
import { applyTypographyStyles, textAlign, transformFontWeightToFigmaFontStyle } from './styleText'

const shouldApplyAutoLayout = (node: CoralNode | CoralRootNode) => {
  if (node.textContent && nodeHasTextChildren(node)) {
    return false
  }

  return (
    Object.prototype.hasOwnProperty.call(node.styles, 'marginInlineStart') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'marginInlineEnd') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'marginBlockStart') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'marginBlockEnd') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'paddingInlineStart') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'paddingInlineEnd') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'paddingBlockStart') ||
    Object.prototype.hasOwnProperty.call(node.styles, 'paddingBlockEnd')
  )
}

const childRequiresAutoLayout = (node: CoralNode | CoralRootNode) => {
  return node.children?.some((child) => shouldApplyAutoLayout(child)) ?? false
}

const applyAutoLayout = (element: ElementWithOptionalText, shouldFill: boolean = false, node?: CoralNode | CoralRootNode) => {
  // Step 3: Enable autoLayout (must happen after children are added)
  element.layoutMode = 'VERTICAL'

  // Step 4 & 5: Set sizing (must happen after autoLayout)
  element.layoutSizingHorizontal = shouldFill ? 'FILL' : 'HUG'

  // Only set fixed height if explicitly specified, otherwise hug contents
  const heightValue = extractDimensionValue(node?.styles?.['height'])
  if (heightValue !== undefined) {
    element.layoutSizingVertical = 'FIXED'
    element.resize(element.width, heightValue)
  } else {
    element.layoutSizingVertical = 'HUG'
  }

  return element
}

const applyFlexDirection = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  if (node.styles?.['display'] === 'flex') {
    if (node.styles?.['flexDirection'] === 'column' || node.styles?.['flexDirection'] === 'column-reverse') {
      element.layoutMode = 'VERTICAL'
    } else {
      element.layoutMode = 'HORIZONTAL'
    }
  }
}

const applyFlexAlignment = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  // alignItems controls cross-axis alignment
  if (node.styles?.['alignItems']) {
    const alignItems = node.styles['alignItems'] as string
    const isHorizontal = element.layoutMode === 'HORIZONTAL'

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
  if (node.styles?.['textAlign']) {
    const textAlign = node.styles['textAlign'] as string
    const isVertical = element.layoutMode === 'VERTICAL'

    if (textAlign === 'center') {
      // For vertical layouts, counterAxis is horizontal (what we want for centering)
      // For horizontal layouts, primaryAxis is horizontal
      if (isVertical) {
        element.counterAxisAlignItems = 'CENTER'
      } else {
        element.primaryAxisAlignItems = 'CENTER'
      }
    } else if (textAlign === 'left' || textAlign === 'start') {
      if (isVertical) {
        element.counterAxisAlignItems = 'MIN'
      } else {
        element.primaryAxisAlignItems = 'MIN'
      }
    } else if (textAlign === 'right' || textAlign === 'end') {
      if (isVertical) {
        element.counterAxisAlignItems = 'MAX'
      } else {
        element.primaryAxisAlignItems = 'MAX'
      }
    }
  }
}

const applyGap = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  // columnGap for horizontal layouts, rowGap for vertical layouts
  const isHorizontal = element.layoutMode === 'HORIZONTAL'

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

const applyPadding = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  const paddingLeft = extractDimensionValue(node.styles?.['paddingInlineStart'])
  if (paddingLeft !== undefined) {
    element.paddingLeft = paddingLeft
  }

  const paddingRight = extractDimensionValue(node.styles?.['paddingInlineEnd'])
  if (paddingRight !== undefined) {
    element.paddingRight = paddingRight
  }

  const paddingTop = extractDimensionValue(node.styles?.['paddingBlockStart'])
  if (paddingTop !== undefined) {
    element.paddingTop = paddingTop
  }

  const paddingBottom = extractDimensionValue(node.styles?.['paddingBlockEnd'])
  if (paddingBottom !== undefined) {
    element.paddingBottom = paddingBottom
  }
}

const applyMargin = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  // In Figma, we simulate margins by converting them to padding on the element
  // This only works for frames with auto-layout enabled

  // Only apply margins if the element has auto-layout (layoutMode is not NONE)
  if ('layoutMode' in element && element.layoutMode === 'NONE') {
    return
  }

  // Get margin values (only numeric ones, ignore 'auto')
  const marginLeft = extractDimensionValue(node.styles?.['marginInlineStart']) || 0
  const marginRight = extractDimensionValue(node.styles?.['marginInlineEnd']) || 0
  const marginTop = extractDimensionValue(node.styles?.['marginBlockStart']) || 0
  const marginBottom = extractDimensionValue(node.styles?.['marginBlockEnd']) || 0

  // Get padding values
  const paddingLeft = extractDimensionValue(node.styles?.['paddingInlineStart']) || 0
  const paddingRight = extractDimensionValue(node.styles?.['paddingInlineEnd']) || 0
  const paddingTop = extractDimensionValue(node.styles?.['paddingBlockStart']) || 0
  const paddingBottom = extractDimensionValue(node.styles?.['paddingBlockEnd']) || 0

  // Always set padding (even if margin is 0), to ensure padding is applied
  if (paddingLeft > 0 || marginLeft > 0) {
    element.paddingLeft = paddingLeft + marginLeft
  }

  if (paddingRight > 0 || marginRight > 0) {
    element.paddingRight = paddingRight + marginRight
  }

  if (paddingTop > 0 || marginTop > 0) {
    element.paddingTop = paddingTop + marginTop
  }

  if (paddingBottom > 0 || marginBottom > 0) {
    element.paddingBottom = paddingBottom + marginBottom
  }
}

const applyMarginToFrame = applyMargin // Keep old name for backwards compatibility

export const applyMaxWidth = (element: ElementWithOptionalText, node: CoralNode | CoralRootNode) => {
  const maxWidth = extractDimensionValue(node.styles?.['maxWidth'])
  if (maxWidth !== undefined) {
    // element.layoutSizingHorizontal = 'HUG'
    element.maxWidth = maxWidth
    element.resize(maxWidth, element.height)
  }
}

export type Element = FrameNode | ComponentNode | InstanceNode | TextNode
type ElementWithOptionalText = FrameNode | ComponentNode | InstanceNode

// Add this new function
export const createFrameWithFillingText = async (node: CoralNode, inheritedTextAlign?: textAlign) => {
  // Separate styles into text styles and box model styles
  // Text styles (color, font, etc.) go on the text node
  // Box model styles (backgroundColor, padding, etc.) stay on the frame
  const styles = {
    ...node.styles,
  }

  // Determine effective textAlign: use node's own textAlign if present, otherwise inherit from parent
  const nodeTextAlign = styles?.['textAlign'] as textAlign | undefined
  const effectiveTextAlign = nodeTextAlign || inheritedTextAlign

  const textContent = node.children?.find((child) => 'textContent' in child)?.textContent ?? node.textContent

  // Step 1: Create the frame
  const frame = figma.createFrame()

  // Remove default white background - only apply fills if explicitly specified in styles
  frame.fills = []

  const fontFamily = (styles?.['fontFamily'] as string) ?? 'Inter'
  const fontWeight = (styles?.['fontWeight'] as number) ?? 400
  const fontStyle = transformFontWeightToFigmaFontStyle(fontWeight)

  // Step 2: Create and immediately append the text node
  const textNode = figma.createText()

  // Try to load the font, with fallbacks
  let loadedFontStyle = fontStyle
  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle })
  } catch (error) {
    // Try with space in style name (e.g., "Semi Bold" instead of "SemiBold")
    const styleWithSpace = fontStyle.replace(/([A-Z])/g, ' $1').trim()
    try {
      await figma.loadFontAsync({ family: fontFamily, style: styleWithSpace })
      loadedFontStyle = styleWithSpace
    } catch {
      // Fall back to Regular
      await figma.loadFontAsync({ family: fontFamily, style: 'Regular' })
      loadedFontStyle = 'Regular'
    }
  }

  textNode.fontName = { family: fontFamily, style: loadedFontStyle }

  textNode.characters = textContent ?? ''

  frame.appendChild(textNode)

  // Enable auto-layout first before setting sizing properties
  // Use horizontal layout for inline elements (a, span, etc.), vertical for block elements
  const isInline = isInlineElement(node)
  frame.layoutMode = isInline ? 'HORIZONTAL' : 'VERTICAL'

  // Now that the frame has auto-layout, we can set sizing properties
  frame.layoutSizingVertical = 'HUG'
  frame.layoutSizingHorizontal = 'HUG'

  // Set text node sizing: FILL for block elements (for proper text alignment),
  // HUG for inline elements (for natural content flow)
  textNode.layoutSizingHorizontal = isInline ? 'HUG' : 'FILL'

  // Center-align inline elements vertically
  if (isInline) {
    frame.counterAxisAlignItems = 'CENTER'
  }

  applyMarginToFrame(frame, node)
  // Apply typography styles including color to the text node
  // This ensures color from the parent node goes to text, not the frame
  applyTypographyStyles(textNode, styles)

  // Apply text alignment (either from node's own styles or inherited from parent)
  if (effectiveTextAlign) {
    textNode.textAlignHorizontal = effectiveTextAlign.toUpperCase() as TextNode['textAlignHorizontal']
  } else {
    textNode.textAlignHorizontal = 'LEFT'
  }

  return { frame, textNode }
}

// Modify applyStyles to handle this special case
export const applyStyles = async (element: Element, node: CoralNode | CoralRootNode, addTextAlign?: textAlign) => {
  // Special case for text nodes that should fill
  if (isTextNode(node) && node.styles?.['width'] === '100%') {
    // Only set layoutSizingHorizontal if the element is in an auto-layout frame
    if ('layoutSizingHorizontal' in element && element.parent && 'layoutMode' in element.parent && element.parent.layoutMode !== 'NONE') {
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
    const hasMarginProperty = node.styles && (
      'marginInlineStart' in node.styles ||
      'marginInlineEnd' in node.styles ||
      'marginBlockStart' in node.styles ||
      'marginBlockEnd' in node.styles
    )

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
    ;(element as TextNode).textAlignHorizontal = (node.styles?.['textAlign'] as string).toUpperCase() as TextNode['textAlignHorizontal'] ?? 'LEFT'
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
