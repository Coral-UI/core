import type { CoralStateType } from '@reallygoodwork/coral-core'

import { generateState, generateStateDeclarations } from '../generateState'

describe('generateStateDeclarations', () => {
  it('should return empty string when no hooks provided', () => {
    const result = generateStateDeclarations()
    expect(result).toBe('')
  })

  it('should generate ref for useState hook', () => {
    const state: CoralStateType = {
      name: 'count',
      setterName: 'setCount',
      tsType: 'number',
      initialValue: 0,
    }

    const result = generateState(state)
    expect(result).toBe('const count = ref<number>(0)')
  })

  it('should generate ref with string initial value', () => {
    const state: CoralStateType = {
      name: 'name',
      setterName: 'setName',
      tsType: 'string',
      initialValue: 'John',
    }

    const result = generateState(state)
    expect(result).toBe("const name = ref<string>('John')")
  })

  it('should generate ref with boolean initial value', () => {
    const state: CoralStateType = {
      name: 'isOpen',
      setterName: 'setIsOpen',
      tsType: 'boolean',
      initialValue: false,
    }

    const result = generateState(state)
    expect(result).toBe('const isOpen = ref<boolean>(false)')
  })

  it('should generate watchEffect for useEffect hook without dependencies', () => {
    const state: CoralStateType = {
      name: 'effect',
      setterName: 'setEffect',
      tsType: 'function',
      hookType: 'useEffect',
    }

    const result = generateState(state)
    expect(result).toContain('watchEffect')
  })

  it('should generate watch for useEffect hook with dependencies', () => {
    const state: CoralStateType = {
      name: 'effect',
      setterName: 'setEffect',
      tsType: 'function',
      hookType: 'useEffect',
      dependencies: 'count, name',
    }

    const result = generateState(state)
    expect(result).toContain('watch')
    expect(result).toContain('count')
    expect(result).toContain('name')
  })

  it('should generate reactive for useReducer hook', () => {
    const state: CoralStateType = {
      name: 'state',
      setterName: 'dispatch',
      tsType: 'object',
      hookType: 'useReducer',
      reducer: 'reducer',
      initialValue: {},
    }

    const result = generateState(state)
    expect(result).toContain('reactive')
  })

  it('should generate computed for useMemo hook', () => {
    const state: CoralStateType = {
      name: 'computedValue',
      setterName: 'setComputedValue',
      tsType: 'number',
      hookType: 'useMemo',
      initialValue: 0,
    }

    const result = generateState(state)
    expect(result).toContain('computed')
  })

  it('should generate function for useCallback hook', () => {
    const state: CoralStateType = {
      name: 'callback',
      setterName: 'setCallback',
      tsType: 'function',
      hookType: 'useCallback',
    }

    const result = generateState(state)
    expect(result).toContain('const callback = () =>')
  })

  it('should generate inject for useContext hook', () => {
    const state: CoralStateType = {
      name: 'theme',
      setterName: 'setTheme',
      tsType: 'object',
      hookType: 'useContext',
    }

    const result = generateState(state)
    expect(result).toContain('inject')
  })

  it('should generate multiple state declarations', () => {
    const hooks: CoralStateType[] = [
      {
        name: 'count',
        setterName: 'setCount',
        tsType: 'number',
        initialValue: 0,
      },
      {
        name: 'name',
        setterName: 'setName',
        tsType: 'string',
        initialValue: '',
      },
    ]

    const result = generateStateDeclarations(hooks)
    expect(result).toContain('const count = ref<number>(0)')
    expect(result).toContain("const name = ref<string>('')")
  })
})
