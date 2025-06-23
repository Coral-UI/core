import { extractMethods } from '../extractMethods'
import { parse } from '@babel/parser'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import type { CoralMethodType, CoralStateType } from '@reallygoodwork/coral-core'

const extractMethodsFromCode = (code: string): Array<CoralMethodType> => {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  const result: {
    methods?: Array<CoralMethodType>
    stateHooks?: Array<CoralStateType>
  } = {
    methods: [],
    stateHooks: []
  }

  traverse(ast, {
    VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
      extractMethods(path, result)
    }
  })

  return result.methods || []
}

describe('extractMethods', () => {
  it('should extract arrow function methods', () => {
    const code = `
      const handleClick = () => {
        console.log('clicked')
      }
    `

    const methods = extractMethodsFromCode(code)

    expect(methods).toHaveLength(1)
    expect(methods[0]?.name).toBe('handleClick')
    expect(methods[0]?.parameters).toEqual([])
    expect(methods[0]?.body).toContain('console.log')
  })

  it('should extract function expression methods', () => {
    const code = `
      const handleSubmit = function(data) {
        return data.toUpperCase()
      }
    `

    const methods = extractMethodsFromCode(code)

    expect(methods).toHaveLength(1)
    expect(methods[0]?.name).toBe('handleSubmit')
    expect(methods[0]?.parameters).toEqual(['data'])
    expect(methods[0]?.body).toContain('toUpperCase')
  })

  it('should extract methods with multiple parameters', () => {
    const code = `
      const processData = (input, options, callback) => {
        callback(input, options)
      }
    `

    const methods = extractMethodsFromCode(code)

    expect(methods).toHaveLength(1)
    expect(methods[0]?.name).toBe('processData')
    expect(methods[0]?.parameters).toEqual(['input', 'options', 'callback'])
  })

  it('should extract methods with destructured parameters', () => {
    const code = `
      const handleData = ({ title, count }, options) => {
        return { title, count, options }
      }
    `

    const methods = extractMethodsFromCode(code)

    expect(methods).toHaveLength(1)
    expect(methods[0]?.name).toBe('handleData')
    expect(methods[0]?.parameters).toEqual(['{ title, count }', 'options'])
  })

  it('should not extract duplicate methods', () => {
    // Create a mock result with an existing method
    const result: {
      methods?: Array<CoralMethodType>
      stateHooks?: Array<CoralStateType>
    } = {
      methods: [
        {
          name: 'handleClick',
          parameters: [],
          body: 'console.log("first")',
          stateInteractions: {
            reads: [],
            writes: []
          }
        }
      ],
      stateHooks: []
    }

    const code = `
      const handleClick = () => console.log('second')
    `

    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    })

    traverse(ast, {
      VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
        extractMethods(path, result)
      }
    })

    // Should not add the duplicate method
    expect(result.methods).toHaveLength(1)
    expect(result.methods?.[0]?.body).toContain('first') // Original should remain
  })

  it('should skip non-function variable declarations', () => {
    const code = `
      const data = { title: 'test' }
      const count = 42
      const isVisible = true
    `

    const methods = extractMethodsFromCode(code)

    expect(methods).toHaveLength(0)
  })

  it('should handle methods with state interactions', () => {
    const code = `
      const updateCounter = () => {
        setCount(count + 1)
      }
    `

    // Create a mock result with state hooks
    const result: {
      methods?: Array<CoralMethodType>
      stateHooks?: Array<CoralStateType>
    } = {
      methods: [],
      stateHooks: [
        {
          name: 'count',
          setterName: 'setCount',
          initialValue: 0,
          tsType: 'number'
        }
      ]
    }

    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    })

    traverse(ast, {
      VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
        extractMethods(path, result)
      }
    })

    expect(result.methods).toHaveLength(1)
    expect(result.methods?.[0]?.name).toBe('updateCounter')
    expect(result.methods?.[0]?.stateInteractions).toBeDefined()
  })
})