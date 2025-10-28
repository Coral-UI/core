import { ResponsiveStyle } from '@reallygoodwork/coral-core'

/**
 * Parse breakpoint string into ResponsiveStyle breakpoint format
 * Examples: "min-width:640px", "max-width:1024px", "base"
 */
export const parseBreakpoint = (breakpointStr: string): ResponsiveStyle['breakpoint'] | null => {
  if (breakpointStr === 'base') {
    return null // base doesn't need a breakpoint
  }

  const parts = breakpointStr.split(':')
  if (parts.length !== 2) {
    console.warn(`Invalid breakpoint format: ${breakpointStr}. Expected format: "type:value" (e.g., "min-width:640px")`)
    return null
  }

  const [type, value] = parts

  if (!value) {
    console.warn(`Invalid breakpoint format: ${breakpointStr}. Value is required.`)
    return null
  }

  if (type === 'min-width' || type === 'max-width' || type === 'min-height' || type === 'max-height') {
    return {
      type,
      value,
    }
  }

  console.warn(`Invalid breakpoint type: ${type}. Must be one of: min-width, max-width, min-height, max-height`)
  return null
}
