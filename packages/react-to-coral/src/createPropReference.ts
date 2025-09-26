import { PropReference } from '@/transformReactComponentToSpec'

import type { CoralComponentPropertyType, CoralMethodType, CoralStateType } from '@reallygoodwork/coral-core'

export const createPropReference = (
  value: string,
  result: {
    methods?: Array<CoralMethodType>
    stateHooks?: Array<CoralStateType>
    componentProperties?: Array<CoralComponentPropertyType>
  },
): PropReference => {
  if (result.methods && result.methods.some((m) => m.name === value)) {
    return { type: 'method', value }
  } else if (result.stateHooks && result.stateHooks.some((s) => s.name === value)) {
    return { type: 'state', value }
  } else if (
    result.componentProperties &&
    result.componentProperties.some((p) => Object.keys(p).some((key) => key === value))
  ) {
    return { type: 'prop', value }
  }
  // If it's not found, we'll assume it's a prop
  return { type: 'prop', value }
}
