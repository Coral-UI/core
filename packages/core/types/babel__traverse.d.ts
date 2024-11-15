declare module '@babel/traverse' {
  import * as t from '@babel/types'

  export interface NodePath<T = t.Node> {
    // Add a property or method to make the interface non-empty
    node: T
  }

  export default function traverse(ast: t.Node, visitors: object): void
}
