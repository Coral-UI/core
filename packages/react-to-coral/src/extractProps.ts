import generate from '@babel/generator'
import * as t from '@babel/types'

import type { CoralComponentPropertyType, CoralTSTypes } from '@reallygoodwork/coral-core'

import { getTypeFromAnnotation } from './getTypeFromAnnotation'

export const extractProps = (
  param: t.Node | null,
  typeDefinitions?: Map<string, t.TSTypeAliasDeclaration | t.TSInterfaceDeclaration>,
): CoralComponentPropertyType | undefined => {
  if (!param) return undefined

  const props: Record<string, any> = {}

  if (param.type === 'ObjectPattern') {
    param.properties.forEach((prop) => {
      if (prop.type === 'RestElement') {
        props[`...${(prop.argument as t.Identifier).name}`] = {
          value: `...${(prop.argument as t.Identifier).name}`,
          type: 'any',
        }
      } else if (t.isObjectProperty(prop)) {
        const name = (prop.key as t.Identifier).name
        let type: CoralTSTypes | string = 'any'
        let isOptional = false
        let defaultValue: any = undefined

        // Check if property has a default value
        if (t.isAssignmentPattern(prop.value)) {
          defaultValue = extractDefaultValue(prop.value.right)
          // The actual parameter is in the left side of the assignment
          if (t.isIdentifier(prop.value.left)) {
            // Check for optional parameter in the type annotation
            if (param.typeAnnotation && t.isTSTypeAnnotation(param.typeAnnotation)) {
              const typeAnnotation = param.typeAnnotation.typeAnnotation
              if (t.isTSTypeLiteral(typeAnnotation)) {
                const memberType = typeAnnotation.members.find(
                  (member): member is t.TSPropertySignature =>
                    t.isTSPropertySignature(member) && t.isIdentifier(member.key) && member.key.name === name,
                )
                if (memberType) {
                  isOptional = memberType.optional || false
                  if (memberType.typeAnnotation) {
                    type = getTypeFromAnnotation(memberType.typeAnnotation)
                  }
                }
              }
            }
          }
        } else {
          // Handle inline prop types for properties without defaults
          if (param.typeAnnotation && t.isTSTypeAnnotation(param.typeAnnotation)) {
            const typeAnnotation = param.typeAnnotation.typeAnnotation
            if (t.isTSTypeLiteral(typeAnnotation)) {
              const memberType = typeAnnotation.members.find(
                (member): member is t.TSPropertySignature =>
                  t.isTSPropertySignature(member) && t.isIdentifier(member.key) && member.key.name === name,
              )
              if (memberType) {
                isOptional = memberType.optional || false
                if (memberType.typeAnnotation) {
                  type = getTypeFromAnnotation(memberType.typeAnnotation)
                }
              }
            }
          }
        }

        // Create comprehensive property documentation
        const propInfo: any = {
          type: type,
          value: name,
          optional: isOptional,
        }

        // Add default value if present
        if (defaultValue !== undefined) {
          propInfo.defaultValue = defaultValue
        }

        // Add description for complex types
        if (typeof type === 'string' && type.includes('|')) {
          propInfo.description = `Union type: ${type}`
        } else if (typeof type === 'string' && type.includes('=>')) {
          propInfo.description = `Function type: ${type}`
        }

        props[name] = propInfo
      }
    })
  } else if (param.type === 'Identifier') {
    // Handle type annotation on the identifier (like React.FC<PropType>)
    let resolvedProps: Record<string, any> = {}

    if (param.typeAnnotation && t.isTSTypeAnnotation(param.typeAnnotation)) {
      resolvedProps = resolveTypeReference(param.typeAnnotation.typeAnnotation, typeDefinitions) || {}
    }

    if (Object.keys(resolvedProps).length > 0) {
      // Use resolved props from type reference
      Object.assign(props, resolvedProps)
    } else {
      // Fallback to basic identifier handling
      const type =
        param.typeAnnotation && (t.isTSTypeAnnotation(param.typeAnnotation) || t.isTypeAnnotation(param.typeAnnotation))
          ? getTypeFromAnnotation(param.typeAnnotation)
          : 'any'
      props[param.name] = {
        value: param.name,
        type: type,
        optional: false,
      }
    }
  }

  return Object.keys(props).length > 0 ? props : undefined
}

