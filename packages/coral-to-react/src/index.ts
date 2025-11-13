import type { CoralRootNode } from '@reallygoodwork/coral-core'

import type { Options } from './types'
import { generateComponent } from './generateComponent'

/**
 * Converts a Coral specification to React component code
 * @param spec - Coral root node specification
 * @param options - Generation options
 * @returns React component code string (or Promise if prettier option is enabled)
 */
export async function coralToReact(spec: CoralRootNode, options?: Options): Promise<string> {
  return generateComponent(spec, options)
}

export type { Options } from './types'
export { generateComponent } from './generateComponent'
export { generateImports } from './generateImports'
export { generatePropsInterface } from './generatePropsInterface'
export { generateStateHooks, generateStateHook } from './generateStateHooks'
export { generateMethods, generateMethod } from './generateMethods'
export { stylesToInlineStyle, stylesToClassName } from './convertStyles'
export { generateJSXElement } from './generateJSXElement'
