type GenericFunction = {
  (): void // Function with no arguments
  <T>(arg: T): void // Generic function with one argument of type T
}

type TS_TYPES = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'function' | null

type Styles = Record<string, string | number | Record<string, string | number>> | null

export type ComponentProperty = Record<string, string | { type: 'method' | 'state' | 'prop'; name: string }>

export type Variant = {
  elementType: string
  figmaNodeRef: string | null
  boundProperties: {
    propertyName: string | null
    type: string | number | boolean | Array<string> | Record<string, unknown> | GenericFunction | null
  }
  styles: Styles
  options: Record<string, unknown> | null
}

export type Method = {
  name: string
  params: Array<string> | Array<{ name: string; tsType?: string; defaultValue: string }>
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
  initialValue: string | number | boolean | Record<string, unknown> | Array<unknown> | null
  tsType?: TS_TYPES
}

export type Import = {
  source: string
  specifiers: Array<{ name: string; isDefault: boolean }>
}

export type CoralNode = {
  name: string
  elementType: string
  elementAttributes?: Record<string, unknown> | null
  description?: string
  hasBackgroundImage?: boolean
  isComponent?: boolean
  componentProperties: ComponentProperty | null
  styles: Styles
  variants: Array<Variant>
  tsType?: TS_TYPES
  textContent?: string | null
  children?: Array<CoralNode>
}

export type RootNode = CoralNode & {
  methods: Array<Method>
  stateHooks: Array<StateHook>
  imports: Array<Import>
  importSource?: string
  componentName?: string
  config: Record<string, unknown>
}
