import { extractMethods } from '@/extractMethods'
import { extractProps } from '@/extractProps'
import { extractStateHooks } from '@/extractStateHooks'
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
} from '@reallygoodwork/coral-core'
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
  } = {
    // imports: [],
    componentName: '',
    // componentProperties: [],
    type: 'ArrowFunction',
    // stateHooks: [],
    // methods: [],
    rootElement: null,
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
          const props = extractProps(path.node.declaration.params[0] || null)
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

      // For function declarations that might be the component
      FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
        if (path.node.id && componentDepth === 0 && !result.componentName) {
          result.componentName = path.node.id.name
          result.type = 'Function'
          const props = extractProps(path.node.params[0] || null)
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
          const props = extractProps(path.node.init.params[0] || null)
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
    const { className, styles, ...otherProps } = result.rootElement?.componentProperties as {
      className?: string
      styles?: unknown
      [key: string]: unknown
    }
    const obj: CoralRootNode = {
      $schema: 'https://coral.design/schema.json',
      elementType: (result.rootElement?.elementType as CoralElementType) || 'div',
      componentProperties: otherProps as CoralComponentPropertyType,
      elementAttributes: {},
      isComponentSet: result.rootElement?.isComponent || false,
      name: result.componentName,
      methods: result.methods?.map((method) => ({
        ...method,
        parameters: method.parameters.map((param) => (typeof param === 'string' ? param : param.name)),
      })),
      componentName: result.componentName,
      styles: {
        ...(styles ? styles : {}),
        ...tailwindToCSS(className || ''),
      },
      children: result.rootElement?.children.map(transformUIElementToBaseNode) || [],
      // Include metadata from result
      type: result.type === 'ArrowFunction' ? 'COMPONENT' : 'INSTANCE',
      imports: result.imports,
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
