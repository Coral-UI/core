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
