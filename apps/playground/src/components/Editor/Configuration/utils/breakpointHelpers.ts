import { Breakpoint } from '@/components/Editor/BreakpointManager/BreakpointManager'
import { ResponsiveStyle } from '@/hooks/useElementTree'

/**
 * Parses a breakpoint ID to extract the index
 * @example parseBreakpointIndex('breakpoint_2') // returns 2
 */
export const parseBreakpointIndex = (breakpointId: string): number => {
  return parseInt(breakpointId.replace('breakpoint_', ''), 10)
}

/**
 * Extracts numeric pixel width from a breakpoint value string
 * Supports px, rem, and em units (converts rem/em to px using 16px base)
 * @example extractBreakpointWidth({ value: '768px' }) // returns 768
 * @example extractBreakpointWidth({ value: '50rem' }) // returns 800
 * @example extractBreakpointWidth({ value: '1024px' }) // returns 1024
 * @returns Numeric pixel value or null if value cannot be parsed
 */
export const extractBreakpointWidth = (breakpoint: Breakpoint | null): number | null => {
  if (!breakpoint) return null

  const value = breakpoint.value.trim()
  if (!value) return null

  // Extract number and unit
  const match = value.match(/^([\d.]+)(px|rem|em)$/i)
  if (!match) return null

  const numericValue = parseFloat(match[1])
  const unit = match[2].toLowerCase()

  if (isNaN(numericValue)) return null

  // Convert to pixels
  if (unit === 'px') {
    return Math.round(numericValue)
  } else if (unit === 'rem' || unit === 'em') {
    // Standard conversion: 1rem = 16px (browser default)
    return Math.round(numericValue * 16)
  }

  return null
}

/**
 * Creates a breakpoint ID from an index
 * @example createBreakpointId(2) // returns 'breakpoint_2'
 */
export const createBreakpointId = (index: number): string => {
  return `breakpoint_${index}`
}

/**
 * Transforms ResponsiveStyle array to Breakpoint array for UI display
 * Uses index-based IDs since core schema doesn't have ID field
 */
export const transformResponsiveStylesToBreakpoints = (
  responsiveStyles: ResponsiveStyle[] | undefined,
): Breakpoint[] => {
  if (!responsiveStyles) return []

  return responsiveStyles.map((rs, index) => {
    // Handle both old flat structure and new nested breakpoint structure
    const breakpointData = 'breakpoint' in rs ? rs.breakpoint : rs
    const type = 'type' in breakpointData ? breakpointData.type : 'min-width'
    const value = 'value' in breakpointData ? breakpointData.value : '768px'

    return {
      id: createBreakpointId(index),
      type: type as 'min-width' | 'max-width' | 'min-height' | 'max-height',
      value: value as string,
      label: rs.label ?? undefined,
    }
  })
}

/**
 * Finds a breakpoint that matches the given viewport width
 * Matches based on the breakpoint's width value (for min-width/max-width breakpoints)
 * Returns the breakpoint ID if found, null otherwise
 */
export const findMatchingBreakpoint = (
  breakpoints: Breakpoint[],
  viewportWidth: number,
): string | null => {
  // Find breakpoints that match the viewport width
  // For min-width: viewport should be >= breakpoint width
  // For max-width: viewport should be <= breakpoint width
  const matchingBreakpoints = breakpoints.filter((bp) => {
    const bpWidth = extractBreakpointWidth(bp)
    if (bpWidth === null) return false

    if (bp.type === 'min-width') {
      return viewportWidth >= bpWidth
    } else if (bp.type === 'max-width') {
      return viewportWidth <= bpWidth
    }
    // For height-based breakpoints, don't match based on width
    return false
  })

  if (matchingBreakpoints.length === 0) {
    return null
  }

  // If multiple breakpoints match, prefer the most specific one
  // For min-width: prefer the largest value
  // For max-width: prefer the smallest value
  const sorted = matchingBreakpoints.sort((a, b) => {
    const aWidth = extractBreakpointWidth(a) ?? 0
    const bWidth = extractBreakpointWidth(b) ?? 0

    if (a.type === 'min-width' && b.type === 'min-width') {
      return bWidth - aWidth // Descending: prefer larger min-width
    } else if (a.type === 'max-width' && b.type === 'max-width') {
      return aWidth - bWidth // Ascending: prefer smaller max-width
    } else if (a.type === 'min-width' && b.type === 'max-width') {
      // Prefer min-width if viewport is >= both thresholds
      return -1
    } else {
      return 1
    }
  })

  return sorted[0].id
}
