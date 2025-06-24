import * as t from '@babel/types'

import { isNode } from '../isNode'

describe('isNode', () => {
  it('should return true for a valid Babel node', () => {
    const node = t.identifier('myVar')
    expect(isNode(node)).toBe(true)
  })

  it('should return false for a non-object', () => {
    expect(isNode('a string')).toBe(false)
    expect(isNode(123)).toBe(false)
    expect(isNode(true)).toBe(false)
    expect(isNode(undefined)).toBe(false)
  })

  it('should return false for null', () => {
    expect(isNode(null)).toBe(false)
  })

  it('should return false for an object without a "type" property', () => {
    const obj = { name: 'test' }
    expect(isNode(obj)).toBe(false)
  })

  it('should return false for an object with a non-string "type" property', () => {
    const obj = { type: 123 }
    expect(isNode(obj)).toBe(false)
  })

  it('should return true for a mock node object', () => {
    const mockNode = {
      type: 'Identifier',
      loc: {
        start: { line: 1, column: 0 },
        end: { line: 1, column: 5 },
      },
      name: 'test',
    }
    expect(isNode(mockNode)).toBe(true)
  })
})
