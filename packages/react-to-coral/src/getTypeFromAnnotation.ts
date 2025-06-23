import * as t from '@babel/types'

import type { CoralTSTypes } from '@reallygoodwork/coral-core'

export const getTypeFromAnnotation = (annotation: t.TypeAnnotation | t.TSTypeAnnotation): CoralTSTypes => {
  if (t.isTSTypeAnnotation(annotation)) {
    const typeAnnotation = annotation.typeAnnotation
    if (t.isTSStringKeyword(typeAnnotation)) {
      return 'string' as CoralTSTypes
    } else if (t.isTSBooleanKeyword(typeAnnotation)) {
      return 'boolean' as CoralTSTypes
    } else if (t.isTSNumberKeyword(typeAnnotation)) {
      return 'number' as CoralTSTypes
    } else if (t.isTSArrayType(typeAnnotation)) {
      return 'array' as CoralTSTypes
    } else if (t.isTSFunctionType(typeAnnotation)) {
      return 'function' as CoralTSTypes
    } else if (t.isTSTypeReference(typeAnnotation) && t.isIdentifier(typeAnnotation.typeName)) {
      return typeAnnotation.typeName.name as CoralTSTypes
    }
    // Add more type checks as needed
  }
  return 'any' as CoralTSTypes
}
