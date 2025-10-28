import { CoralComponentPropertyType } from '@reallygoodwork/coral-core'

import { normalizeName } from './utils/normalizeName'

export const transformComponentProperties = (node: ComponentPropertyDefinitions): CoralComponentPropertyType => {
  const componentProperties: CoralComponentPropertyType = {}

  for (const [key, value] of Object.entries(node)) {
    componentProperties[normalizeName(key)] = {
      type: value.variantOptions?.some((option) => option === 'true') ? 'boolean' : 'string',
      defaultValue: value.defaultValue === 'true' ? true : value.defaultValue === 'false' ? false : value.defaultValue,
      options: value.variantOptions?.map((option) => (option === 'true' ? true : option === 'false' ? false : option)),
    }
  }

  return componentProperties
}
