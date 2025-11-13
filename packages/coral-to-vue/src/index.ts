import type { CoralRootNode } from '@reallygoodwork/coral-core'

import type { Options } from './types'
import { generateComponent } from './generateComponent'

/**
 * Converts a Coral specification to Vue 3 component code
 * @param spec - Coral root node specification
 * @param options - Generation options
 * @returns Vue component code string (or Promise if prettier option is enabled)
 */
export async function coralToVue(spec: CoralRootNode, options?: Options): Promise<string> {
  return generateComponent(spec, options)
}

export type { Options } from './types'
export { generateComponent } from './generateComponent'
export { generateImports, getRequiredVueImports } from './generateImports'
export { generateProps, generatePropsInterface } from './generateProps'
export { generateStateDeclarations, generateState } from './generateState'
export { generateMethods, generateMethod } from './generateMethods'
export { stylesToInlineStyle, stylesToClassName } from './convertStyles'
export { generateTemplateElement } from './generateTemplate'
