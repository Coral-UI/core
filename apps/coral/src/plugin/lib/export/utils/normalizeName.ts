import { pascalCaseString } from '@reallygoodwork/coral-core'

export const normalizeName = (name: string): string => {
  // Remove all spaces and special characters and convert to camelCase
  return pascalCaseString(name)
}
