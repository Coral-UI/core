declare module '@babel/generator' {
  import * as t from '@babel/types'

  interface GeneratorOptions {
    auxiliaryCommentBefore?: string
    auxiliaryCommentAfter?: string
    shouldPrintComment?: (comment: string) => boolean
    retainLines?: boolean
    retainFunctionParens?: boolean
    comments?: boolean
    compact?: boolean | 'auto'
    minified?: boolean
    concise?: boolean
    quotes?: 'single' | 'double'
    filename?: string
    sourceMaps?: boolean
    sourceRoot?: string
    sourceFileName?: string
  }

  interface GeneratorResult {
    code: string
    map?: any
  }

  function generate(ast: t.Node, options?: GeneratorOptions): GeneratorResult
  export default generate
}