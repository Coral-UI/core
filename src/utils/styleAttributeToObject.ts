/**
 * Converts a CSS style attribute string to an object.
 *
 * @param {string} style - The CSS style attribute string.
 * @returns {Record<string, string>} An object with CSS properties as keys and values.
 */
export const styleAttributeToObject = (style?: string): Record<string, string> => {
  return (
    style?.split(';').reduce<Record<string, string>>((acc, style) => {
      const [key, value] = style.split(':')
      if (key && value) {
        acc[key.trim()] = value.trim()
      }
      return acc
    }, {}) || {}
  )
}
