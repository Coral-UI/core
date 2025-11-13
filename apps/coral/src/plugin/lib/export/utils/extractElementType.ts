/**
 * Extract element type from node name if it contains angle brackets
 * Examples:
 * - "Title <h2>" -> "h2"
 * - "Heading <h1>" -> "h1"
 * - "Button" -> null (no angle brackets)
 */
export const extractElementType = (nodeName: string): string | null => {
  const match = nodeName.match(/<([a-z0-9]+)>/i)
  return match ? match[1]!.toLowerCase() : null
}
