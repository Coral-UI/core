import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import { PascalCase } from 'type-fest'

/**
 * Converts a string to PascalCase.
 *
 * @param {string} str - The string to convert to PascalCase.
 * @returns {PascalCase<string>} The PascalCase version of the input string.
 */
export const pascalCaseString = (str: string) => {
  return upperFirst(camelCase(str)) as PascalCase<string>
}
