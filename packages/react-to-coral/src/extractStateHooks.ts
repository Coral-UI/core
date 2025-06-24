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

    const parentPath = (path as any).parentPath
    if (parentPath && t.isVariableDeclarator(parentPath.node) && t.isArrayPattern(parentPath.node.id)) {
      const [stateName, stateSetterName] = parentPath.node.id.elements.map((el: t.Node) =>
        t.isIdentifier(el) ? el.name : 'unknown',
      )
      const arg = path.node.arguments[0]
      let initialValue: any = null
      let type: CoralTSTypes = 'any'

      if (arg) {
        if (t.isNumericLiteral(arg)) {
          initialValue = arg.value
          type = 'number'
        } else if (t.isStringLiteral(arg)) {
          initialValue = arg.value
          type = 'string'
        } else if (t.isBooleanLiteral(arg)) {
          initialValue = arg.value
          type = 'boolean'
        } else if (t.isArrayExpression(arg)) {
          type = 'array'
        } else if (t.isObjectExpression(arg)) {
          type = 'object'
        } else if (t.isArrowFunctionExpression(arg) || t.isFunctionExpression(arg)) {
          type = 'function'
        } else if (t.isNullLiteral(arg)) {
          initialValue = null
        } else if (t.isIdentifier(arg) && arg.name === 'undefined') {
          initialValue = undefined
        } else {
          initialValue = generate(arg).code
        }
      }

      if (stateName !== 'unknown' && stateSetterName !== 'unknown') {
        if (!result.stateHooks) result.stateHooks = []
        result.stateHooks.push({
          name: stateName,
          setterName: stateSetterName,
          initialValue,
          tsType: type,
        })
      }
    }
  }
}
