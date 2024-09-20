import { Imports } from '@/config/Imports'
import { Methods } from '@/config/Methods'
import { Props } from '@/config/Props'
import { StateHooks } from '@/config/StateHooks'
import { UISpec } from '@/config/UISpec'
import { extractMethods } from '@/lib/reactToSpec/extractMethods'
import { extractProps } from '@/lib/reactToSpec/extractProps'
import { extractStateHooks } from '@/lib/reactToSpec/extractStateHooks'
import { parseJSXElement } from '@/lib/reactToSpec/parseJSXElement'
import { transformUIElementToBaseNode } from '@/lib/reactToSpec/transformUIElementToBaseNode'
import { tailwindToCSS } from '@/lib/tailwindToCSS/tailwindToCSS'
import { parse } from '@babel/parser'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

export interface UIElement {
  elementType: string
  isComponent: boolean
  importSource?: string
  props: Record<string, unknown>
  children: UIElement[]
}

export interface PropReference {
  type: 'method' | 'state' | 'prop'
  name: string
}

export interface Result {
  imports: Imports
  methods: Methods
  stateHooks: StateHooks
  props: Props
}

export const transformReactComponentToSpec = (component: string) => {
  const ast = parse(component, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  const result: {
    imports: Imports
    componentName: string
    props: Props
    type: 'ArrowFunction' | 'Function'
    stateHooks: StateHooks
    methods: Methods
    rootElement: UIElement | null
  } = {
    imports: [],
    componentName: '',
    props: {},
    type: 'ArrowFunction',
    stateHooks: [],
    methods: [],
    rootElement: null,
  }

  let componentDepth = 0

  traverse.default(ast, {
    // Identify imports
    ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
      result.imports.push({
        source: path.node.source.value,
        specifiers: path.node.specifiers.map(
          (spec: t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier) => ({
            name: spec.local.name,
            isDefault: t.isImportDefaultSpecifier(spec),
          }),
        ),
      })
    },

    // Identify the component and its props
    ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
      if (t.isFunctionDeclaration(path.node.declaration) && path.node.declaration.id) {
        result.componentName = path.node.declaration.id.name
        result.type = 'Function'
        const props = extractProps(path.node.declaration.params[0])
        if (props) {
          result.props = { ...result.props, ...props }
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
        const props = extractProps(path.node.params[0])
        if (props) {
          result.props = { ...result.props, ...props }
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
        const props = extractProps(path.node.init.params[0])
        if (props) {
          result.props = { ...result.props, ...props }
        }
        componentDepth++
        path.get('init').traverse({
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
  })

  const { className, styles, ...otherProps } = result.rootElement?.props as {
    className?: string
    styles?: unknown
    [key: string]: unknown
  }
  const obj: UISpec = {
    elementType: result.rootElement?.elementType || 'div',
    props: otherProps as Record<string, string | { type: string; name: string }>,
    isComponent: result.rootElement?.isComponent || false,
    importSource: result.rootElement?.importSource || undefined,
    name: result.componentName,
    methods: result.methods,
    stateHooks: result.stateHooks,
    componentName: result.componentName,
    styles: {
      ...(styles ? styles : {}),
      ...tailwindToCSS(className || ''),
    },
    children: result.rootElement?.children.map(transformUIElementToBaseNode) || [],
  }

  return obj
}
