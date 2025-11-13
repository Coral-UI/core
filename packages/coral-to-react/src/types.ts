/**
 * Options for generating React components from Coral specifications
 */
export interface Options {
  /**
   * Component declaration style
   * @default 'function'
   */
  componentFormat?: 'function' | 'arrow'

  /**
   * How to output styles
   * @default 'inline'
   */
  styleFormat?: 'inline' | 'className'

  /**
   * Generate TypeScript types for props
   * @default true
   */
  includeTypes?: boolean

  /**
   * Indentation size in spaces
   * @default 2
   */
  indentSize?: number

  /**
   * Format output with Prettier
   * @default false
   */
  prettier?: boolean
}
