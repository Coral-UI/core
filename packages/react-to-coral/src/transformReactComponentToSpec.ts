// import { analyzePropUsage } from '@/analyzePropUsage'
import { extractMethods } from '@/extractMethods'
import { extractProps } from '@/extractProps'
import { extractStateHooks } from '@/extractStateHooks'
import { getTypeFromAnnotation } from '@/getTypeFromAnnotation'
import { parseJSXElement } from '@/parseJSXElement'
import { transformUIElementToBaseNode } from '@/transformUIElementToBaseNode'
import { validateReactComponent } from '@/validateInput'
import { parse } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import type {
  CoralComponentPropertyType,
  CoralElementType,
  CoralImportType,
  CoralMethodType,
  CoralRootNode,
  CoralStateType,
  CoralTSTypes,
} from '@reallygoodwork/coral-core'
import { extractResponsiveStylesFromObject } from '@reallygoodwork/coral-core'
import { tailwindToCSS } from '@reallygoodwork/coral-tw2css'

export interface UIElement {
  elementType: string
  isComponent: boolean
  importSource?: string
  componentProperties?: CoralComponentPropertyType
  children: UIElement[]
  textContent?: string
}

export interface PropReference {
  type: 'method' | 'state' | 'prop'
  value: string
}

export interface Result {
  imports?: Array<CoralImportType>
  methods?: Array<CoralMethodType>
  stateHooks?: Array<CoralStateType>
  componentProperties?: Array<CoralComponentPropertyType>
  typeDefinitions?: Map<string, t.TSTypeAliasDeclaration | t.TSInterfaceDeclaration>
}

