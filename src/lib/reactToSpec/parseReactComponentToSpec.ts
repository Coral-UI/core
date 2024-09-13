import { testReactComponent } from '@/__mock__/testReactComponent'
// import { BaseNode } from '@/config/UISpec'
import generate from '@babel/generator'
import { parse } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

interface ImportInfo {
  source: string
  specifiers: string[]
}

interface PropInfo {
  name: string
}

interface StateHook {
  stateName: string
  stateSetterName: string
  initialValue: string | null
}

interface Method {
  name: string
  params: string[]
  body: string
  stateInteractions: {
    reads: string[]
    writes: string[]
  }
}

interface UIElement {
  elementType: string
  isReactComponent: boolean
  importSource?: string
  props: Record<string, unknown>
  children: UIElement[]
}

interface PropReference {
  type: 'method' | 'state' | 'prop'
  name: string
}

export const parseReactComponentToSpec = (
  component: string,
): {
  rootElement: UIElement | null
  methods: Method[]
  stateHooks: StateHook[]
  props: string[]
} => {
  const ast = parse(component, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  const result: {
    imports: ImportInfo[]
    componentName: string
    props: PropInfo[]
    type: 'ArrowFunction' | 'Function'
    stateHooks: StateHook[]
    methods: Method[]
    rootElement: UIElement | null
  } = {
    imports: [],
    componentName: '',
    props: [],
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
          (spec: t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier) => spec.local.name,
        ),
      })
    },

    // Identify the component and its props
    ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
      if (t.isFunctionDeclaration(path.node.declaration) && path.node.declaration.id) {
        result.componentName = path.node.declaration.id.name
        result.type = 'Function'
        const props = extractProps(path.node.declaration.params[0])
        if (props) result.props.push(...props)
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
        if (props) result.props.push(...props)
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
        if (props) result.props.push(...props)
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
        result.rootElement = parseJSXElement(path.node)
      }
    },
  })

  function extractMethods(
    path: NodePath<t.VariableDeclarator>,
    result: {
      methods: Method[]
      stateHooks: StateHook[]
    },
  ) {
    if (t.isArrowFunctionExpression(path.node.init) || t.isFunctionExpression(path.node.init)) {
      if (t.isIdentifier(path.node.id)) {
        const methodName = path.node.id.name
        const params = path.node.init.params.map(getParamName)
        const body = generate.default(path.node.init.body).code
        const stateInteractions = analyzeStateInteractions(path.node.init.body, result.stateHooks)

        if (!result.methods.some((m) => m.name === methodName)) {
          result.methods.push({ name: methodName, params, body, stateInteractions })
        }
      }
    }
  }

  function analyzeStateInteractions(node: t.Node, stateHooks: StateHook[]) {
    const interactions = {
      reads: new Set<string>(),
      writes: new Set<string>(),
    }

    function visit(node: t.Node) {
      if (t.isIdentifier(node)) {
        const stateHook = stateHooks.find((hook) => hook.stateName === node.name || hook.stateSetterName === node.name)
        if (stateHook) {
          // @ts-expect-error TS2339: Property 'parent' does not exist on type 'Identifier'.
          if (t.isMemberExpression(node.parent) || t.isVariableDeclarator(node.parent)) {
            interactions.reads.add(stateHook.stateName)
            // @ts-expect-error TS2339: Property 'parent' does not exist on type 'Identifier'.
          } else if (t.isCallExpression(node.parent) && node.parent.callee === node) {
            interactions.writes.add(stateHook.stateName)
          }
        }
      }
      for (const key in node) {
        const prop = node[key as keyof t.Node]
        if (prop && typeof prop === 'object' && 'type' in prop && typeof prop.type === 'string' && 'loc' in prop) {
          visit(prop as t.Node)
        }
      }
    }

    visit(node)

    return {
      reads: Array.from(interactions.reads),
      writes: Array.from(interactions.writes),
    }
  }

  function parseJSXElement(node: t.JSXElement): UIElement {
    const elementName = (node.openingElement.name as t.JSXIdentifier).name
    const isReactComponent = elementName[0] === elementName[0]?.toUpperCase()
    const importSource = isReactComponent ? findImportSource(elementName) : undefined

    const props: Record<string, unknown> = {}
    const children: UIElement[] = []

    // Parse props
    node.openingElement.attributes.forEach((attr) => {
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        props[attr.name.name] = parseJSXAttributeValue(attr.value)
      }
    })

    // Parse children
    node.children.forEach((child) => {
      if (t.isJSXElement(child)) {
        children.push(parseJSXElement(child))
      } else if (t.isJSXText(child)) {
        const text = child.value.trim()
        if (text) {
          children.push({
            elementType: 'text',
            isReactComponent: false,
            props: { content: text },
            children: [],
          })
        }
      }
    })

    return { elementType: elementName, isReactComponent, importSource, props, children }
  }

  function findImportSource(componentName: string): string | undefined {
    const importInfo = result.imports.find((imp) => imp.specifiers.includes(componentName))
    return importInfo ? importInfo.source : undefined
  }

  function parseJSXAttributeValue(value: t.JSXAttribute['value']): string | PropReference | null {
    if (t.isStringLiteral(value)) {
      return value.value
    } else if (t.isJSXExpressionContainer(value)) {
      if (t.isIdentifier(value.expression)) {
        return createPropReference(value.expression.name)
      } else if (t.isCallExpression(value.expression)) {
        return `{${generate(value.expression).code}}`
      }
    }
    return null
  }

  function createPropReference(name: string): PropReference {
    if (result.methods.some((m) => m.name === name)) {
      return { type: 'method', name }
    } else if (result.stateHooks.some((s) => s.stateName === name)) {
      return { type: 'state', name }
    } else if (result.props.some((p) => p.name === name)) {
      return { type: 'prop', name }
    }
    // If it's not found, we'll assume it's a prop
    return { type: 'prop', name }
  }

  console.log(result)
  return {
    rootElement: result.rootElement || { elementType: 'div', isReactComponent: false, props: {}, children: [] },
    methods: result.methods,
    stateHooks: result.stateHooks,
    props: result.props.map((p) => p.name),
  }
}

function extractProps(param: t.Node | null): PropInfo[] | undefined {
  if (!param) return undefined

  if (param.type === 'ObjectPattern') {
    return param.properties.map((prop) =>
      prop.type === 'RestElement'
        ? { name: `...${(prop.argument as t.Identifier).name}` }
        : { name: (prop.key as t.Identifier).name },
    )
  } else if (param.type === 'Identifier') {
    return [{ name: param.name }]
  }
  return undefined
}

function extractStateHooks(path: NodePath<t.CallExpression>, result: { stateHooks: StateHook[] }) {
  if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'useState') {
    const parent = path.findParent((p): p is NodePath<t.VariableDeclarator> => p.isVariableDeclarator())
    if (parent && t.isArrayPattern(parent.node.id)) {
      const [stateName, stateSetterName] = parent.node.id.elements.map((el: t.Identifier | null) =>
        el && t.isIdentifier(el) ? el.name : 'unknown',
      )
      const initialValue = path.node.arguments[0] ? generate.default(path.node.arguments[0]).code : null
      result.stateHooks.push({
        stateName,
        stateSetterName,
        initialValue,
      })
    }
  }
}

function getParamName(param: t.Identifier | t.Pattern | t.RestElement): string {
  if (t.isIdentifier(param)) return param.name
  if (t.isObjectPattern(param)) return '{...}'
  if (t.isArrayPattern(param)) return '[...]'
  return 'param'
}

parseReactComponentToSpec(testReactComponent)
