/**
 * Converts Tailwind CSS scale values to pixel or percentage values.
 *
 * @param {string} scale - The Tailwind CSS scale value to convert.
 * @returns {string} The converted value in pixels, percentages, or special CSS values.
 *
 * @example
 * convertTailwindScaletoPixels('4') // returns '16px'
 * convertTailwindScaletoPixels('full') // returns '100%'
 * convertTailwindScaletoPixels('auto') // returns 'auto'
 * convertTailwindScaletoPixels('[10px_20px]') // returns '10px 20px'
 */

import { colord } from 'colord'

import { colors } from './colors'

export const convertTailwindScaletoPixels = (scale?: string) => {
  if (!scale) {
    return undefined
  }

  if (scale === 'auto') {
    return 'auto'
  }

  if (scale === 'full') {
    return '100%'
  }

  if (scale === 'min') {
    return 'min-content'
  }

  if (scale.startsWith('[')) {
    const items = scale.replace('[', '').replace(']', '').split('_')
    return items.join(' ')
  }

  if (scale.endsWith('%')) {
    return scale
  }

  if (scale === 'px') {
    return '1px'
  }

  const values = scale.split('-')
  const color = values[0] || ''
  const rest = values.slice(1)
  if (colors[color]) {
    const shade = rest.join('-')
    const colorValue = colors[color]
    if (typeof colorValue === 'object' && shade && colorValue[shade]) {
      return {
        hex: colord(colorValue[shade]).toHex(),
        rgb: colord(colorValue[shade]).toRgb(),
        hsl: colord(colorValue[shade]).toHsl(),
      }
    } else {
      return typeof colorValue === 'string' ? colorValue : undefined
    }
  }

  // if scale is a number, multiply by 4 and return px
  if (!isNaN(Number(scale))) {
    return Number(scale) * 4
  }
}
