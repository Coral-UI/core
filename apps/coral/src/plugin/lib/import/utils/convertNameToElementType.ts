import { CoralElementType } from '@reallygoodwork/coral-core'

export const convertNameToElementType = (elementType: CoralElementType, modifier?: string): string => {
  return `<${elementType.toLowerCase()}${modifier ? ` - ${modifier}` : ''}>`
}
