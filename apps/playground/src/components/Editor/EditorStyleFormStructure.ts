import { z } from 'zod'

import { AppearanceComponents, AppearanceGroups, zAppearanceSchema } from './Appearance'
import { LayoutComponents, LayoutGroups, zLayoutSchema } from './Layout'
import { PositionComponents, zPositionSchema } from './Position'
import { SpacingComponents, SpacingGroups, zSpacingSchema } from './Spacing'

export const zStyleFormSchema = z.object({
  ...zLayoutSchema.shape,
  ...zSpacingSchema.shape,
  ...zAppearanceSchema.shape,
  ...zPositionSchema.shape,
})

export type StyleFormSchema = z.infer<typeof zStyleFormSchema>

export const StyleFormDefaultValues: StyleFormSchema = [
  ...LayoutComponents,
  ...SpacingComponents,
  ...AppearanceComponents,
  ...PositionComponents,
].reduce((acc, component) => {
  // @ts-expect-error - Dynamic property assignment incompatible with exactOptionalPropertyTypes
  acc[component.name as keyof StyleFormSchema] = component.defaultValue
  return acc
}, {} as StyleFormSchema)

// Define component types
type BaseComponent = {
  label: string
  name: string
  defaultValue: unknown
  icon?: React.ComponentType<{ className?: string }>
  iconClassName?: string
  showWhen?: {
    field: string
    values: string[]
  }
}

type InputComponent = BaseComponent & {
  type: 'input'
  inputType: 'text' | 'number' | 'email' | 'password' | 'url' | 'search' | 'color'
  placeholder: string
  min?: number
}

type SelectComponent = BaseComponent & {
  type: 'select'
  options: { label: string; value: string }[]
  placeholder?: string
}

type InputWithOptionsComponent = BaseComponent & {
  type: 'inputWithOptions'
  inputType: 'text' | 'number' | 'email' | 'password' | 'url' | 'search'
  placeholder: string
  selectName: string
  selectLabel?: string
  options: { label: string; value: string }[]
}

type FormComponent = InputComponent | SelectComponent | InputWithOptionsComponent

type ComponentGroup = {
  legend?: string
  components: FormComponent[]
}

export const StyleFormComponents: {
  label: string
  components?: FormComponent[]
  groups?: ComponentGroup[]
}[] = [
  {
    label: 'Layout',
    groups: LayoutGroups as ComponentGroup[],
  },
  {
    label: 'Spacing',
    groups: SpacingGroups as ComponentGroup[],
  },
  {
    label: 'Appearance',
    groups: AppearanceGroups as ComponentGroup[],
  },
  {
    label: 'Position',
    components: PositionComponents as FormComponent[],
  },
]
