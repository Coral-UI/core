import { StateHooks } from '@/config/StateHooks'
import { isNode } from '@/lib/reactToSpec/isNode'
import * as t from '@babel/types'

export const analyzeStateInteractions = (node: t.Node, stateHooks: StateHooks) => {
  const interactions = {
    reads: new Set<string>(),
    writes: new Set<string>(),
  }

  function visit(node: t.Node) {
    if (t.isIdentifier(node)) {
      const stateHook = stateHooks.find((hook) => hook.name === node.name || hook.setterName === node.name)
      if (stateHook) {
        // @ts-expect-error TS2339: Property 'parent' does not exist on type 'Identifier'.
        if (t.isMemberExpression(node.parent) || t.isVariableDeclarator(node.parent)) {
          interactions.reads.add(stateHook.name)
          // @ts-expect-error TS2339: Property 'parent' does not exist on type 'Identifier'.
        } else if (t.isCallExpression(node.parent) && node.parent.callee === node) {
          interactions.writes.add(stateHook.name)
        }
      }
    }
    for (const key in node) {
      const prop = node[key as keyof t.Node]
      if (isNode(prop)) {
        visit(prop)
      }
    }
  }

  visit(node)

  return {
    reads: Array.from(interactions.reads),
    writes: Array.from(interactions.writes),
  }
}
