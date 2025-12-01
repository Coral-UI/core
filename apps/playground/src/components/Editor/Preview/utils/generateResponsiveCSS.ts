import type { ResponsiveStyle as CoreResponsiveStyle, CoralStyleType, Dimension, CoralColorType } from '@reallygoodwork/coral-core'
import { ElementTreeNode } from '@/hooks/useElementTree'

type ResponsiveStyle = CoreResponsiveStyle

/**
 * Check if a value is a dimension object
 */
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

/**
 * Check if a value is a Coral color object
 */
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

/**
 * Convert dimension to CSS string
 */
const dimensionToCSS = (dimension: Dimension): string => {
  if (typeof dimension === 'number') {
    return `${dimension}px`
  }
  return `${dimension.value}${dimension.unit}`
}

/**
 * Convert Coral color to CSS string
 */
const colorToCSS = (color: CoralColorType): string => {
  if ('hex' in color && typeof color.hex === 'string') {
    return color.hex
  }
  return 'transparent'
}

/**
 * Convert style value to CSS string
 */
const styleValueToCSS = (value: unknown): string => {
  if (isDimension(value)) {
    return dimensionToCSS(value)
  }
  if (isColor(value)) {
    return colorToCSS(value)
  }
  if (typeof value === 'number') {
    return `${value}px`
  }
  if (typeof value === 'string') {
    return value
  }
  return String(value)
}

/**
 * Convert Coral styles object to CSS properties string
 */
const stylesToCSSProperties = (styles: CoralStyleType): string => {
  const styleEntries = Object.entries(styles)
    .filter(([, value]) => {
      // Filter out nested objects (media queries, pseudo-selectors)
      return typeof value !== 'object' || isDimension(value) || isColor(value)
    })
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      const cssValue = styleValueToCSS(value)
      return `  ${cssKey}: ${cssValue};`
    })

  return styleEntries.join('\n')
}

/**
 * Convert breakpoint to CSS media query string
 */
const breakpointToMediaQuery = (breakpoint: ResponsiveStyle['breakpoint']): string => {
  // Simple breakpoint
  if ('type' in breakpoint && 'value' in breakpoint) {
    return `(${breakpoint.type}: ${breakpoint.value})`
  }

  // Range breakpoint
  if ('min' in breakpoint || 'max' in breakpoint) {
    const conditions: string[] = []
    if (breakpoint.min) {
      conditions.push(`(${breakpoint.min.type}: ${breakpoint.min.value})`)
    }
    if (breakpoint.max) {
      conditions.push(`(${breakpoint.max.type}: ${breakpoint.max.value})`)
    }
    return conditions.join(' and ')
  }

  return ''
}

/**
 * Generate base CSS styles (non-responsive) from element tree
 */
export function generateBaseCSS(elementTree: ElementTreeNode[]): string {
  const baseStyles: Map<string, string> = new Map()

  // Recursively collect base styles from all elements
  const collectBaseStyles = (elements: ElementTreeNode[]) => {
    for (const element of elements) {
      if (element.styles && Object.keys(element.styles).length > 0 && element.id) {
        const elementId = element.id
        const className = `.coral-element-${elementId}`
        const cssProperties = stylesToCSSProperties(element.styles as CoralStyleType)
        if (cssProperties.trim()) {
          baseStyles.set(className, cssProperties)
        }
      }

      // Process children recursively
      if (element.children && Array.isArray(element.children)) {
        collectBaseStyles(element.children as ElementTreeNode[])
      }
    }
  }

  collectBaseStyles(elementTree)

  // Generate CSS rules
  const rules: string[] = []
  for (const [className, cssProperties] of baseStyles.entries()) {
    if (cssProperties.trim()) {
      rules.push(`${className} {\n${cssProperties}\n}`)
    }
  }

  return rules.join('\n\n')
}

/**
 * Generate CSS media queries from element tree responsive styles
 */
export function generateResponsiveCSS(elementTree: ElementTreeNode[]): string {
  const mediaQueries: Map<string, Map<string, string>> = new Map()

  // Recursively collect responsive styles from all elements
  const collectResponsiveStyles = (elements: ElementTreeNode[]) => {
    for (const element of elements) {
      if (element.responsiveStyles && element.responsiveStyles.length > 0 && element.id) {
        const elementId = element.id
        const className = `.coral-element-${elementId}`

        for (const responsiveStyle of element.responsiveStyles) {
          const mediaQuery = breakpointToMediaQuery(responsiveStyle.breakpoint)
          if (!mediaQuery) continue

          if (!mediaQueries.has(mediaQuery)) {
            mediaQueries.set(mediaQuery, new Map())
          }

          const stylesMap = mediaQueries.get(mediaQuery)!
          const cssProperties = stylesToCSSProperties(responsiveStyle.styles as CoralStyleType)
          stylesMap.set(className, cssProperties)
        }
      }

      // Process children recursively
      if (element.children && Array.isArray(element.children)) {
        collectResponsiveStyles(element.children as ElementTreeNode[])
      }
    }
  }

  collectResponsiveStyles(elementTree)

  // Generate CSS from collected media queries
  const cssBlocks: string[] = []

  for (const [mediaQuery, stylesMap] of mediaQueries.entries()) {
    const rules: string[] = []
    for (const [className, cssProperties] of stylesMap.entries()) {
      if (cssProperties.trim()) {
        rules.push(`${className} {\n${cssProperties}\n}`)
      }
    }

    if (rules.length > 0) {
      cssBlocks.push(`@media ${mediaQuery} {\n${rules.join('\n\n')}\n}`)
    }
  }

  return cssBlocks.join('\n\n')
}
