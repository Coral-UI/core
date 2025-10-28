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
