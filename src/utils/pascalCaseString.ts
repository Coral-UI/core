import { PascalCase } from 'type-fest'

/**
 * Converts a string to PascalCase.
 *
 * @param {string} str - The string to convert to PascalCase.
 * @returns {PascalCase<string>} The PascalCase version of the input string.
 */
export const pascalCaseString = (str: string): PascalCase<string> => {
  return str
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('') as PascalCase<string>
}
