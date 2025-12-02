import type {
  CoralColorType,
  CoralGradientType,
  CoralNode,
  CoralRootNode,
  CoralStyleType,
  Dimension,
  ResponsiveStyle,
} from '@reallygoodwork/coral-core'

/**
 * Check if a value is a dimension object
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
 * Check if a value is a Coral color object
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
 * Check if a value is a Coral gradient object
 */
function isGradient(value: unknown): value is CoralGradientType {
  return typeof value === 'object' && value !== null && 'type' in value && 'colors' in value && 'angle' in value
}

/**
 * Convert dimension to CSS string
 */
function dimensionToCSS(dimension: Dimension): string {
  if (typeof dimension === 'number') {
    return `${dimension}px`
  }
  return `${dimension.value}${dimension.unit}`
}

/**
 * Convert Coral color to CSS string
 */
function colorToCSS(color: CoralColorType): string {
  if ('hex' in color && typeof color.hex === 'string') {
    return color.hex
  }
  return 'transparent'
}

/**
 * Convert gradient to CSS string
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
 * Convert style value to CSS string
 */
function styleValueToCSS(key: string, value: unknown): string {
  if (isDimension(value)) {
    return dimensionToCSS(value)
  }
  if (isColor(value)) {
    return colorToCSS(value)
  }
  if (isGradient(value)) {
    return gradientToCSS(value)
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
function stylesToCSSProperties(styles: CoralStyleType): string {
  const styleEntries = Object.entries(styles)
    .filter(([, value]) => {
      // Filter out nested objects (media queries, pseudo-selectors)
      return typeof value !== 'object' || isDimension(value) || isColor(value) || isGradient(value)
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
function breakpointToMediaQuery(breakpoint: ResponsiveStyle['breakpoint']): string {
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
 * Generate unique ID for a node based on its path in the tree
 */
function generateNodeId(node: CoralNode, parentPath: string = '', index: number = 0): string {
  const nodeName = node.name || node.elementType
  const currentPath = parentPath ? `${parentPath}-${index}` : 'root'
  return `coral-${currentPath}-${nodeName}`
}

/**
 * Generate base CSS styles from Coral spec
 */
function generateBaseCSS(node: CoralNode, idMapping: Map<CoralNode, string>): string {
  const baseStyles: Map<string, string> = new Map()

  const collectBaseStyles = (n: CoralNode, parentPath: string = '', index: number = 0) => {
    const nodeId = idMapping.get(n) || generateNodeId(n, parentPath, index)
    idMapping.set(n, nodeId)

    if (n.styles && Object.keys(n.styles).length > 0) {
      const className = `.${nodeId}`
      const cssProperties = stylesToCSSProperties(n.styles)
      if (cssProperties.trim()) {
        baseStyles.set(className, cssProperties)
      }
    }

    if (n.children && Array.isArray(n.children)) {
      n.children.forEach((child, idx) => {
        collectBaseStyles(child as CoralNode, nodeId, idx)
      })
    }
  }

  collectBaseStyles(node)
  idMapping.set(node, idMapping.get(node) || 'coral-root')

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
function extractBreakpointValueForSorting(breakpoint: ResponsiveStyle['breakpoint']): number {
  if ('value' in breakpoint && typeof breakpoint.value === 'string') {
    const match = breakpoint.value.match(/^([\d.]+)(px|rem|em)$/i)
    if (match) {
      const num = parseFloat(match[1])
      const unit = match[2].toLowerCase()
      return unit === 'px' ? num : num * 16 // Convert rem/em to px
    }
  }
  if ('min' in breakpoint && breakpoint.min) {
    return extractBreakpointValueForSorting(breakpoint.min as ResponsiveStyle['breakpoint'])
  }
  return 0
}

/**
 * Generate responsive CSS with media queries from Coral spec
 * Implements CSS cascade: each breakpoint includes base + all previous breakpoints
 */
function generateResponsiveCSS(node: CoralNode, idMapping: Map<CoralNode, string>): string {
  const mediaQueries: Map<string, Map<string, string>> = new Map()

  const collectResponsiveStyles = (n: CoralNode) => {
    // Check if node has responsiveStyles (from ElementTreeNode)
    // For CoralRootNode, we need to check if responsiveStyles exist
    const responsiveStyles = (n as unknown as { responsiveStyles?: ResponsiveStyle[] }).responsiveStyles

    if (responsiveStyles && responsiveStyles.length > 0) {
      const nodeId = idMapping.get(n)
      if (!nodeId) return

      const className = `.${nodeId}`

      // Sort responsive styles by breakpoint value (mobile-first)
      const sortedStyles = [...responsiveStyles].sort((a, b) => {
        return extractBreakpointValueForSorting(a.breakpoint) - extractBreakpointValueForSorting(b.breakpoint)
      })

      // Track accumulated styles as we process breakpoints (CSS cascade)
      let accumulatedStyles: CoralStyleType = { ...(n.styles || {}) }

      for (const responsiveStyle of sortedStyles) {
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

    if (n.children && Array.isArray(n.children)) {
      n.children.forEach((child) => {
        collectResponsiveStyles(child as CoralNode)
      })
    }
  }

  collectResponsiveStyles(node)

  const cssBlocks: string[] = []

  for (const [mediaQuery, stylesMap] of mediaQueries.entries()) {
    const rules: string[] = []
    for (const [className, cssProperties] of stylesMap.entries()) {
      if (cssProperties.trim()) {
        rules.push(`${className} {\n${cssProperties}\n}`)
      }
    }

    if (rules.length > 0) {
      cssBlocks.push(`@media ${mediaQuery} {\n${rules.map((r) => `  ${r.split('\n').join('\n  ')}`).join('\n\n')}\n}`)
    }
  }

  return cssBlocks.join('\n\n')
}

/**
 * Generate complete CSS file from Coral spec
 * @param spec - Coral root node specification
 * @param idMapping - Map of nodes to their generated IDs (will be populated)
 * @returns CSS string
 */
export function generateCSS(spec: CoralRootNode, idMapping: Map<CoralNode, string>): string {
  const baseCSS = generateBaseCSS(spec, idMapping)
  const responsiveCSS = generateResponsiveCSS(spec, idMapping)

  const parts: string[] = []
  if (baseCSS) {
    parts.push('/* Base Styles */')
    parts.push(baseCSS)
  }
  if (responsiveCSS) {
    if (parts.length > 0) parts.push('')
    parts.push('/* Responsive Styles */')
    parts.push(responsiveCSS)
  }

  return parts.join('\n\n')
}
