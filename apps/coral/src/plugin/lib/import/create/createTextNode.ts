import { CoralNode } from '@reallygoodwork/coral-core'

export const createTextNode = async (spec: CoralNode) => {
  const textNode = figma.createText()

  const fontFamily = (spec.styles?.['fontFamily'] as string) ?? 'Inter'
  const fontWeight = (spec.styles?.['fontWeight'] as number) ?? 400

  // Import font style transformation
  const transformFontWeightToFigmaFontStyle = (weight: number): string => {
    if (weight >= 700) return 'Bold'
    if (weight >= 600) return 'SemiBold'
    if (weight >= 500) return 'Medium'
    return 'Regular'
  }

  const fontStyle = transformFontWeightToFigmaFontStyle(fontWeight)

  // Try to load the font, with fallbacks
  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle })
    textNode.fontName = { family: fontFamily, style: fontStyle }
  } catch (_error) {
    // Try with space in style name (e.g., "Semi Bold" instead of "SemiBold")
    const styleWithSpace = fontStyle.replace(/([A-Z])/g, ' $1').trim()
    try {
      await figma.loadFontAsync({ family: fontFamily, style: styleWithSpace })
      textNode.fontName = { family: fontFamily, style: styleWithSpace }
    } catch {
      // Fall back to Regular
      await figma.loadFontAsync({ family: fontFamily, style: 'Regular' })
      textNode.fontName = { family: fontFamily, style: 'Regular' }
    }
  }

  textNode.characters = spec.textContent ?? ''
  textNode.name = spec.name

  return textNode
}
