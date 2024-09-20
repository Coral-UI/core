import * as t from '@babel/types'

export const isNode = (value: unknown): value is t.Node => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as t.Node).type === 'string' &&
    'loc' in value
  )
}
