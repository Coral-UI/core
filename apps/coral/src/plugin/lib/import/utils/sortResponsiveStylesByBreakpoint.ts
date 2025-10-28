import { ResponsiveStyle } from '@reallygoodwork/coral-core'

import { parseBreakpointValue } from './parseBreakpointValue'

// Sort responsive styles by breakpoint order (mobile-first: smallest to largest)
export const sortResponsiveStylesByBreakpoint = (styles: ResponsiveStyle[]): ResponsiveStyle[] => {
  return [...styles].sort((a, b) => {
    // Handle simple breakpoints
    const aBreakpoint = a.breakpoint
    const bBreakpoint = b.breakpoint

    // Get the minimum value for each breakpoint
    let aValue: number
    let bValue: number

    if ('min' in aBreakpoint && aBreakpoint.min) {
      aValue = parseBreakpointValue(aBreakpoint.min.value)
    } else if ('max' in aBreakpoint && aBreakpoint.max) {
      aValue = parseBreakpointValue(aBreakpoint.max.value)
    } else if ('type' in aBreakpoint) {
      aValue = parseBreakpointValue(aBreakpoint.value)
    } else {
      aValue = 0
    }

    if ('min' in bBreakpoint && bBreakpoint.min) {
      bValue = parseBreakpointValue(bBreakpoint.min.value)
    } else if ('max' in bBreakpoint && bBreakpoint.max) {
      bValue = parseBreakpointValue(bBreakpoint.max.value)
    } else if ('type' in bBreakpoint) {
      bValue = parseBreakpointValue(bBreakpoint.value)
    } else {
      bValue = 0
    }

    // Sort by value (smaller first for mobile-first approach)
    return aValue - bValue
  })
}