export const transformReactComponentToSpec = (
  component: string,
  options?: { skipValidation?: boolean },
): CoralRootNode => {
  // Validate input if not skipped
  if (!options?.skipValidation) {
    const validation = validateReactComponent(component)
    if (!validation.isValid) {
      throw new Error(`Component validation failed: ${validation.errors.map((e) => e.message).join(', ')}`)
    }
  }

  let ast: t.File
  try {
    ast = parse(component, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    })
  } catch (parseError) {
    throw new Error(
      `Failed to parse component: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`,
    )
  }

  const result: {
    imports?: Array<CoralImportType>
    componentName: string
    componentProperties?: Array<CoralComponentPropertyType>
    type: 'ArrowFunction' | 'Function'
    stateHooks?: Array<CoralStateType>
    methods?: Array<CoralMethodType>
    rootElement: UIElement | null
    typeDefinitions?: Map<string, t.TSTypeAliasDeclaration | t.TSInterfaceDeclaration>
  } = {
    // imports: [],
    componentName: '',
    // componentProperties: [],
    type: 'ArrowFunction',
    // stateHooks: [],
    // methods: [],
    rootElement: null,
    typeDefinitions: new Map(),
  }

  let componentDepth = 0

  try {
    traverse(ast, {
      // Identify imports
      ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
        if (!result.imports) result.imports = []
        result.imports.push({
          source: path.node.source.value,
          version: 'latest', // Add this line
          specifiers: path.node.specifiers.map(
            (spec: t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier) => ({
              name: spec.local.name,
              // Add isDefault and as properties if needed
              isDefault: t.isImportDefaultSpecifier(spec),
              as: t.isImportSpecifier(spec)
                ? 'name' in spec.imported
                  ? spec.imported.name
                  : spec.imported.value
                : undefined,
            }),
          ),
        })
      },

      // Identify the component and its props
      ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
        if (t.isFunctionDeclaration(path.node.declaration) && path.node.declaration.id) {
          result.componentName = path.node.declaration.id.name
          result.type = 'Function'
          const props = extractProps(path.node.declaration.params[0] || null, result.typeDefinitions)
          if (props) {
            if (!result.componentProperties) result.componentProperties = []
            result.componentProperties.push(props)
          }
          componentDepth++
          path.traverse({
            CallExpression(callPath: NodePath<t.CallExpression>) {
              extractStateHooks(callPath, result)
            },
            VariableDeclarator(varPath: NodePath<t.VariableDeclarator>) {
              extractMethods(varPath, result)
            },
          })
          componentDepth--
        } else if (t.isIdentifier(path.node.declaration)) {
          // Handle named export
          result.componentName = path.node.declaration.name
        }
      },

      // Capture TypeScript type alias declarations
      TSTypeAliasDeclaration(path: NodePath<t.TSTypeAliasDeclaration>) {
        if (result.typeDefinitions && t.isIdentifier(path.node.id)) {
          result.typeDefinitions.set(path.node.id.name, path.node)
        }
      },

      // Capture TypeScript interface declarations
      TSInterfaceDeclaration(path: NodePath<t.TSInterfaceDeclaration>) {
        if (result.typeDefinitions && t.isIdentifier(path.node.id)) {
          result.typeDefinitions.set(path.node.id.name, path.node)
        }
      },

      // For function declarations that might be the component
      FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
        if (path.node.id && componentDepth === 0 && !result.componentName) {
          result.componentName = path.node.id.name
          result.type = 'Function'
          const props = extractProps(path.node.params[0] || null, result.typeDefinitions)
          if (props) {
            if (!result.componentProperties) result.componentProperties = []
            result.componentProperties.push(props)
          }
          componentDepth++
          path.traverse({
            CallExpression(callPath: NodePath<t.CallExpression>) {
              extractStateHooks(callPath, result)
            },
            VariableDeclarator(varPath: NodePath<t.VariableDeclarator>) {
              extractMethods(varPath, result)
            },
          })
          componentDepth--
        }
      },

      // For arrow function components
      VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
        if (
          t.isIdentifier(path.node.id) &&
          (t.isArrowFunctionExpression(path.node.init) || t.isFunctionExpression(path.node.init)) &&
          componentDepth === 0 &&
          !result.componentName
        ) {
          result.componentName = path.node.id.name
          result.type = 'ArrowFunction'

          // Check for React.FC<PropsType> pattern
          let propsFromTypeAnnotation: CoralComponentPropertyType | undefined
          if (path.node.id.typeAnnotation && t.isTSTypeAnnotation(path.node.id.typeAnnotation)) {
            propsFromTypeAnnotation = extractPropsFromReactFC(path.node.id.typeAnnotation, result.typeDefinitions)
          }

          // Extract props from function parameters (destructuring)
          const propsFromParams = extractProps(path.node.init.params[0] || null, result.typeDefinitions)

          // Use props from React.FC type annotation if available, otherwise use params
          const props = propsFromTypeAnnotation || propsFromParams
          if (props) {
            if (!result.componentProperties) result.componentProperties = []
            result.componentProperties.push(props)
          }

          componentDepth++
          const initPath = path.get('init') as NodePath
          initPath.traverse({
            CallExpression(callPath: NodePath<t.CallExpression>) {
              extractStateHooks(callPath, result)
            },
            VariableDeclarator(varPath: NodePath<t.VariableDeclarator>) {
              extractMethods(varPath, result)
            },
          })
          componentDepth--
        }
      },

      JSXElement(path: NodePath<t.JSXElement>) {
        if (!result.rootElement) {
          result.rootElement = parseJSXElement(path.node, result)
        }
      },

      JSXFragment(path: NodePath<t.JSXFragment>) {
        if (!result.rootElement) {
          result.rootElement = parseJSXElement(path.node, result)
        }
      },
    })
  } catch (traversalError) {
    throw new Error(
      `Failed to analyze component structure: ${traversalError instanceof Error ? traversalError.message : 'Unknown traversal error'}`,
    )
  }

  // Validate that we found a component
  if (!result.componentName) {
    throw new Error('No valid React component found in the provided code')
  }

  if (!result.rootElement) {
    throw new Error('No JSX element found in the component')
  }

  try {
    const extractValue = (prop: any): any => {
      // Handle new format with type and value
      if (prop && typeof prop === 'object' && 'value' in prop) {
        return prop.value
      }
      // Handle legacy format (direct value)
      return prop
    }

    const extractedProps: Record<string, any> = {}

    // Extract values from the new component property format
    Object.entries(result.rootElement?.componentProperties || {}).forEach(([key, prop]) => {
      extractedProps[key] = extractValue(prop)
    })

    const { className, styles } = extractedProps

    // Preserve the original component properties format (with types) for the final spec
    const preservedComponentProperties: CoralComponentPropertyType = {}

    // First, add component-level properties from the function signature/type definitions
    if (result.componentProperties && result.componentProperties.length > 0) {
      Object.assign(preservedComponentProperties, result.componentProperties[0])
    }

    // Then, add any additional properties from the root element (excluding className and styles)
    Object.entries(result.rootElement?.componentProperties || {}).forEach(([key, prop]) => {
      if (key !== 'className' && key !== 'styles') {
        preservedComponentProperties[key] = prop
      }
    })

    // TODO: Re-enable prop usage analysis once debugging is complete
    // Analyze prop usage and enhance component properties with usage metadata
    // if (Object.keys(preservedComponentProperties).length > 0) {
    //   const usageAnalysis = analyzePropUsage(ast, preservedComponentProperties)

    //   Object.keys(preservedComponentProperties).forEach((propName) => {
    //     const prop = preservedComponentProperties[propName]
    //     const usage = usageAnalysis[propName]

    //     if (prop && typeof prop === 'object' && 'type' in prop && usage) {
    //       // Enhance the property with usage information
    //       prop.usage = {
    //         isUsed: usage.isUsed,
    //         contexts: usage.contexts,
    //         dependencies: usage.dependencies.length > 0 ? usage.dependencies : undefined,
    //       }
    //     }
    //   })
    // }

    // Combine inline styles and Tailwind classes
    const combinedStyles = {
      ...(styles ? styles : {}),
      ...tailwindToCSS(className || ''),
    }

    // Extract responsive styles from media queries
    const { baseStyles, responsiveStyles } = extractResponsiveStylesFromObject(combinedStyles)

    const obj: CoralRootNode = {
      $schema: 'https://coral.design/schema.json',
      elementType: (result.rootElement?.elementType as CoralElementType) || 'div',
      componentProperties: preservedComponentProperties,
      elementAttributes: {},
      isComponentSet: result.rootElement?.isComponent || false,
      name: result.componentName,
      methods: result.methods?.map((method) => ({
        ...method,
        parameters: method.parameters.map((param) => (typeof param === 'string' ? param : param.name)),
      })),
      componentName: result.componentName,
      styles: baseStyles,
      children: result.rootElement?.children.map(transformUIElementToBaseNode) || [],
      // Include metadata from result
      type: result.type === 'ArrowFunction' ? 'COMPONENT' : 'INSTANCE',
      imports: result.imports,
    }

    // Add responsive styles if any were found
    if (responsiveStyles.length > 0) {
      obj.responsiveStyles = responsiveStyles
    }

    if (result.stateHooks && result.stateHooks.length > 0) {
      obj.stateHooks = result.stateHooks.map((hook) => ({
        ...hook,
        initialValue:
          hook.initialValue === undefined
            ? 'undefined'
            : hook.initialValue === null
              ? 'null'
              : Array.isArray(hook.initialValue)
                ? 'array'
                : (typeof hook.initialValue as 'string' | 'number' | 'boolean' | 'object' | 'function'),
      }))
    }

    return obj
  } catch (resultError) {
    throw new Error(
      `Failed to construct component specification: ${resultError instanceof Error ? resultError.message : 'Unknown result construction error'}`,
    )
  }
}

