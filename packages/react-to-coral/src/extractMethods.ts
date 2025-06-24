import { analyzeStateInteractions } from '@/analyzeStateInteractions'
import { getParamName } from '@/getParamName'
import generate from '@babel/generator'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import type { CoralMethodType, CoralStateType } from '@reallygoodwork/coral-core'

export const extractMethods = (
  path: NodePath<t.VariableDeclarator>,
  result: {
    methods?: Array<CoralMethodType>
    stateHooks?: Array<CoralStateType>
  },
) => {
  if (t.isArrowFunctionExpression(path.node.init) || t.isFunctionExpression(path.node.init)) {
    if (t.isIdentifier(path.node.id)) {
      const methodName = path.node.id.name
      const parameters = path.node.init.params.map(getParamName)
      const body = generate(path.node.init.body).code
      const stateInteractions = analyzeStateInteractions(
        (path as any).get('init.body'),
        result.stateHooks || [],
      )

      if (!result.methods?.some((m) => m.name === methodName)) {
        if (!result.methods) result.methods = []
        result.methods.push({ name: methodName, parameters, body, stateInteractions })
      }
    }
  }
}
