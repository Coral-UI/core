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
 * Generates a single state declaration for Vue
 * @param state - State hook specification
 * @returns State declaration code string
 */
export function generateState(state: CoralStateType): string {
  const hookType = state.hookType || 'useState'
  const typeStr = tsTypeToString(state.tsType)
  const initialValue = initialValueToString(state.initialValue)

  switch (hookType) {
    case 'useState': {
      // useState(0) → const count = ref(0)
      return `const ${state.name} = ref<${typeStr}>(${initialValue})`
    }
    case 'useEffect': {
      // useEffect(() => {}, [deps]) → watchEffect(() => {}) or watch(..., () => {})
      const deps = state.dependencies
      if (deps && deps.trim().length > 0) {
        // Use watch() when dependencies are specified
        // Dependencies is a string like "count, name"
        return `watch([${deps}], () => {\n    // ${state.name}\n  })`
      } else {
        // Use watchEffect() when no dependencies
        return `watchEffect(() => {\n    // ${state.name}\n  })`
      }
    }
    case 'useReducer': {
      // useReducer(reducer, initialState) → reactive() or custom composable
      if (state.reducer) {
        return `const ${state.name} = reactive(${state.reducer}(${initialValue}))`
      }
      return `const ${state.name} = reactive<${typeStr}>(${initialValue})`
    }
    case 'useMemo': {
      // useMemo(() => value, [deps]) → computed(() => value)
      return `const ${state.name} = computed<${typeStr}>(() => {\n    // ${state.name}\n    return ${initialValue}\n  })`
    }
    case 'useCallback': {
      // useCallback(() => {}, [deps]) → regular function (Vue handles optimization)
      return `const ${state.name} = () => {\n    // ${state.name}\n  }`
    }
    case 'useContext': {
      // useContext(Context) → inject(key)
      const contextName = state.name.replace(/Context$/, '') || state.name
      return `const ${state.name} = inject<${typeStr}>('${contextName}')`
    }
    default: {
      // Default to ref for unknown hook types
      return `const ${state.name} = ref<${typeStr}>(${initialValue})`
    }
  }
}

/**
 * Generates all state declarations
 * @param stateHooks - Array of state hook specifications
 * @returns State declarations code string
 */
export function generateStateDeclarations(stateHooks?: CoralStateType[]): string {
  if (!stateHooks || stateHooks.length === 0) {
    return ''
  }

  // Separate useState hooks from other hooks
  const useStateHooks = stateHooks.filter((s) => !s.hookType || s.hookType === 'useState')
  const otherHooks = stateHooks.filter((s) => s.hookType && s.hookType !== 'useState')

  const lines: string[] = []

  // Generate useState hooks first (ref)
  for (const hook of useStateHooks) {
    lines.push(generateState(hook))
  }

  // Generate other hooks
  for (const hook of otherHooks) {
    lines.push(generateState(hook))
  }

  return lines.join('\n')
}
