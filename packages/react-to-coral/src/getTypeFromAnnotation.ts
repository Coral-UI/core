import generate from '@babel/generator'
import * as t from '@babel/types'

import type { CoralTSTypes } from '@reallygoodwork/coral-core'

/**
 * Enhanced type extraction that captures detailed TypeScript type information
 */
export const getTypeFromAnnotation = (annotation: t.TypeAnnotation | t.TSTypeAnnotation): CoralTSTypes | string => {
  if (t.isTSTypeAnnotation(annotation)) {
    return extractTSType(annotation.typeAnnotation)
  }
  return 'any' as CoralTSTypes
}

/**
 * Recursively extract TypeScript type information
 */
const extractTSType = (typeAnnotation: t.TSType): CoralTSTypes | string => {
  // Basic types
  if (t.isTSStringKeyword(typeAnnotation)) {
    return 'string'
  } else if (t.isTSBooleanKeyword(typeAnnotation)) {
    return 'boolean'
  } else if (t.isTSNumberKeyword(typeAnnotation)) {
    return 'number'
  } else if (t.isTSUndefinedKeyword(typeAnnotation)) {
    return 'undefined'
  } else if (t.isTSNullKeyword(typeAnnotation)) {
    return 'null'
  }

  // Array types
  else if (t.isTSArrayType(typeAnnotation)) {
    const elementType = extractTSType(typeAnnotation.elementType)
    return `${elementType}[]`
  }

  // Function types
  else if (t.isTSFunctionType(typeAnnotation)) {
    const params = typeAnnotation.parameters
      .map((param) => {
        if (t.isIdentifier(param) && param.typeAnnotation) {
          return `${param.name}: ${extractTSType((param.typeAnnotation as t.TSTypeAnnotation).typeAnnotation)}`
        }
        return 'unknown'
      })
      .join(', ')

    const returnType = typeAnnotation.typeAnnotation
      ? extractTSType(typeAnnotation.typeAnnotation.typeAnnotation)
      : 'void'

    return `(${params}) => ${returnType}`
  }

  // Union types (e.g., 'primary' | 'secondary')
  else if (t.isTSUnionType(typeAnnotation)) {
    const types = typeAnnotation.types.map((type) => extractTSType(type))
    return types.join(' | ')
  }

  // Literal types (e.g., 'primary', 42, true)
  else if (t.isTSLiteralType(typeAnnotation)) {
    if (t.isStringLiteral(typeAnnotation.literal)) {
      return `'${typeAnnotation.literal.value}'`
    } else if (t.isNumericLiteral(typeAnnotation.literal)) {
      return typeAnnotation.literal.value.toString()
    } else if (t.isBooleanLiteral(typeAnnotation.literal)) {
      return typeAnnotation.literal.value.toString()
    }
  }

  // Type references (e.g., React.ReactNode, CustomType)
  else if (t.isTSTypeReference(typeAnnotation)) {
    if (t.isIdentifier(typeAnnotation.typeName)) {
      return typeAnnotation.typeName.name
    } else if (t.isTSQualifiedName(typeAnnotation.typeName)) {
      // Handle qualified names like React.ReactNode
      return generate(typeAnnotation.typeName).code
    }
  }

  // Object types
  else if (t.isTSTypeLiteral(typeAnnotation)) {
    return 'object'
  }

  // Optional types (T | undefined)
  else if (t.isTSOptionalType && t.isTSOptionalType(typeAnnotation)) {
    return `${extractTSType(typeAnnotation.typeAnnotation)} | undefined`
  }

  // Fallback: try to generate the code representation
  try {
    return generate(typeAnnotation).code
  } catch {
    return 'any'
  }
}
