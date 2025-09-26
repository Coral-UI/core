import * as t from '@babel/types'

export const getParamName = (param: t.Identifier | t.Pattern | t.RestElement): string => {
  if (t.isIdentifier(param)) return param.name
  if (t.isRestElement(param)) {
    return `...${t.isIdentifier(param.argument) ? param.argument.name : 'rest'}`
  }
  if (t.isObjectPattern(param)) {
    const props = param.properties
      .map((prop) => {
        if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
          return prop.key.name
        }
        if (t.isRestElement(prop) && t.isIdentifier(prop.argument)) {
          return `...${prop.argument.name}`
        }
        return '?'
      })
      .join(', ')
    return `{ ${props} }`
  }
  if (t.isArrayPattern(param)) {
    const elements = param.elements
      .map((element) => {
        if (element === null) return '?'
        if (t.isIdentifier(element)) return element.name
        if (t.isRestElement(element) && t.isIdentifier(element.argument)) {
          return `...${element.argument.name}`
        }
        return '?'
      })
      .join(', ')
    return `[${elements}]`
  }
  if (t.isAssignmentPattern(param)) {
    return getParamName(param.left as t.Identifier | t.Pattern)
  }
  return 'param'
}
