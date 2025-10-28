import { colord } from 'colord'

import { isColorString } from '../assert/isColorString'
import { isGradientString } from '../assert/isGradientString'
import { htmlGradientFromFills } from '../gradient/htmlGradientFromFills'
import { handlesPixelValues } from '../handlePixelValues'

const handleFigmaGradientString = (node: SceneNode) => {
  // console.log(node.fills)
  if ('fills' in node) {
    return htmlGradientFromFills(node.fills)
  }

  return ''
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
