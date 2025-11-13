import { CoralColorType } from '@reallygoodwork/coral-core'

/**
 * Convert Coral color to Figma RGB
 * @param color - Coral color object
 * @returns Figma RGB color object with values in range [0, 1]
 */
export function convertCoralColorToRGB(color: CoralColorType | undefined | null): RGB {
  if (!color) return { r: 0, g: 0, b: 0 }

  // Color can be { hex, rgb, hsl }
  if (color.rgb) {
    return {
      r: color.rgb.r / 255,
      g: color.rgb.g / 255,
      b: color.rgb.b / 255,
    }
  }

  // Fallback: parse hex
  if (color.hex) {
    const hex = color.hex.replace('#', '')
    return {
      r: parseInt(hex.substring(0, 2), 16) / 255,
      g: parseInt(hex.substring(2, 4), 16) / 255,
      b: parseInt(hex.substring(4, 6), 16) / 255,
    }
  }

  return { r: 0, g: 0, b: 0 }
}

/**
 * Get opacity from color object
 * @param color - Coral color object
 * @returns Opacity value in range [0, 1], defaults to 1 if not specified
 */
export function getColorOpacity(color: CoralColorType | undefined | null): number {
  if (!color) return 1
  if (color.rgb?.a !== undefined) return color.rgb.a
  if (color.hsl?.a !== undefined) return color.hsl.a
  return 1
}
