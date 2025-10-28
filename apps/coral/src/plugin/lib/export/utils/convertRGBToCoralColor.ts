import { colord } from 'colord'

import { CoralColorType } from '@reallygoodwork/coral-core'

const sliceNum = (num: number): string => {
  return num.toFixed(2).replace(/\.00$/, '')
}

export const convertRGBToCoralColor = (color: RGB, alpha: number = 1): CoralColorType => {
  if (color.r === 1 && color.g === 1 && color.b === 1 && alpha === 1) {
    return {
      hex: '#FFFFFF',
      rgb: {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      },
      hsl: {
        h: 0,
        s: 0,
        l: 1,
        a: 1,
      },
    }
  }

  if (color.r === 0 && color.g === 0 && color.b === 0 && alpha === 1) {
    return {
      hex: '#000000',
      rgb: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      },
      hsl: {
        h: 0,
        s: 0,
        l: 0,
        a: 1,
      },
    }
  }

  // Return # when possible.
  if (alpha === 1) {
    const r = Math.round(color.r * 255)
    const g = Math.round(color.g * 255)
    const b = Math.round(color.b * 255)

    const toHex = (num: number): string => num.toString(16).padStart(2, '0')
    return {
      hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase(),
      rgb: {
        r: r,
        g: g,
        b: b,
        a: alpha,
      },
      hsl: colord(`#${toHex(r)}${toHex(g)}${toHex(b)}`).toHsl(),
    }
  }

  const r = sliceNum(color.r * 255)
  const g = sliceNum(color.g * 255)
  const b = sliceNum(color.b * 255)
  const a = sliceNum(alpha)

  const colorVal = colord(`rgba(${r}, ${g}, ${b}, ${a})`)

  return {
    hex: colorVal.toHex(),
    rgb: colorVal.toRgb(),
    hsl: colorVal.toHsl(),
  }
}
