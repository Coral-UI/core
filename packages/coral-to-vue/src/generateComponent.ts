import type { CoralRootNode } from '@reallygoodwork/coral-core'

import type { Options } from './types'
import { generateImports, getRequiredVueImports } from './generateImports'
import { generateMethods } from './generateMethods'
import { generateProps, generatePropsInterface } from './generateProps'
import { generateStateDeclarations } from './generateState'
import { generateTemplateElement } from './generateTemplate'

/**
 * Generates a Vue component from a Coral specification
 * @param spec - Coral root node specification
 * @param options - Generation options
 * @returns Vue component code string
 */
export async function generateComponent(spec: CoralRootNode, options: Options = {}): Promise<string> {
  const { includeTypes = true, indentSize = 2, prettier: usePrettier = false } = options

  const componentName = spec.componentName || spec.name || 'Component'
  const indentStr = ' '.repeat(indentSize)

  // Determine which Vue APIs are needed
  const hasState = Boolean(spec.stateHooks && spec.stateHooks.length > 0)
  const hasComputed = Boolean(spec.stateHooks?.some((s) => s.hookType === 'useMemo'))
  const hasWatch = Boolean(spec.stateHooks?.some((s) => s.hookType === 'useEffect'))

  // Generate Vue imports
  const vueImports = getRequiredVueImports(hasState, hasComputed, hasWatch)
  const vueImportsStr = vueImports.length > 0 ? `import { ${vueImports.join(', ')} } from 'vue'` : ''

  // Generate custom imports
  const customImports = generateImports(spec.imports)

  // Combine imports
  const allImports: string[] = []
  if (vueImportsStr) {
    allImports.push(vueImportsStr)
  }
  if (customImports) {
    allImports.push(customImports)
  }
  const importsSection = allImports.length > 0 ? allImports.join('\n') : ''

  // Generate props interface (if types are included)
  const propsInterface = includeTypes ? generatePropsInterface(spec.componentProperties, componentName) : ''

  // Generate props
  const props = generateProps(spec.componentProperties, componentName, includeTypes)

  // Generate state declarations
  const stateDeclarations = generateStateDeclarations(spec.stateHooks)

  // Generate methods
  const methods = generateMethods(spec.methods)

  // Generate template
  const template = generateTemplateElement(spec, 0)

  // Build component
  const parts: string[] = []

  // Script section
  parts.push('<script setup lang="ts">')

  if (importsSection) {
    parts.push(importsSection)
  }

  if (propsInterface) {
    parts.push('')
    parts.push(propsInterface)
  }

  if (props) {
    if (propsInterface || importsSection) {
      parts.push('')
    }
    parts.push(props)
  }

  if (stateDeclarations) {
    parts.push('')
    parts.push(
      stateDeclarations
        .split('\n')
        .map((line) => `${indentStr}${line}`)
        .join('\n'),
    )
  }

  if (methods) {
    parts.push('')
    parts.push(
      methods
        .split('\n')
        .map((line) => `${indentStr}${line}`)
        .join('\n'),
    )
  }

  parts.push('</script>')
  parts.push('')
  parts.push('<template>')
  parts.push(
    template
      .split('\n')
      .map((line) => `${indentStr}${line}`)
      .join('\n'),
  )
  parts.push('</template>')

  const code = parts.join('\n')

  // Format with Prettier if requested
  // Note: Prettier standalone doesn't support Vue parser
  // Use regular prettier with @prettier/plugin-vue if formatting is needed
  if (usePrettier) {
    try {
      // Try to use regular prettier (not standalone) if available
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const prettier = require('prettier')
      return await prettier.format(code, {
        parser: 'vue',
        semi: true,
        singleQuote: true,
        tabWidth: indentSize,
        trailingComma: 'es5',
        arrowParens: 'always',
      })
    } catch (error) {
      // If Prettier fails (plugin not installed or other error), return unformatted code
      console.warn('Prettier formatting failed. Install @prettier/plugin-vue for Vue formatting:', error)
      return code
    }
  }

  return code
}
