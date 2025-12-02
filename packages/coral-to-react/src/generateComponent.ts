import * as parserBabel from 'prettier/parser-babel'
import * as prettier from 'prettier/standalone'

import type { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import type { Options } from './types'
import { generateCSS } from './generateCSS'
import { generateImports } from './generateImports'
import { generateJSXElement } from './generateJSXElement'
import { generateMethods } from './generateMethods'
import { generatePropsInterface } from './generatePropsInterface'
import { generateStateHooks } from './generateStateHooks'

/**
 * Generates a React component from a Coral specification
 * @param spec - Coral root node specification
 * @param options - Generation options
 * @returns Object with reactCode and cssCode strings
 */
export async function generateComponent(
  spec: CoralRootNode,
  options: Options = {},
): Promise<{ reactCode: string; cssCode: string }> {
  const {
    componentFormat = 'function',
    styleFormat = 'inline',
    includeTypes = true,
    indentSize = 2,
    prettier: usePrettier = false,
  } = options

  const componentName = spec.componentName || spec.name || 'Component'
  const indentStr = ' '.repeat(indentSize)
  const useCSS = styleFormat === 'className'

  // Generate ID mapping for CSS classes (shared between CSS and JSX generation)
  const idMapping = new Map<CoralNode, string>()

  // Generate CSS if using className format
  let cssContent = ''
  if (useCSS) {
    cssContent = generateCSS(spec, idMapping)
  }

  // Generate imports
  const imports = generateImports(spec.imports)

  // Generate props interface
  const propsInterface = includeTypes ? generatePropsInterface(spec.componentProperties, componentName) : ''

  // Generate state hooks
  const stateHooks = generateStateHooks(spec.stateHooks)

  // Generate methods
  const methods = generateMethods(spec.methods)

  // Generate JSX (using same ID mapping so classes match)
  const jsx = generateJSXElement(spec, 0, idMapping)

  // Build component
  const parts: string[] = [imports]

  // Add CSS import if using CSS classes
  if (useCSS && cssContent) {
    parts.push(`import './${componentName}.css'`)
  }

  if (propsInterface) {
    parts.push('')
    parts.push(propsInterface)
  }

  parts.push('')

  if (componentFormat === 'arrow') {
    // Arrow function component
    const propsType = includeTypes && propsInterface ? `: ${componentName}Props` : ''
    const hasProps = spec.componentProperties && Object.keys(spec.componentProperties).length > 0
    const propsParam = hasProps ? (includeTypes && propsInterface ? `props${propsType}` : 'props') : ''
    const componentStart = `export const ${componentName} = (${propsParam}) => {`
    parts.push(componentStart)

    if (stateHooks) {
      parts.push(
        stateHooks
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

    parts.push('')
    parts.push(`${indentStr}return (`)
    parts.push(
      jsx
        .split('\n')
        .map((line) => `${indentStr}${indentStr}${line.trimStart()}`)
        .join('\n'),
    )
    parts.push(`${indentStr})`)
    parts.push('}')
  } else {
    // Function declaration component
    const propsType = includeTypes && propsInterface ? `: ${componentName}Props` : ''
    const hasProps = spec.componentProperties && Object.keys(spec.componentProperties).length > 0
    const propsParam = hasProps ? (includeTypes && propsInterface ? `props${propsType}` : 'props') : ''
    const componentStart = `export function ${componentName}(${propsParam}) {`
    parts.push(componentStart)

    if (stateHooks) {
      parts.push(
        stateHooks
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

    parts.push('')
    parts.push(`${indentStr}return (`)
    parts.push(
      jsx
        .split('\n')
        .map((line) => `${indentStr}${indentStr}${line.trimStart()}`)
        .join('\n'),
    )
    parts.push(`${indentStr})`)
    parts.push('}')
  }

  const code = parts.join('\n')

  // Format with Prettier if requested
  let formattedCode = code
  if (usePrettier) {
    try {
      formattedCode = await prettier.format(code, {
        parser: 'babel-ts',
        plugins: [parserBabel],
        semi: true,
        singleQuote: true,
        tabWidth: indentSize,
        trailingComma: 'es5',
        arrowParens: 'always',
      })
    } catch (error) {
      // If Prettier fails, return unformatted code
      console.warn('Prettier formatting failed:', error)
      formattedCode = code
    }
  }

  return {
    reactCode: formattedCode,
    cssCode: cssContent,
  }
}
