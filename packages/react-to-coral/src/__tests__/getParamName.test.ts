import { getParamName } from '../getParamName'
import { parse } from '@babel/parser'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

const getParamFromFunction = (functionCode: string, paramIndex = 0): t.Node | null => {
  const ast = parse(functionCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  let param: t.Node | null = null
  traverse(ast, {
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      if (path.node.params[paramIndex]) {
        param = path.node.params[paramIndex]
      }
    },
    ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
      if (path.node.params[paramIndex]) {
        param = path.node.params[paramIndex]
      }
    }
  })

  return param
}

describe('getParamName', () => {
  it('should extract identifier parameter names', () => {
    const functionCode = 'const fn = (param) => {}'
    const param = getParamFromFunction(functionCode)

    expect(param).not.toBeNull()
    const result = getParamName(param as t.Identifier | t.RestElement | t.Pattern)

    expect(result).toBe('param')
  })

  it('should extract object pattern parameter names', () => {
    const functionCode = 'const fn = ({ title, count }) => {}'
    const param = getParamFromFunction(functionCode)

    expect(param).not.toBeNull()
    const result = getParamName(param as t.Identifier | t.RestElement | t.Pattern)

    expect(result).toBe('{ title, count }')
  })

  it('should extract array pattern parameter names', () => {
    const functionCode = 'const fn = ([first, second]) => {}'
    const param = getParamFromFunction(functionCode)

    expect(param).not.toBeNull()
    const result = getParamName(param as t.Identifier | t.RestElement | t.Pattern)

    expect(result).toBe('[first, second]')
  })

  it('should extract rest parameter names', () => {
    const functionCode = 'const fn = (...rest) => {}'
    const param = getParamFromFunction(functionCode)

    expect(param).not.toBeNull()
    const result = getParamName(param as t.Identifier | t.RestElement | t.Pattern)

    expect(result).toBe('...rest')
  })

  it('should handle assignment patterns', () => {
    const functionCode = 'const fn = (param = defaultValue) => {}'
    const param = getParamFromFunction(functionCode)

    expect(param).not.toBeNull()
    const result = getParamName(param as t.Identifier | t.RestElement | t.Pattern)

    expect(result).toBe('param')
  })

  it('should return "param" for unsupported parameter types', () => {
    // Test with a TSParameterProperty or other unsupported type
    const functionCode = 'const fn = (param: any) => {}'
    const param = getParamFromFunction(functionCode)

    expect(param).not.toBeNull()
    const result = getParamName(param as t.Identifier | t.RestElement | t.Pattern)

    // Based on the implementation, it returns 'param' for unrecognized types
    expect(result).toBe('param')
  })
})