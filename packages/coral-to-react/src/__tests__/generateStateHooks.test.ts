import type { CoralStateType } from '@reallygoodwork/coral-core'

import { generateStateHook, generateStateHooks } from '../generateStateHooks'

describe('generateStateHooks', () => {
  it('should return empty string when no hooks provided', () => {
    const result = generateStateHooks()
    expect(result).toBe('')
  })

  it('should generate useState hook', () => {
    const state: CoralStateType = {
      name: 'count',
      setterName: 'setCount',
      tsType: 'number',
      initialValue: 0,
    }

    const result = generateStateHook(state)
    expect(result).toBe('const [count, setCount] = useState<number>(0)')
  })

  it('should generate useState with string initial value', () => {
    const state: CoralStateType = {
      name: 'name',
      setterName: 'setName',
      tsType: 'string',
      initialValue: 'John',
    }

    const result = generateStateHook(state)
    expect(result).toBe("const [name, setName] = useState<string>('John')")
  })

  it('should generate useState with boolean initial value', () => {
    const state: CoralStateType = {
      name: 'isOpen',
      setterName: 'setIsOpen',
      tsType: 'boolean',
      initialValue: false,
    }

    const result = generateStateHook(state)
    expect(result).toBe('const [isOpen, setIsOpen] = useState<boolean>(false)')
  })

  it('should generate useEffect hook', () => {
    const state: CoralStateType = {
      name: 'effect',
      setterName: 'setEffect',
      tsType: 'function',
      hookType: 'useEffect',
      dependencies: 'count, name',
    }

    const result = generateStateHook(state)
    expect(result).toContain('useEffect')
    expect(result).toContain('[count, name]')
  })

  it('should generate useReducer hook', () => {
    const state: CoralStateType = {
      name: 'state',
      setterName: 'dispatch',
      tsType: 'object',
      hookType: 'useReducer',
      reducer: 'reducer',
      initialValue: {},
    }

    const result = generateStateHook(state)
    expect(result).toContain('useReducer')
    expect(result).toContain('reducer')
  })

  it('should generate multiple hooks', () => {
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

    const result = generateStateHooks(hooks)
    expect(result).toContain('const [count, setCount]')
    expect(result).toContain('const [name, setName]')
  })
})
