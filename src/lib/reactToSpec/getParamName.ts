import * as t from '@babel/types'

export const getParamName = (param: t.Identifier | t.Pattern | t.RestElement): string => {
  if (t.isIdentifier(param)) return param.name
  if (t.isObjectPattern(param)) return '{...}'
  if (t.isArrayPattern(param)) return '[...]'
  return 'param'
}
