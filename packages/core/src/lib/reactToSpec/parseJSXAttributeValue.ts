import { Methods } from '@/config/Methods'
import { Props } from '@/config/Props'
import { StateHooks } from '@/config/StateHooks'
import { createPropReference } from '@/lib/reactToSpec/createPropReference'
import { PropReference } from '@/lib/reactToSpec/transformReactComponentToSpec'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import generate from '@babel/generator'
import * as t from '@babel/types'

export const parseJSXAttributeValue = (
  value: t.JSXAttribute['value'],
  result: { methods: Methods; stateHooks: StateHooks; props: Props },
): string | PropReference | null => {
  if (t.isStringLiteral(value)) {
    return value.value
  } else if (t.isJSXExpressionContainer(value)) {
    if (t.isIdentifier(value.expression)) {
      return createPropReference(value.expression.name, result)
    } else if (t.isCallExpression(value.expression)) {
      return `{${generate.default(value.expression).code}}`
    }
  }
  return null
}
