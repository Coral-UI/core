import type { CoralMethodType } from '@reallygoodwork/coral-core'

import { generateMethod, generateMethods } from '../generateMethods'

describe('generateMethods', () => {
  it('should return empty string when no methods provided', () => {
    const result = generateMethods()
    expect(result).toBe('')
  })

  it('should generate method without parameters', () => {
    const method: CoralMethodType = {
      name: 'handleClick',
      body: 'console.log("clicked")',
      parameters: [],
    }

    const result = generateMethod(method)
    expect(result).toContain('function handleClick()')
    expect(result).toContain('console.log("clicked")')
  })

  it('should generate method with string parameters', () => {
    const method: CoralMethodType = {
      name: 'handleClick',
      body: 'console.log("clicked")',
      parameters: ['event', 'id'],
    }

    const result = generateMethod(method)
    expect(result).toContain('function handleClick(event, id)')
  })

  it('should generate method with typed parameters', () => {
    const method: CoralMethodType = {
      name: 'handleSubmit',
      body: 'return true',
      parameters: [
        {
          name: 'data',
          tsType: 'object',
        },
        {
          name: 'callback',
          tsType: 'function',
        },
      ],
    }

    const result = generateMethod(method)
    expect(result).toContain('function handleSubmit(data: object, callback: function)')
  })

  it('should generate method with default values', () => {
    const method: CoralMethodType = {
      name: 'greet',
      body: 'console.log(name)',
      parameters: [
        {
          name: 'name',
          tsType: 'string',
          defaultValue: 'World',
        },
      ],
    }

    const result = generateMethod(method)
    expect(result).toContain('function greet(name: string = "World")')
  })

  it('should generate multiple methods', () => {
    const methods: CoralMethodType[] = [
      {
        name: 'handleClick',
        body: 'console.log("click")',
        parameters: [],
      },
      {
        name: 'handleSubmit',
        body: 'return true',
        parameters: ['data'],
      },
    ]

    const result = generateMethods(methods)
    expect(result).toContain('function handleClick()')
    expect(result).toContain('function handleSubmit(data)')
  })
})
