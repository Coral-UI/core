import { colord } from 'colord'

import { htmlGradientFromFills } from './handleFigmaGradient'
import { handlesPixelValues } from './handlePixelValues'

const handleFigmaGradientString = (node: SceneNode) => {
  // console.log(node.fills)
  if ('fills' in node) {
    return htmlGradientFromFills(node.fills)
  }

  return ''
}

const isGradientString = (value: string) => {
  return value.startsWith('linear-gradient') || value.startsWith('radial-gradient')
}

const isColorString = (value: string) => {
  return (
    value.startsWith('#') ||
    value.startsWith('hsl') ||
    value.startsWith('hsla') ||
    value.startsWith('rgb') ||
    value.startsWith('rgba')
  )
}

export const transformStyleValue = (value: string, node: SceneNode) => {
  return isColorString(value)
    ? {
        hex: colord(value).toHex(),
        rgb: colord(value).toRgb(),
        hsl: colord(value).toHsl(),
      }
    : isGradientString(value)
      ? handleFigmaGradientString(node)
      : handlesPixelValues(value)
}
