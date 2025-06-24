// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import generate from '@babel/generator'
import * as t from '@babel/types'

import { createPropReference } from '../createPropReference'
import { parseJSXAttributeValue } from '../parseJSXAttributeValue'

jest.mock('@babel/generator', () => ({
  __esModule: true,
  default: jest.fn((ast) => ({ code: '() => {}' })),
}))

jest.mock('../createPropReference')

describe('parseJSXAttributeValue', () => {
  const mockResult = {
    methods: [],
    stateHooks: [],
    componentProperties: [],
  }

  it('should return the value of a string literal', () => {
    const attr = t.stringLiteral('hello world')
    const result = parseJSXAttributeValue(attr, mockResult)
    expect(result).toBe('hello world')
  })

  it('should return null for an empty JSX expression', () => {
    const attr = t.jSXExpressionContainer(t.jSXEmptyExpression())
    const result = parseJSXAttributeValue(attr, mockResult)
    expect(result).toBeNull()
  })

  it('should handle call expressions', () => {
    const call = t.callExpression(t.identifier('myFunc'), [])
    const attr = t.jSXExpressionContainer(call)
    const result = parseJSXAttributeValue(attr, mockResult)
    expect(result).toBe('{() => {}}')
    expect(generate).toHaveBeenCalledWith(call)
  })

  it('should return null for other jsx attribute types', () => {
    const attr = t.jSXElement(t.jSXOpeningElement(t.jSXIdentifier('div'), [], false), null, [], false)
    const result = parseJSXAttributeValue(attr, mockResult)
    expect(result).toBeNull()
  })

  it('should call createPropReference for identifiers', () => {
    const attr = t.jSXExpressionContainer(t.identifier('myProp'))
    parseJSXAttributeValue(attr, mockResult)
    expect(createPropReference).toHaveBeenCalledWith('myProp', mockResult)
  })
})
