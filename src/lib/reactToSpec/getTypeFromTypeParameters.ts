import * as t from '@babel/types'

export const getTypeFromTypeParameters = (typeParameters: t.TSTypeParameterInstantiation): string => {
  // Implement this function to extract the type from TypeScript type parameters
  // This is a simplified version and may need to be expanded based on your needs
  if (typeParameters.params.length > 0) {
    const firstParam = typeParameters.params[0]
    if (t.isTSTypeReference(firstParam) && t.isIdentifier(firstParam.typeName)) {
      return firstParam.typeName.name
    }
  }
  return 'any'
}