/**
 * Extract default value from assignment pattern
 */
const extractDefaultValue = (node: t.Expression): any => {
  if (t.isNumericLiteral(node)) {
    return node.value
  } else if (t.isStringLiteral(node)) {
    return node.value
  } else if (t.isBooleanLiteral(node)) {
    return node.value
  } else if (t.isNullLiteral(node)) {
    return null
  } else if (t.isIdentifier(node) && node.name === 'undefined') {
    return undefined
  } else if (t.isArrayExpression(node)) {
    return '[]' // Return string representation for arrays
  } else if (t.isObjectExpression(node)) {
    return '{}' // Return string representation for objects
  } else {
    // For complex expressions, return the code representation
    try {
      return generate(node).code
    } catch {
      return 'unknown'
    }
  }
}

/**
 * Resolve a TypeScript type reference to its actual properties
 */
const resolveTypeReference = (
  typeAnnotation: t.TSType,
  typeDefinitions?: Map<string, t.TSTypeAliasDeclaration | t.TSInterfaceDeclaration>,
): Record<string, any> | null => {
  if (!typeDefinitions || typeDefinitions.size === 0) {
    return null
  }

  // Handle type references (e.g., MyPropsType)
  if (t.isTSTypeReference(typeAnnotation) && t.isIdentifier(typeAnnotation.typeName)) {
    const typeName = typeAnnotation.typeName.name
    const typeDefinition = typeDefinitions.get(typeName)

    if (!typeDefinition) {
      return null
    }

    // Handle type alias (type MyProps = {...})
    if (t.isTSTypeAliasDeclaration(typeDefinition) && t.isTSTypeLiteral(typeDefinition.typeAnnotation)) {
      return extractPropsFromTypeLiteral(typeDefinition.typeAnnotation)
    }

    // Handle interface (interface MyProps {...})
    if (t.isTSInterfaceDeclaration(typeDefinition)) {
      return extractPropsFromInterface(typeDefinition)
    }
  }

  return null
}

/**
 * Extract properties from a TypeScript type literal
 */
const extractPropsFromTypeLiteral = (typeLiteral: t.TSTypeLiteral): Record<string, any> => {
  const props: Record<string, any> = {}

  typeLiteral.members.forEach((member) => {
    if (t.isTSPropertySignature(member) && t.isIdentifier(member.key)) {
      const name = member.key.name
      const isOptional = member.optional || false
      let type: CoralTSTypes | string = 'any'

      if (member.typeAnnotation) {
        type = getTypeFromAnnotation(member.typeAnnotation)
      }

      const propInfo: any = {
        type: type,
        value: name,
        optional: isOptional,
      }

      // Add description for complex types
      if (typeof type === 'string' && type.includes('|')) {
        propInfo.description = `Union type: ${type}`
      } else if (typeof type === 'string' && type.includes('=>')) {
        propInfo.description = `Function type: ${type}`
      }

      props[name] = propInfo
    }
  })

  return props
}

/**
 * Extract properties from a TypeScript interface declaration
 */
const extractPropsFromInterface = (interfaceDecl: t.TSInterfaceDeclaration): Record<string, any> => {
  const props: Record<string, any> = {}

  interfaceDecl.body.body.forEach((member) => {
    if (t.isTSPropertySignature(member) && t.isIdentifier(member.key)) {
      const name = member.key.name
      const isOptional = member.optional || false
      let type: CoralTSTypes | string = 'any'

      if (member.typeAnnotation) {
        type = getTypeFromAnnotation(member.typeAnnotation)
      }

      const propInfo: any = {
        type: type,
        value: name,
        optional: isOptional,
      }

      // Add description for complex types
      if (typeof type === 'string' && type.includes('|')) {
        propInfo.description = `Union type: ${type}`
      } else if (typeof type === 'string' && type.includes('=>')) {
        propInfo.description = `Function type: ${type}`
      }

      props[name] = propInfo
    }
  })

  return props
}
