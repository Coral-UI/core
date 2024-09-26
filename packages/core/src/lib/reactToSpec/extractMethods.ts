import { Methods } from '@/config/Methods'
import { StateHooks } from '@/config/StateHooks'
import { analyzeStateInteractions } from '@/lib/reactToSpec/analyzeStateInteractions'
import { getParamName } from '@/lib/reactToSpec/getParamName'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import generate from '@babel/generator'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

export const extractMethods = (
  path: NodePath<t.VariableDeclarator>,
  result: {
    methods: Methods
    stateHooks: StateHooks
  },
) => {
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
