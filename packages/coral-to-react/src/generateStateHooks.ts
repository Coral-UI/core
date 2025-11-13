import type { CoralStateType, CoralTSTypes } from '@reallygoodwork/coral-core'

/**
 * Converts Coral TypeScript type to TypeScript type string
 */
function tsTypeToString(tsType: CoralTSTypes | CoralTSTypes[]): string {
  if (Array.isArray(tsType)) {
    return tsType.map(tsTypeToString).join(' | ')
  }
  if (tsType === null || tsType === undefined) {
    return 'unknown'
  }
  return tsType
}

/**
 * Converts initial value to string representation
 */
function initialValueToString(value: unknown): string {
  if (value === undefined || value === null) {
    return 'undefined'
  }
  if (typeof value === 'string') {
    return `'${value}'`
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value)
  }
  if (Array.isArray(value)) {
    return '[]'
  }
  if (typeof value === 'object') {
    return '{}'
  }
  return String(value)
}

/**
 * Generates a single state hook declaration
 * @param state - State hook specification
 * @returns State hook code string
 */
export function generateStateHook(state: CoralStateType): string {
  const hookType = state.hookType || 'useState'
  const typeStr = tsTypeToString(state.tsType)
  const initialValue = initialValueToString(state.initialValue)

  switch (hookType) {
    case 'useState': {
      return `const [${state.name}, ${state.setterName}] = useState<${typeStr}>(${initialValue})`
    }
    case 'useEffect': {
      const deps = state.dependencies ? `[${state.dependencies}]` : '[]'
      return `useEffect(() => {\n    // ${state.name}\n  }, ${deps})`
    }
    case 'useReducer': {
      if (state.reducer) {
        return `const [${state.name}, dispatch] = useReducer(${state.reducer}, ${initialValue})`
      }
      return `const [${state.name}, dispatch] = useReducer(() => {}, ${initialValue})`
    }
    case 'useMemo': {
      const deps = state.dependencies ? `[${state.dependencies}]` : '[]'
      return `const ${state.name} = useMemo(() => {\n    // ${state.name}\n    return ${initialValue}\n  }, ${deps})`
    }
    case 'useCallback': {
      const deps = state.dependencies ? `[${state.dependencies}]` : '[]'
      return `const ${state.name} = useCallback(() => {\n    // ${state.name}\n  }, ${deps})`
    }
    case 'useContext': {
      return `const ${state.name} = useContext(${state.name}Context)`
    }
    default: {
      return `const [${state.name}, ${state.setterName}] = useState<${typeStr}>(${initialValue})`
    }
  }
}

/**
 * Generates all state hooks declarations
 * @param stateHooks - Array of state hook specifications
 * @returns State hooks code string
 */
export function generateStateHooks(stateHooks?: CoralStateType[]): string {
  if (!stateHooks || stateHooks.length === 0) {
    return ''
  }

  // Separate useState hooks from other hooks
  const useStateHooks = stateHooks.filter((s) => !s.hookType || s.hookType === 'useState')
  const otherHooks = stateHooks.filter((s) => s.hookType && s.hookType !== 'useState')

  const lines: string[] = []

  // Generate useState hooks first
  for (const hook of useStateHooks) {
    lines.push(generateStateHook(hook))
  }

  // Generate other hooks
  for (const hook of otherHooks) {
    lines.push(generateStateHook(hook))
  }

  return lines.join('\n')
}
