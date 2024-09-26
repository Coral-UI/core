import * as t from '@babel/types'

export const getTypeFromAnnotation = (annotation: t.TypeAnnotation | t.TSTypeAnnotation): string => {
  if (t.isTSTypeAnnotation(annotation)) {
    const typeAnnotation = annotation.typeAnnotation
    if (t.isTSStringKeyword(typeAnnotation)) {
      return 'string'
    } else if (t.isTSBooleanKeyword(typeAnnotation)) {
      return 'boolean'
    } else if (t.isTSNumberKeyword(typeAnnotation)) {
      return 'number'
    } else if (t.isTSTypeReference(typeAnnotation) && t.isIdentifier(typeAnnotation.typeName)) {
      return typeAnnotation.typeName.name
    }
    // Add more type checks as needed
  }
  return 'any'
}