/**
 * Extract props from React.FC<PropsType> type annotation
 */
const extractPropsFromReactFC = (
  typeAnnotation: t.TSTypeAnnotation,
  typeDefinitions?: Map<string, t.TSTypeAliasDeclaration | t.TSInterfaceDeclaration>,
): CoralComponentPropertyType | undefined => {
  const tsType = typeAnnotation.typeAnnotation

  // Look for React.FC<PropsType> pattern
  if (t.isTSTypeReference(tsType)) {
    // Check if it's React.FC, React.FunctionComponent, or FC
    const isReactFC =
      (t.isIdentifier(tsType.typeName) &&
        (tsType.typeName.name === 'FC' || tsType.typeName.name === 'FunctionComponent')) ||
      (t.isTSQualifiedName(tsType.typeName) &&
        t.isIdentifier(tsType.typeName.left) &&
        tsType.typeName.left.name === 'React' &&
        t.isIdentifier(tsType.typeName.right) &&
        (tsType.typeName.right.name === 'FC' || tsType.typeName.right.name === 'FunctionComponent'))

    if (isReactFC && tsType.typeParameters && tsType.typeParameters.params.length > 0) {
      const propsType = tsType.typeParameters.params[0]

      // Resolve the props type to its definition
      if (t.isTSTypeReference(propsType) && t.isIdentifier(propsType.typeName) && typeDefinitions) {
        const typeName = propsType.typeName.name
        const typeDefinition = typeDefinitions.get(typeName)

        if (typeDefinition) {
          // Handle type alias (type MyProps = {...})
          if (t.isTSTypeAliasDeclaration(typeDefinition) && t.isTSTypeLiteral(typeDefinition.typeAnnotation)) {
            return extractPropsFromTypeLiteralForFC(typeDefinition.typeAnnotation)
          }

          // Handle interface (interface MyProps {...})
          if (t.isTSInterfaceDeclaration(typeDefinition)) {
            return extractPropsFromInterfaceForFC(typeDefinition)
          }
        }
      }
    }
  }

  return undefined
}

/**
 * Extract properties from a TypeScript type literal for React FC
 */
const extractPropsFromTypeLiteralForFC = (typeLiteral: t.TSTypeLiteral): CoralComponentPropertyType => {
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
 * Extract properties from a TypeScript interface declaration for React FC
 */
const extractPropsFromInterfaceForFC = (interfaceDecl: t.TSInterfaceDeclaration): CoralComponentPropertyType => {
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
