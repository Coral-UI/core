import { extractProps } from '../extractProps'
import { parse } from '@babel/parser'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

const getParamFromFunction = (functionCode: string): t.Node | null => {
  const ast = parse(functionCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  let param: t.Node | null = null
  traverse(ast, {
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      if (path.node.params.length > 0) {
        param = path.node.params[0]
      }
    },
    ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>) {
      if (path.node.params.length > 0) {
        param = path.node.params[0]
      }
    }
  })

  return param
}

describe('extractProps', () => {
  it('should return undefined for no parameters', () => {
    const result = extractProps(null)
    expect(result).toBeUndefined()
  })

  it('should extract props from object destructuring', () => {
    const functionCode = 'const Component = ({ title, count }) => {}'
    const param = getParamFromFunction(functionCode)

    const result = extractProps(param)

    expect(result).toBeDefined()
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('count')
    expect(result?.title).toEqual({ value: 'title', type: 'any' })
    expect(result?.count).toEqual({ value: 'count', type: 'any' })
  })

  it('should extract props with TypeScript types', () => {
    const functionCode = 'const Component = ({ title, count }: { title: string; count: number }) => {}'
    const param = getParamFromFunction(functionCode)

    const result = extractProps(param)

    expect(result).toBeDefined()
    expect(result?.title.type).toBe('string')
    expect(result?.count.type).toBe('number')
  })

  it('should handle rest parameters', () => {
    const functionCode = 'const Component = ({ title, ...rest }) => {}'
    const param = getParamFromFunction(functionCode)

    const result = extractProps(param)

    expect(result).toBeDefined()
    expect(result).toHaveProperty('title')
    expect('...rest' in (result || {})).toBe(true)
    expect(result?.['...rest']).toEqual({ value: '...rest', type: 'any' })
  })

  it('should handle identifier parameters', () => {
    const functionCode = 'const Component = (props) => {}'
    const param = getParamFromFunction(functionCode)

    const result = extractProps(param)

    expect(result).toBeDefined()
    expect(result).toHaveProperty('props')
    expect(result?.props).toEqual({ value: 'props', type: 'any' })
  })

  it('should handle typed identifier parameters', () => {
    const functionCode = 'const Component = (props: ComponentProps) => {}'
    const param = getParamFromFunction(functionCode)

    const result = extractProps(param)

    expect(result).toBeDefined()
    expect(result).toHaveProperty('props')
    expect(result?.props.value).toBe('props')
  })

  it('should return undefined for empty object pattern', () => {
    const functionCode = 'const Component = ({}) => {}'
    const param = getParamFromFunction(functionCode)

    const result = extractProps(param)

    expect(result).toBeUndefined()
  })

  it('should handle complex TypeScript types', () => {
    const functionCode = `
      const Component = ({
        title,
        items,
        onClick
      }: {
        title: string;
        items: string[];
        onClick: () => void
      }) => {}
    `
    const param = getParamFromFunction(functionCode)

    const result = extractProps(param)

    expect(result).toBeDefined()
    expect(result?.title.type).toBe('string')
    expect(result?.items.type).toBe('array')
    expect(result?.onClick.type).toBe('function')
  })
})