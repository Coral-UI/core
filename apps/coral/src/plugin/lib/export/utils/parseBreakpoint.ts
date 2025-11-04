import { ResponsiveStyle } from '@reallygoodwork/coral-core'

/**
 * Parse breakpoint string into ResponsiveStyle breakpoint format
 * Examples: "min-width:640px", "min-width-640px", "max-width-1024px", "base"
 * Supports both colon and hyphen separators
 */
export const parseBreakpoint = (breakpointStr: string): ResponsiveStyle['breakpoint'] | null => {
  if (breakpointStr === 'base') {
    return null // base doesn't need a breakpoint
  }

  // Try colon format first (e.g., "min-width:640px")
  let parts = breakpointStr.split(':')
  let type: string | undefined
  let value: string | undefined

  if (parts.length === 2) {
    // Colon format
    ;[type, value] = parts
  } else {
    // Try hyphen format (e.g., "min-width-640px")
    // Match patterns like "min-width-640px", "max-width-1024px"
    const hyphenMatch = breakpointStr.match(/^(min-width|max-width|min-height|max-height)-(.+)$/)
    if (hyphenMatch) {
      type = hyphenMatch[1]
      value = hyphenMatch[2]
    } else {
      console.warn(
        `Invalid breakpoint format: ${breakpointStr}. Expected format: "type:value" or "type-value" (e.g., "min-width:640px" or "min-width-640px")`,
      )
      return null
    }
  }

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
