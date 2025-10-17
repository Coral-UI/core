import type { BreakpointType, RangeBreakpoint, ResponsiveStyle, SimpleBreakpoint } from '../structures/responsiveStyles'

/**
 * Parses a CSS media query string and extracts breakpoint information
 * Supports: min-width, max-width, min-height, max-height, and range queries
 *
 * Examples:
 * - "@media (min-width: 768px)" -> Simple breakpoint
 * - "@media (min-width: 768px) and (max-width: 1024px)" -> Range breakpoint
 * - "@media screen and (min-width: 768px)" -> Simple breakpoint (ignores media type)
 */
export function parseMediaQuery(
  mediaQueryString: string,
): { type: BreakpointType; value: string } | RangeBreakpoint | null {
  // Remove @media and normalize whitespace
  const normalized = mediaQueryString
    .replace(/@media\s+/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  // Remove media types like 'screen and', 'print and', etc.
  const withoutMediaType = normalized.replace(/^(screen|print|all|speech)\s+and\s+/i, '')

  // Extract all conditions in parentheses
  const conditionRegex = /\((min-width|max-width|min-height|max-height)\s*:\s*([^)]+)\)/gi
  const matches = [...withoutMediaType.matchAll(conditionRegex)]

  if (matches.length === 0) {
    return null
  }

  if (matches.length === 1) {
    // Simple breakpoint
    const match = matches[0]
    if (!match) return null

    const type = match[1]
    const value = match[2]

    if (!type || !value) return null

    return {
      type: type as BreakpointType,
      value: value.trim(),
    }
  }

  // Range breakpoint - extract min and max
  const rangeBreakpoint: RangeBreakpoint = {}

  for (const match of matches) {
    const type = match[1]
    const value = match[2]

    if (!type || !value) continue

    const cleanType = type.toLowerCase() as BreakpointType

    if (cleanType === 'min-width' || cleanType === 'min-height') {
      rangeBreakpoint.min = {
        type: cleanType,
        value: value.trim(),
      }
    } else if (cleanType === 'max-width' || cleanType === 'max-height') {
      rangeBreakpoint.max = {
        type: cleanType,
        value: value.trim(),
      }
    }
  }

  return rangeBreakpoint
}

/**
 * Extracts media queries and their associated styles from a CSS string
 * Returns an array of media query definitions with their styles
 */
export function extractMediaQueriesFromCSS(
  cssString: string,
  selector?: string,
): Array<{ mediaQuery: string; styles: Record<string, string> }> {
  const mediaQueries: Array<{ mediaQuery: string; styles: Record<string, string> }> = []

  // Match @media blocks
  const mediaQueryRegex = /@media\s+([^{]+)\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/gi
  const matches = [...cssString.matchAll(mediaQueryRegex)]

  for (const match of matches) {
    const mediaQueryPart = match[1]
    const content = match[2]

    if (!mediaQueryPart || !content) continue

    const mediaQuery = `@media ${mediaQueryPart.trim()}`

    // If a selector is provided, only extract styles for that selector
    if (selector) {
      const selectorRegex = new RegExp(`${escapeRegex(selector)}\\s*\\{([^}]+)\\}`, 'i')
      const selectorMatch = content.match(selectorRegex)

      if (selectorMatch && selectorMatch[1]) {
        const styles = parseStyleString(selectorMatch[1])
        mediaQueries.push({ mediaQuery, styles })
      }
    } else {
      // Extract all rules in the media query
      const rulesRegex = /([^{]+)\{([^}]+)\}/g
      const rules = [...content.matchAll(rulesRegex)]

      for (const rule of rules) {
        const ruleSelector = rule[1]
        const ruleStyles = rule[2]

        if (!ruleSelector || !ruleStyles) continue

        const styles = parseStyleString(ruleStyles)
        mediaQueries.push({
          mediaQuery: `${mediaQuery} [${ruleSelector.trim()}]`,
          styles,
        })
      }
    }
  }

  return mediaQueries
}

/**
 * Parse a CSS style string into an object
 */
function parseStyleString(styleString: string): Record<string, string> {
  const styles: Record<string, string> = {}

  styleString.split(';').forEach((declaration) => {
    const [prop, value] = declaration.split(':').map((s) => s.trim())
    if (prop && value) {
      // Convert kebab-case to camelCase for JS compatibility
      const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      styles[camelProp] = value
    }
  })

  return styles
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Converts parsed media queries to Coral ResponsiveStyle format
 */
export function mediaQueriesToResponsiveStyles(
  mediaQueries: Array<{ mediaQuery: string; styles: Record<string, string> }>,
): ResponsiveStyle[] {
  const responsiveStyles: ResponsiveStyle[] = []

  for (const { mediaQuery, styles } of mediaQueries) {
    const breakpoint = parseMediaQuery(mediaQuery)

    if (!breakpoint) {
      continue
    }

    // Create a simple or range breakpoint structure
    let breakpointObj: SimpleBreakpoint | RangeBreakpoint

    if ('type' in breakpoint) {
      // Simple breakpoint
      breakpointObj = {
        type: breakpoint.type,
        value: breakpoint.value,
      }
    } else {
      // Range breakpoint
      breakpointObj = breakpoint
    }

    responsiveStyles.push({
      breakpoint: breakpointObj,
      styles,
    })
  }

  return responsiveStyles
}

/**
 * Extracts responsive styles from an object with media query keys
 * Example: { "@media (min-width: 768px)": { padding: "20px" } }
 * Also supports: { "(min-width: 768px)": { padding: "20px" } } (Tailwind format)
 */
export function extractResponsiveStylesFromObject(stylesObject: Record<string, any>): {
  baseStyles: Record<string, any>
  responsiveStyles: ResponsiveStyle[]
} {
  const baseStyles: Record<string, any> = {}
  const mediaQueriesArray: Array<{ mediaQuery: string; styles: Record<string, string> }> = []

  for (const [key, value] of Object.entries(stylesObject)) {
    // Check if this is a media query key
    // Supports both "@media (min-width: 768px)" and "(min-width: 768px)" formats (Tailwind)
    const isMediaQuery =
      key.startsWith('@media') || (key.startsWith('(') && (key.includes('width') || key.includes('height')))

    if (isMediaQuery) {
      // Normalize to @media format if it's not already
      const mediaQuery = key.startsWith('@media') ? key : `@media ${key}`

      mediaQueriesArray.push({
        mediaQuery,
        styles: value,
      })
    } else {
      // Regular style
      baseStyles[key] = value
    }
  }

  const responsiveStyles = mediaQueriesToResponsiveStyles(mediaQueriesArray)

  return {
    baseStyles,
    responsiveStyles,
  }
}
