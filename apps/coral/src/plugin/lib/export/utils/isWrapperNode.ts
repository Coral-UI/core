/**
 * Check if a node name contains "wrapper" (case-insensitive)
 * Examples:
 * - "Text Wrapper" -> true
 * - "Title-wrapper" -> true
 * - "Button" -> false
 */
export const isWrapperNode = (nodeName: string): boolean => {
  return /wrapper/i.test(nodeName)
}
