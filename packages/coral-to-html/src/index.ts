import * as parserHtml from 'prettier/parser-html'
import * as prettier from 'prettier/standalone'

import type { CoralColorType, CoralNode, CoralRootNode, CoralStyleType, Dimension } from '@reallygoodwork/coral-core'

// List of self-closing HTML elements
const selfClosingTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]

// Helper function to check if a value is a dimension object
const isDimension = (value: unknown): value is Dimension => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'unit' in value &&
    typeof (value as Record<string, unknown>).value === 'number' &&
    typeof (value as Record<string, unknown>).unit === 'string'
  )
}

// Helper function to check if a value is a Coral color object
// Coral colors have hex, rgb, and hsl properties
const isColor = (value: unknown): value is CoralColorType => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'hex' in value &&
    'rgb' in value &&
    'hsl' in value &&
    typeof (value as Record<string, unknown>).hex === 'string'
  )
}

// Helper function to convert a dimension to CSS string
const dimensionToCSS = (dimension: Dimension): string => {
  if (typeof dimension === 'number') {
    return `${dimension}px`
  }
  return `${dimension.value}${dimension.unit}`
}

// Helper function to convert a Coral color object to CSS string
const colorToCSS = (color: CoralColorType): string => {
  // Coral colors have a hex property that we can use directly
  if ('hex' in color && typeof color.hex === 'string') {
    return color.hex
  }
  return 'transparent'
}

// Helper function to convert style values to CSS strings
const styleValueToCSS = (key: string, value: unknown): string => {
  if (isDimension(value)) {
    return dimensionToCSS(value)
  }
  if (isColor(value)) {
    return colorToCSS(value)
  }
  if (typeof value === 'number') {
    // Font weight should be unitless (no px)
    if (key === 'fontWeight') {
      return String(value)
    }
    // Other numeric values default to px
    return `${value}px`
  }
  if (typeof value === 'string') {
    // Add sans-serif fallback when font family contains "inter" (case-insensitive)
    if (key === 'fontFamily' && /inter/i.test(value)) {
      // Check if sans-serif is already in the font stack
      if (!/sans-serif/i.test(value)) {
        return `${value}, sans-serif`
      }
    }
    return value
  }
  return String(value)
}

// Helper function to convert styles object to inline style string
const formatStyles = (styles: CoralStyleType): string => {
  const styleEntries = Object.entries(styles)
    .filter(([, value]) => {
      // Filter out nested objects (media queries, pseudo-selectors)
      return typeof value !== 'object' || isDimension(value) || isColor(value)
    })
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      const cssValue = styleValueToCSS(key, value)
      return `${cssKey}: ${cssValue}`
    })

  return styleEntries.join('; ')
}

// Helper function to convert elementAttributes object to HTML attribute string
const formatAttributes = (attributes: Record<string, string | number | boolean | string[]>): string => {
  return Object.entries(attributes)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}="${value.join(' ')}"`
      }
      if (typeof value === 'boolean') {
        return value ? key : ''
      }
      return `${key}="${value}"`
    })
    .filter(Boolean)
    .join(' ')
}

const nodeToHTML = (node: CoralNode): string => {
  const attributes = node.elementAttributes ? ` ${formatAttributes(node.elementAttributes)}` : ''
  const styleAttr = node.styles ? ` style="${formatStyles(node.styles)}"` : ''
  const allAttributes = `${attributes}${styleAttr}`.trim()
  const attributesStr = allAttributes ? ` ${allAttributes}` : ''
  const children = node.children ? (node.children as CoralNode[]).map(nodeToHTML).join('') : ''

  // Check if the element is self-closing
  if (selfClosingTags.includes(node.elementType)) {
    return `<${node.elementType}${attributesStr} />`
  }

  if (node.textContent) {
    return `<${node.elementType}${attributesStr}>${node.textContent}${children}</${node.elementType}>`
  }

  return `<${node.elementType}${attributesStr}>${children}</${node.elementType}>`
}

export const coralToHTML = async (coralSpec: CoralRootNode): Promise<string> => {
  const node = nodeToHTML(coralSpec)

  return prettier.format(node, {
    parser: 'html',
    plugins: [parserHtml],
  })
}
