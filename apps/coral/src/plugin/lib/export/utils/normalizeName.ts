import { pascalCaseString } from '@reallygoodwork/coral-core'

export const normalizeName = (name: string): string => {
  // Remove all spaces and special characters and convert to camelCase
  return pascalCaseString(name)
}

export const normalizeStyleName = (name: string): string => {
  // Check if the string contains separators (spaces, hyphens, underscores)
  const hasSeparators = /[\s_-]/.test(name)

  // If no separators, return as-is (already camelCase or single word)
  if (!hasSeparators) {
    return name
  }

  // Convert to camelCase: split on spaces and hyphens, lowercase first word, capitalize rest
  const words = name.split(/[\s_-]+/).filter(Boolean)
  if (words.length === 0) return name

  const firstWord = words[0]!.toLowerCase()
  const restWords = words.slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  return firstWord + restWords.join('')
}
