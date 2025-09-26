import { parse } from '@babel/parser'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import type { CoralStateType } from '@reallygoodwork/coral-core'

import { extractStateHooks } from '../extractStateHooks'

const extractStateHooksFromCode = (code: string): Array<CoralStateType> => {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  const result: { stateHooks?: Array<CoralStateType> } = { stateHooks: [] }

  traverse(ast, {
    CallExpression(path: NodePath<t.CallExpression>) {
      extractStateHooks(path, result)
    },
  })

  return result.stateHooks || []
}

describe('extractStateHooks', () => {
  it('should extract useState hooks with primitive initial values', () => {
    const code = `
      import React, { useState } from 'react'
      const [count, setCount] = useState(0)
    `

    const stateHooks = extractStateHooksFromCode(code)

    expect(stateHooks).toHaveLength(1)
    expect(stateHooks[0]?.name).toBe('count')
    expect(stateHooks[0]?.setterName).toBe('setCount')
    expect(stateHooks[0]?.initialValue).toBe(0)
    expect(stateHooks[0]?.tsType).toBe('number')
  })

  it('should extract useState hooks with string initial values', () => {
    const code = `
      const [name, setName] = useState('test')
    `

    const stateHooks = extractStateHooksFromCode(code)

    expect(stateHooks).toHaveLength(1)
    expect(stateHooks[0]?.name).toBe('name')
    expect(stateHooks[0]?.setterName).toBe('setName')
    expect(stateHooks[0]?.initialValue).toBe('test')
    expect(stateHooks[0]?.tsType).toBe('string')
  })

  it('should extract useState hooks with boolean initial values', () => {
    const code = `
      const [isVisible, setIsVisible] = useState(true)
    `

    const stateHooks = extractStateHooksFromCode(code)

    expect(stateHooks).toHaveLength(1)
    expect(stateHooks[0]?.name).toBe('isVisible')
    expect(stateHooks[0]?.setterName).toBe('setIsVisible')
    expect(stateHooks[0]?.initialValue).toBe(true)
    expect(stateHooks[0]?.tsType).toBe('boolean')
  })

  it('should extract useState hooks with array initial values', () => {
    const code = `
      const [items, setItems] = useState([])
    `

    const stateHooks = extractStateHooksFromCode(code)

    expect(stateHooks).toHaveLength(1)
    expect(stateHooks[0]?.name).toBe('items')
    expect(stateHooks[0]?.setterName).toBe('setItems')
    expect(stateHooks[0]?.tsType).toBe('array')
  })

  it('should extract useState hooks with object initial values', () => {
    const code = `
      const [user, setUser] = useState({ name: 'John', age: 30 })
    `

    const stateHooks = extractStateHooksFromCode(code)

    expect(stateHooks).toHaveLength(1)
    expect(stateHooks[0]?.name).toBe('user')
    expect(stateHooks[0]?.setterName).toBe('setUser')
    expect(stateHooks[0]?.tsType).toBe('object')
  })

  it('should extract useState hooks with null initial values', () => {
    const code = `
      const [data, setData] = useState(null)
    `

    const stateHooks = extractStateHooksFromCode(code)

    expect(stateHooks).toHaveLength(1)
    expect(stateHooks[0]?.name).toBe('data')
    expect(stateHooks[0]?.setterName).toBe('setData')
    expect(stateHooks[0]?.initialValue).toBe(null)
  })

  it('should extract useState hooks with undefined initial values', () => {
    const code = `
      const [value, setValue] = useState(undefined)
    `

    const stateHooks = extractStateHooksFromCode(code)

    expect(stateHooks).toHaveLength(1)
    expect(stateHooks[0]?.name).toBe('value')
    expect(stateHooks[0]?.setterName).toBe('setValue')
    expect(stateHooks[0]?.initialValue).toBe(undefined)
  })

  it('should extract multiple useState hooks', () => {
    const code = `
      const [count, setCount] = useState(0)
      const [name, setName] = useState('test')
      const [isVisible, setIsVisible] = useState(false)
    `

    const stateHooks = extractStateHooksFromCode(code)

    expect(stateHooks).toHaveLength(3)

    expect(stateHooks[0]?.name).toBe('count')
    expect(stateHooks[0]?.tsType).toBe('number')

    expect(stateHooks[1]?.name).toBe('name')
    expect(stateHooks[1]?.tsType).toBe('string')

    expect(stateHooks[2]?.name).toBe('isVisible')
    expect(stateHooks[2]?.tsType).toBe('boolean')
  })

  it('should skip non-useState function calls', () => {
    const code = `
      const result = someFunction()
      const data = fetch('/api/data')
      console.log('test')
    `

    const stateHooks = extractStateHooksFromCode(code)

    expect(stateHooks).toHaveLength(0)
  })

  it('should handle useState with complex initial values', () => {
    const code = `
      const [config, setConfig] = useState(() => ({ theme: 'dark', locale: 'en' }))
    `

    const stateHooks = extractStateHooksFromCode(code)

    expect(stateHooks).toHaveLength(1)
    expect(stateHooks[0]?.name).toBe('config')
    expect(stateHooks[0]?.setterName).toBe('setConfig')
    // Function initial values should be treated as functions
    expect(stateHooks[0]?.tsType).toBe('function')
  })
})
