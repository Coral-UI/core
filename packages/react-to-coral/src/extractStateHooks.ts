import { getTypeFromTypeParameters } from './getTypeFromTypeParameters'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import generate from '@babel/generator'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import type { CoralStateType, CoralTSTypes } from '@reallygoodwork/coral-core'

export const extractStateHooks = (path: NodePath<t.CallExpression>, result: { stateHooks?: Array<CoralStateType> }) => {
  if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'useState') {
    const parent = path.findParent((p: NodePath): p is NodePath => p.isVariableDeclarator())
    if (parent && t.isVariableDeclarator(parent.node) && t.isArrayPattern(parent.node.id)) {
      const [stateName, stateSetterName] = parent.node.id.elements.map((el: t.Node) =>
        t.isIdentifier(el) ? el.name : 'unknown',
      )
      const initialValue = path.node.arguments[0] ? generate(path.node.arguments[0]).code : null
      const type = path.node.typeParameters ? getTypeFromTypeParameters(path.node.typeParameters) : 'any'

      if (stateName !== 'unknown' && stateSetterName !== 'unknown') {
        if (!result.stateHooks) result.stateHooks = []
        result.stateHooks.push({
          name: stateName,
          setterName: stateSetterName,
          initialValue,
          tsType: type as CoralTSTypes,
        })
      }
    }
  }
}
