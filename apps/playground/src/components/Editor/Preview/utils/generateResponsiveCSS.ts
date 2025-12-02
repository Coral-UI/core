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
      const cssValue = styleValueToCSS(key, value)
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
 * Extract numeric value from breakpoint for sorting
 */
function extractBreakpointValue(breakpoint: ResponsiveStyle['breakpoint']): number {
  if ('value' in breakpoint && typeof breakpoint.value === 'string') {
    const match = breakpoint.value.match(/^([\d.]+)(px|rem|em)$/i)
    if (match) {
      const num = parseFloat(match[1])
      const unit = match[2].toLowerCase()
      return unit === 'px' ? num : num * 16 // Convert rem/em to px
    }
  }
  if ('min' in breakpoint && breakpoint.min) {
    return extractBreakpointValue(breakpoint.min as ResponsiveStyle['breakpoint'])
  }
  return 0
}

/**
 * Get accumulated styles (base + all breakpoints up to a given index)
 * Implements CSS-like inheritance
 */
function getAccumulatedStylesForElement(
  baseStyles: CoralStyleType | undefined,
  responsiveStyles: ResponsiveStyle[] | undefined,
  upToIndex: number | null = null,
): CoralStyleType {
  let accumulated: CoralStyleType = { ...(baseStyles || {}) }

  if (!responsiveStyles || responsiveStyles.length === 0) {
    return accumulated
  }

  // Sort responsive styles by breakpoint value (mobile-first)
  const sortedStyles = [...responsiveStyles].sort((a, b) => {
    return extractBreakpointValue(a.breakpoint) - extractBreakpointValue(b.breakpoint)
  })

  // Apply styles up to the specified index (or all if null)
  const endIndex = upToIndex !== null ? upToIndex + 1 : sortedStyles.length

  for (let i = 0; i < endIndex && i < sortedStyles.length; i++) {
    const responsiveStyle = sortedStyles[i]
    if (responsiveStyle.styles) {
      // Merge differences into accumulated styles (CSS cascade)
      accumulated = { ...accumulated, ...responsiveStyle.styles }
    }
  }

  return accumulated
}

/**
 * Generate CSS media queries from element tree responsive styles
 * Implements CSS cascade: each breakpoint includes base + all previous breakpoints
 */
export function generateResponsiveCSS(elementTree: ElementTreeNode[]): string {
  const mediaQueries: Map<string, Map<string, string>> = new Map()

  // Recursively collect responsive styles from all elements
  const collectResponsiveStyles = (elements: ElementTreeNode[]) => {
    for (const element of elements) {
      if (element.responsiveStyles && element.responsiveStyles.length > 0 && element.id) {
        const elementId = element.id
        const className = `.coral-element-${elementId}`

        // Sort responsive styles by breakpoint value
        const sortedStyles = [...element.responsiveStyles].sort((a, b) => {
          return extractBreakpointValue(a.breakpoint) - extractBreakpointValue(b.breakpoint)
        })

        // Track accumulated styles as we process breakpoints
        let accumulatedStyles: CoralStyleType = { ...(element.styles || {}) }

        for (let i = 0; i < sortedStyles.length; i++) {
          const responsiveStyle = sortedStyles[i]
          const mediaQuery = breakpointToMediaQuery(responsiveStyle.breakpoint)
          if (!mediaQuery) continue

          // Merge this breakpoint's differences into accumulated styles
          accumulatedStyles = { ...accumulatedStyles, ...(responsiveStyle.styles || {}) }

          if (!mediaQueries.has(mediaQuery)) {
            mediaQueries.set(mediaQuery, new Map())
          }

          const stylesMap = mediaQueries.get(mediaQuery)!
          // Use accumulated styles (base + all breakpoints up to this one)
          const cssProperties = stylesToCSSProperties(accumulatedStyles)
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
