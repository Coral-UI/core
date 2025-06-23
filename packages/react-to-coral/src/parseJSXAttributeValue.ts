import type { PropReference } from '@/transformReactComponentToSpec'
import { createPropReference } from '@/createPropReference'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import generate from '@babel/generator'
import * as t from '@babel/types'

import type { CoralComponentPropertyType, CoralMethodType, CoralStateType } from '@reallygoodwork/coral-core'

export const parseJSXAttributeValue = (
  value: t.JSXAttribute['value'],
  result: {
    methods: Array<CoralMethodType>
    stateHooks: Array<CoralStateType>
    componentProperties: Array<CoralComponentPropertyType>
  },
): string | PropReference | null => {
  if (t.isStringLiteral(value)) {
    return value.value
  } else if (t.isJSXExpressionContainer(value)) {
    if (t.isIdentifier(value.expression)) {
      return createPropReference(value.expression.name, result)
    } else if (t.isCallExpression(value.expression)) {
      return `{${generate(value.expression).code}}`
    }
  }
  return null
}
