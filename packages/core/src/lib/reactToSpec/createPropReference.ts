import { Methods } from '@/config/Methods'
import { Props } from '@/config/Props'
import { StateHooks } from '@/config/StateHooks'
import { PropReference } from '@/lib/reactToSpec/parseReactComponentToSpec'

export const createPropReference = (
  name: string,
  result: {
    methods: Methods
    stateHooks: StateHooks
    props: Props
  },
): PropReference => {
  if (result.methods.some((m) => m.name === name)) {
    return { type: 'method', name }
  } else if (result.stateHooks.some((s) => s.name === name)) {
    return { type: 'state', name }
  } else if (result.props && Object.keys(result.props).some((p) => p === name)) {
    return { type: 'prop', name }
  }
  // If it's not found, we'll assume it's a prop
  return { type: 'prop', name }
}
