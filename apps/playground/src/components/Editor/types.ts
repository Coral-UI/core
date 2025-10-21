import { Icon } from '@tabler/icons-react'

// Base component shared properties
export type BaseComponent = {
  label: string
  name: string
  defaultValue: unknown
  icon?: typeof Icon
  iconClassName?: string
  showWhen?: {
    field: string
    values: string[]
  }
}

// Input component type
export type InputComponent = BaseComponent & {
  type: 'input'
  inputType: 'text' | 'number' | 'email' | 'password' | 'url' | 'search' | 'color'
  placeholder: string
  min?: number
  hideLabel?: boolean
}

// Select component type
export type SelectComponent = BaseComponent & {
  type: 'select'
  options: { label: string | number; value: string }[]
  placeholder?: string
  hideLabel?: boolean
}

// Input with options component type
export type InputWithOptionsComponent = BaseComponent & {
  type: 'inputWithOptions'
  inputType: 'text' | 'number' | 'email' | 'password' | 'url' | 'search'
  placeholder: string
  selectName: string
  selectLabel?: string
  options: { label: string | number; value: string }[]
  hideLabel?: boolean
}

// Color component type
export type ColorComponent = BaseComponent & {
  type: 'color'
  inputType: 'color'
  placeholder: string
  hideLabel?: boolean
}

// Toggle component type
export type ToggleComponent = BaseComponent & {
  type: 'toggle'
  options: { label: string; value: string; icon?: typeof Icon }[]
  hideLabel?: boolean
}

// Union of all form component types
export type FormComponent =
  | InputComponent
  | SelectComponent
  | InputWithOptionsComponent
  | ColorComponent
  | ToggleComponent

// Grouped component type (for components that have nested groups)
export type GroupedComponent = {
  name: string
  label?: string
  groups: FormComponent[]
}

// Component group type (for grouping multiple components with a legend)
export type ComponentGroup = {
  legend?: string
  components: FormComponent[]
}

// Style section type (top-level grouping like "Typography", "Layout", etc.)
export type StyleSection = {
  label: string
  components?: (FormComponent | GroupedComponent)[]
  groups?: ComponentGroup[]
}
