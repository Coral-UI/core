import { CoralNode } from '@reallygoodwork/coral-core'

import { textAlign } from '../../types'
import { isInlineElement } from '../assert/isInlineElement'
import { applyMargin } from '../styles/applyMargin'
import { applyTypographyStyles } from '../typography/applyTypographyStyles'
import { transformFontWeightToFigmaFontStyle } from '../typography/transformFontWeightToFigmaFontStyle'
import { convertNameToElementType } from '../utils/convertNameToElementType'

export const createFrameWithFillingText = async (node: CoralNode, inheritedTextAlign?: textAlign) => {
  // Separate styles into text styles and box model styles
  // Text styles (color, font, etc.) go on the text node
  // Box model styles (backgroundColor, padding, etc.) stay on the frame
  // Use Object.assign to avoid issues with frozen/sealed objects from state management
  const styles = Object.assign({}, node.styles || {})

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
  textNode.name = convertNameToElementType(node.elementType)

  // Try to load the font, with fallbacks
  let loadedFontStyle = fontStyle
  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle })
  } catch (_error) {
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

  applyMargin(frame, node)
  // Apply typography styles including color to the text node
  // This ensures color from the parent node goes to text, not the frame
  // Pass effectiveTextAlign so it can be applied if not in styles
  await applyTypographyStyles(textNode, styles, effectiveTextAlign)

  return { frame, textNode }
}
