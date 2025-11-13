import type { CoralComponentPropertyType, CoralTSTypes } from '@reallygoodwork/coral-core'

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
 * Generates TypeScript interface for component props
 * @param componentProperties - Component properties from Coral spec
 * @param componentName - Name of the component
 * @returns TypeScript interface string
 */
export function generatePropsInterface(
  componentProperties?: CoralComponentPropertyType,
  componentName?: string,
): string {
  if (!componentProperties || Object.keys(componentProperties).length === 0) {
    return ''
  }

  const interfaceName = componentName ? `${componentName}Props` : 'Props'
  const properties: string[] = []

  for (const [propName, propValue] of Object.entries(componentProperties)) {
    if (typeof propValue === 'object' && propValue !== null && 'type' in propValue) {
      const prop = propValue as {
        type?: CoralTSTypes | CoralTSTypes[]
        defaultValue?: unknown
        optional?: boolean
        description?: string
      }

      const typeStr = prop.type ? tsTypeToString(prop.type) : 'unknown'
      const optional = prop.optional !== false ? '?' : ''
      const description = prop.description ? ` // ${prop.description}` : ''

      properties.push(`  ${propName}${optional}: ${typeStr}${description}`)
    } else {
      // Simple value, infer type
      const typeStr =
        typeof propValue === 'object' && propValue !== null && 'value' in propValue
          ? typeof (propValue as { value: unknown }).value
          : typeof propValue
      properties.push(`  ${propName}?: ${typeStr}`)
    }
  }

  if (properties.length === 0) {
    return ''
  }

  return `interface ${interfaceName} {\n${properties.join('\n')}\n}`
}

/**
 * Generates Vue defineProps() call with TypeScript types
 * @param componentProperties - Component properties from Coral spec
 * @param componentName - Name of the component
 * @param includeTypes - Whether to include TypeScript types
 * @returns defineProps() call string
 */
export function generateProps(
  componentProperties?: CoralComponentPropertyType,
  componentName?: string,
  includeTypes: boolean = true,
): string {
  if (!componentProperties || Object.keys(componentProperties).length === 0) {
    return ''
  }

  if (includeTypes) {
    // Type-based declaration: defineProps<Props>()
    const interfaceName = componentName ? `${componentName}Props` : 'Props'
    return `const props = defineProps<${interfaceName}>()`
  } else {
    // Runtime declaration: defineProps({ ... })
    const propsObject: string[] = []

    for (const [propName, propValue] of Object.entries(componentProperties)) {
      if (typeof propValue === 'object' && propValue !== null && 'type' in propValue) {
        const prop = propValue as {
          type?: CoralTSTypes | CoralTSTypes[]
          defaultValue?: unknown
          optional?: boolean
        }

        // Convert Coral type to Vue prop type
        let vueType = 'String'
        if (prop.type) {
          const typeStr = Array.isArray(prop.type) ? prop.type[0] : prop.type
          if (typeStr === 'number') {
            vueType = 'Number'
          } else if (typeStr === 'boolean') {
            vueType = 'Boolean'
          } else if (typeStr === 'function') {
            vueType = 'Function'
          } else if (typeStr === 'object') {
            vueType = 'Object'
          } else if (typeStr === 'array') {
            vueType = 'Array'
          }
        }

        const required = prop.optional === false ? ', required: true' : ''
        propsObject.push(`    ${propName}: { type: ${vueType}${required} }`)
      } else {
        // Simple value, infer type
        const typeStr =
          typeof propValue === 'object' && propValue !== null && 'value' in propValue
            ? typeof (propValue as { value: unknown }).value
            : typeof propValue
        let vueType = 'String'
        if (typeStr === 'number') {
          vueType = 'Number'
        } else if (typeStr === 'boolean') {
          vueType = 'Boolean'
        }
        propsObject.push(`    ${propName}: ${vueType}`)
      }
    }

    if (propsObject.length === 0) {
      return ''
    }

    return `const props = defineProps({\n${propsObject.join(',\n')}\n})`
  }
}
