import type { CoralStyleType, ResponsiveStyle } from '@reallygoodwork/coral-core'
import { ElementTreeNode } from '@/hooks/useElementTree'

/**
 * Deep comparison of style values
 * Handles objects, arrays, and primitives
 */
function styleValuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a === null || b === null) return a === b
  if (a === undefined || b === undefined) return a === b

  // For objects, do deep comparison
  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b)
  }

  return false
}

/**
 * Get only the style properties that differ between two style objects
 * Returns an object with only the changed/new properties, or null if no differences
 */
export function getStyleDifferences(
  baseStyles: CoralStyleType | undefined,
  variantStyles: CoralStyleType | undefined,
): CoralStyleType | null {
  if (!variantStyles || Object.keys(variantStyles).length === 0) return null
  if (!baseStyles || Object.keys(baseStyles).length === 0) return variantStyles || null

  const differences: CoralStyleType = {}
  let hasDifferences = false

  // Check all properties in variant styles
  for (const [key, value] of Object.entries(variantStyles)) {
    const baseValue = baseStyles[key]
    // If the property doesn't exist in base or has a different value, include it
    if (!(key in baseStyles) || !styleValuesEqual(baseValue, value)) {
      differences[key] = value
      hasDifferences = true
    }
  }

  // Also check if any base properties were removed (set to undefined/null in variant)
  // This handles the case where a property exists in base but not in variant
  // We don't need to track removals explicitly since CSS inheritance handles it

  return hasDifferences ? differences : null
}

/**
 * Merge styles from base and responsive styles up to a given breakpoint index
 * Returns the accumulated styles that would apply at that breakpoint
 */
export function getAccumulatedStyles(
  baseStyles: CoralStyleType | undefined,
  responsiveStyles: ResponsiveStyle[] | undefined,
  upToBreakpointIndex: number | null = null,
): CoralStyleType {
  let accumulated: CoralStyleType = { ...(baseStyles || {}) }

  if (!responsiveStyles || responsiveStyles.length === 0) {
    return accumulated
  }

  // Sort responsive styles by breakpoint (mobile-first: smallest to largest)
  const sortedStyles = [...responsiveStyles].sort((a, b) => {
    const aValue = extractBreakpointValue(a.breakpoint)
    const bValue = extractBreakpointValue(b.breakpoint)
    return aValue - bValue
  })

  // Apply styles up to the specified breakpoint index (or all if null)
  const endIndex = upToBreakpointIndex !== null ? upToBreakpointIndex + 1 : sortedStyles.length

  for (let i = 0; i < endIndex && i < sortedStyles.length; i++) {
    const responsiveStyle = sortedStyles[i]
    if (responsiveStyle.styles) {
      accumulated = { ...accumulated, ...responsiveStyle.styles }
    }
  }

  return accumulated
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
 * Compute style differences for a breakpoint, considering base styles and all previous breakpoints
 * This implements CSS-like inheritance where breakpoints only store what's different
 */
export function computeBreakpointStyleDifferences(
  element: ElementTreeNode,
  breakpointIndex: number,
  newStyles: CoralStyleType,
): CoralStyleType {
  // Get accumulated styles from base + all previous breakpoints
  const accumulatedStyles = getAccumulatedStyles(element.styles, element.responsiveStyles, breakpointIndex - 1)

  // Compute differences between accumulated styles and new styles
  const differences = getStyleDifferences(accumulatedStyles, newStyles)

  // If no differences, return empty object (breakpoint shouldn't have this style)
  return differences || {}
}

/**
 * Get the full computed styles for a breakpoint (base + all applicable breakpoints)
 */
export function getComputedStylesForBreakpoint(
  element: ElementTreeNode,
  breakpointIndex: number | null,
): CoralStyleType {
  return getAccumulatedStyles(element.styles, element.responsiveStyles, breakpointIndex)
}

/**
 * Normalize responsive styles to remove duplicates
 * Removes properties from breakpoints that match the accumulated styles from base + previous breakpoints
 * Keeps breakpoints even if they have no differences (they may be placeholders for future edits)
 */
export function normalizeResponsiveStyles(
  baseStyles: CoralStyleType | undefined,
  responsiveStyles: ResponsiveStyle[] | undefined,
): ResponsiveStyle[] {
  if (!responsiveStyles || responsiveStyles.length === 0) {
    return []
  }

  // Sort by breakpoint value
  const sortedStyles = [...responsiveStyles].sort((a, b) => {
    const aValue = extractBreakpointValue(a.breakpoint)
    const bValue = extractBreakpointValue(b.breakpoint)
    return aValue - bValue
  })

  const normalized: ResponsiveStyle[] = []
  let accumulated: CoralStyleType = { ...(baseStyles || {}) }

  for (const responsiveStyle of sortedStyles) {
    const fullStyles = { ...accumulated, ...(responsiveStyle.styles || {}) }
    const differences = getStyleDifferences(accumulated, fullStyles)

    // Always keep the breakpoint, but normalize its styles to only include differences
    // If differences is null, use empty object (breakpoint exists but has no style changes)
    normalized.push({
      ...responsiveStyle,
      styles: differences || {},
    })

    // Update accumulated styles for next iteration
    accumulated = fullStyles
  }

  return normalized
}
