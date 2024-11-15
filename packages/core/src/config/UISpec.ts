type GenericFunction = {
  (): void // Function with no arguments
  <T>(arg: T): void // Generic function with one argument of type T
}

export type TS_TYPES = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'function' | null

export type Color = {
  hex: string
  rgb: { r: number; g: number; b: number; a: number }
  hsl: { h: number; s: number; l: number; a: number }
}

export type GradientType = {
  type: string
  colors: Array<{
    color: Color
    position: number
  }>
}

export type Styles = Record<
  string,
  | string
  | number
  | GradientType
  | Color
  | Record<string, string | number | GradientType | Color | Record<string, string | number | GradientType | Color>>
> | null

export type PropTypes = 'method' | 'state' | 'prop' | 'any'

export type DesignToken = {
  tokenName: string
  fallbackValue: string | number | Color
}

export type ComponentProperty = Record<string, string | { type: string; value: string | boolean }>

export type Variant = {
  elementType: string
  figmaNodeRef: string | null
  boundProperties?: Record<
    string,
    {
      propertyName: string | null
      type: string | number | boolean | Array<string> | Record<string, unknown> | GenericFunction | null
    }
  >
  styles: Styles
  options: Record<string, unknown> | null
}

export type Method = {
  name: string
  params: Array<string | { name: string; tsType?: TS_TYPES; defaultValue: string | number | boolean | null }>
  body: string
  tsType?: TS_TYPES
  stateInteractions: {
    reads: string[]
    writes: string[]
  }
}

export type StateHook = {
  name: string
  setterName: string
  initialValue:
    | 'string'
    | 'number'
    | 'boolean'
    | 'undefined'
    | 'object'
    | 'function'
    | 'null'
    | 'array'
    | null
    | undefined
  tsType?: TS_TYPES
}

export type Import = {
  source: string
  specifiers: Array<{ name: string; isDefault: boolean; version: string }>
}

export type Dependency = {
  name: string
  version: string | null
  path: string
}

export type CoralNode = {
  name: string
  type?: 'node' | 'component' | 'componentSet'
  figmaNodeRef?: string
  elementType: string
  elementAttributes?: Record<string, string | number | boolean | string[]> | null | undefined
  description?: string
  hasBackgroundImage?: boolean
  isComponent?: boolean
  componentProperties?: ComponentProperty | null
  styles: Styles
  variants?: Array<Variant>
  tsType?: TS_TYPES
  textContent?: string | null
  children?: Array<CoralNode>
}

export type RootNode = CoralNode & {
  methods?: Array<Method>
  stateHooks?: Array<StateHook>
  imports?: Array<Import>
  importSource?: string
  componentName?: string
  config?: Record<string, unknown>
  dependencies?: Array<Dependency>
  designTokens?: Record<string, DesignToken>
}
