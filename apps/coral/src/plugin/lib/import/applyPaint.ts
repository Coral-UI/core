import { CoralColorType, CoralNode, CoralRootNode, CoralStyleType } from '@reallygoodwork/coral-core'

import { Element } from './styles'

function clone(val: any): any {
  const type = typeof val
  if (val === null) {
    return null
  } else if (type === 'undefined' || type === 'number' || type === 'string' || type === 'boolean') {
    return val
  } else if (type === 'object') {
    if (val instanceof Array) {
      return val.map((x) => clone(x))
    } else if (val instanceof Uint8Array) {
      return new Uint8Array(val)
    } else {
      const o = {}
      for (const key in val) {
        o[key] = clone(val[key])
      }
      return o
    }
  }
  throw 'unknown'
}

export const applyPaint = (element: Element, node: CoralNode | CoralRootNode) => {
  const backgroundColor = node.styles?.['backgroundColor'] as CoralColorType
  const color = node.styles?.['color'] as CoralColorType

  const fills = clone(element.fills)

  if (backgroundColor) {
    fills[0] = figma.util.solidPaint(backgroundColor.hex, fills[0])
    element.fills = fills
  }

  if (color) {
    fills[0] = figma.util.solidPaint(color.hex, fills[0])
    element.fills = fills
  }
}

export const applyBackground = (element: Element, styles: CoralStyleType) => {
  const backgroundColor = styles['backgroundColor'] as CoralColorType
  const fills = clone(element.fills)

  if (backgroundColor) {
    fills[0] = figma.util.solidPaint(backgroundColor.hex, fills[0])
    element.fills = fills
  }
}

export const applyColor = (element: Element, styles: CoralStyleType) => {
  const color = styles['color'] as CoralColorType
  const fills = clone(element.fills)

  if (color) {
    fills[0] = figma.util.solidPaint(color.hex, fills[0])
    element.fills = fills
  }
}
