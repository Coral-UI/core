import type { CoralColorType, CoralGradientType, CoralStyleType, Dimension } from '@reallygoodwork/coral-core'

/**
 * Checks if a value is a dimension object
 */
function isDimension(value: unknown): value is Dimension {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'unit' in value &&
    typeof (value as { value: unknown }).value === 'number' &&
    typeof (value as { unit: unknown }).unit === 'string'
  )
}

/**
 * Checks if a value is a Coral color object
 */
function isColor(value: unknown): value is CoralColorType {
  return (
    typeof value === 'object' &&
    value !== null &&
    'hex' in value &&
    'rgb' in value &&
    'hsl' in value &&
    typeof (value as { hex: unknown }).hex === 'string'
  )
}

/**
 * Checks if a value is a Coral gradient object
 */
function isGradient(value: unknown): value is CoralGradientType {
  return typeof value === 'object' && value !== null && 'type' in value && 'colors' in value && 'angle' in value
}

/**
 * Converts a dimension to CSS string
 */
function dimensionToCSS(dimension: Dimension): string {
  if (typeof dimension === 'number') {
    return `${dimension}px`
  }
  return `${dimension.value}${dimension.unit}`
}

/**
 * Converts a Coral color object to CSS string
 */
function colorToCSS(color: CoralColorType): string {
  if ('hex' in color && typeof color.hex === 'string') {
    return color.hex
  }
  return 'transparent'
}

/**
 * Converts a Coral gradient object to CSS string
 */
function gradientToCSS(gradient: CoralGradientType): string {
  const type = gradient.type.toLowerCase()
  const angle = gradient.angle
  const colorStops = gradient.colors
    .map((stop) => {
      const color = colorToCSS(stop.color)
      return `${color} ${stop.position}%`
    })
    .join(', ')

  if (type === 'linear') {
    return `linear-gradient(${angle}deg, ${colorStops})`
  }
  return `radial-gradient(${colorStops})`
}

/**
 * Converts style value to React inline style value
 */
function styleValueToReact(value: unknown): string {
  if (isDimension(value)) {
    return `'${dimensionToCSS(value)}'`
  }
  if (isColor(value)) {
    return `'${colorToCSS(value)}'`
  }
  if (isGradient(value)) {
    return `'${gradientToCSS(value)}'`
  }
  if (typeof value === 'number') {
    return `${value}`
  }
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "\\'")}'`
  }
  return `'${String(value)}'`
}

// Note: React inline styles use camelCase, not kebab-case
// So we keep the property names as-is

/**
 * Converts Coral style object to React inline style object string
 * @param styles - Coral style object
 * @returns React inline style object string (e.g., "{{ color: 'red', padding: '10px' }}")
 */
export function stylesToInlineStyle(styles?: CoralStyleType): string {
  if (!styles || Object.keys(styles).length === 0) {
    return ''
  }

  const styleEntries: string[] = []

  for (const [key, value] of Object.entries(styles)) {
    // Skip nested objects (media queries, pseudo-selectors) for now
    if (typeof value === 'object' && value !== null && !isDimension(value) && !isColor(value) && !isGradient(value)) {
      // Check if it's a nested style object (not a dimension, color, or gradient)
      const hasNestedObjects = Object.values(value).some(
        (v) => typeof v === 'object' && v !== null && !isDimension(v) && !isColor(v) && !isGradient(v),
      )
      if (hasNestedObjects) {
        continue // Skip responsive styles for now
      }
    }

    // React inline styles use camelCase property names
    const cssValue = styleValueToReact(value)
    styleEntries.push(`    ${key}: ${cssValue}`)
  }

  if (styleEntries.length === 0) {
    return ''
  }

  return `{\n${styleEntries.join(',\n')}\n  }`
}
