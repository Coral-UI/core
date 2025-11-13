/**
 * Converts a CSS style attribute string to an object.
 * Converts kebab-case CSS property names to camelCase for JavaScript compatibility.
 *
 * @param {string} style - The CSS style attribute string.
 * @returns {Record<string, string>} An object with CSS properties as keys and values.
 */
export const styleAttributeToObject = (style?: string): Record<string, string> => {
  return (
    style?.split(';').reduce<Record<string, string>>((acc, style) => {
      const [key, value] = style.split(':')
      if (key && value) {
        // Convert kebab-case to camelCase (e.g., "border-radius" -> "borderRadius")
        const camelKey = key.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        acc[camelKey] = value.trim()
      }
      return acc
    }, {}) || {}
  )
}
