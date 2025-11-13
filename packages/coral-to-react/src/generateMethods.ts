import type { CoralMethodType } from '@reallygoodwork/coral-core'

/**
 * Generates a single method/function declaration
 * @param method - Method specification
 * @returns Method code string
 */
export function generateMethod(method: CoralMethodType): string {
  const params: string[] = []

  for (const param of method.parameters) {
    if (typeof param === 'string') {
      params.push(param)
    } else {
      const paramName = param.name
      const paramType = param.tsType ? `: ${param.tsType}` : ''
      const defaultValue = param.defaultValue !== undefined ? ` = ${JSON.stringify(param.defaultValue)}` : ''
      params.push(`${paramName}${paramType}${defaultValue}`)
    }
  }

  const paramsStr = params.join(', ')
  const body = method.body || '{}'

  return `function ${method.name}(${paramsStr}) {\n  ${body}\n}`
}

/**
 * Generates all method declarations
 * @param methods - Array of method specifications
 * @returns Methods code string
 */
export function generateMethods(methods?: CoralMethodType[]): string {
  if (!methods || methods.length === 0) {
    return ''
  }

  return methods.map(generateMethod).join('\n\n')
}
