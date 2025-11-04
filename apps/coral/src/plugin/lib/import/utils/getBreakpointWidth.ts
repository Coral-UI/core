import { ResponsiveStyle } from '@reallygoodwork/coral-core'

/**
 * Extract minimum width from breakpoint (mobile-first approach)
 * @param breakpoint - Responsive breakpoint
 * @returns Minimum width in pixels, defaults to 480 (mobile)
 */
export function getBreakpointWidth(breakpoint: ResponsiveStyle['breakpoint']): number {
  // For simple breakpoints like { type: 'min-width', value: '768px' }
  if ('type' in breakpoint && breakpoint.type === 'min-width' && breakpoint.value) {
    const value = breakpoint.value.toString().replace('px', '')
    return parseInt(value, 10)
  }

  // For range breakpoints, use the min value
  if ('min' in breakpoint && breakpoint.min) {
    const value = breakpoint.min.value.toString().replace('px', '')
    return parseInt(value, 10)
  }

  return 480 // Default mobile width
}
