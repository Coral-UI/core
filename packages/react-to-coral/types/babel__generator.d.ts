declare module '@babel/generator' {
  import * as t from '@babel/types'

  export interface GeneratorOptions {
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
    jsescOption?: {
      quotes?: 'single' | 'double'
      numbers?: 'binary' | 'octal' | 'decimal' | 'hexadecimal'
      wrap?: boolean
      es6?: boolean
    }
    jsonCompatibleStrings?: boolean
    decoratorsBeforeExport?: boolean
    topicToken?: string
  }

  export interface GeneratorResult {
    code: string
    map?: object
    rawMappings?: object[]
  }

  export interface Generator {
    generate(): GeneratorResult
  }

  function generate(ast: t.Node, options?: GeneratorOptions, source?: string): GeneratorResult
  export default generate
  export { generate }
}