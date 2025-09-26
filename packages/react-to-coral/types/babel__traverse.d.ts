declare module '@babel/traverse' {
  import * as t from '@babel/types'

  export interface NodePath<T = t.Node> {
    node: T
    parent: t.Node
    parentPath: NodePath | null
    key: string | number
    listKey?: string
    type: string

    // Traversal methods
    traverse(visitors: Visitor): void
    skip(): void
    stop(): void

    // Path manipulation
    get(key: string): NodePath | NodePath[]
    getFunctionParent(): NodePath | null
    getStatementParent(): NodePath | null

    // Node checks
    isFunction(): boolean
    isStatement(): boolean
    isExpression(): boolean
    isBlockStatement(): boolean
    isIdentifier(): boolean
    isVariableDeclarator(): boolean
    isCallExpression(): boolean
    isFunctionDeclaration(): boolean
    isArrowFunctionExpression(): boolean
    isExportDefaultDeclaration(): boolean
    isImportDeclaration(): boolean
    isJSXElement(): boolean

    // Utilities
    toString(): string
    getSource(): string
  }

  export interface Visitor {
    [key: string]:
      | {
          enter?(path: NodePath<any>): void
          exit?(path: NodePath<any>): void
        }
      | ((path: NodePath<any>) => void)

    // Specific node type visitors
    ImportDeclaration?: (path: NodePath<t.ImportDeclaration>) => void
    ExportDefaultDeclaration?: (path: NodePath<t.ExportDefaultDeclaration>) => void
    FunctionDeclaration?: (path: NodePath<t.FunctionDeclaration>) => void
    VariableDeclarator?: (path: NodePath<t.VariableDeclarator>) => void
    CallExpression?: (path: NodePath<t.CallExpression>) => void
    JSXElement?: (path: NodePath<t.JSXElement>) => void
    JSXFragment?: (path: NodePath<t.JSXFragment>) => void
    ArrowFunctionExpression?: (path: NodePath<t.ArrowFunctionExpression>) => void
  }

  export default function traverse(ast: t.Node, visitors: Visitor): void
}
