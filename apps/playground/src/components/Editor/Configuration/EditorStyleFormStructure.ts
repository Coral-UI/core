import type {
  FormComponent,
  GroupedComponent,
  InputWithOptionsComponent,
  StyleSection,
} from '@/components/Editor/types'
import { AppearanceGroups, zAppearanceSchema } from '@/components/Editor/FormSchema/Appearance'
import { LayoutGroups, zLayoutSchema } from '@/components/Editor/FormSchema/Layout'
import { PositionComponents, zPositionSchema } from '@/components/Editor/FormSchema/Position'
import { SpacingGroups, zSpacingSchema } from '@/components/Editor/FormSchema/Spacing'
import { TypographyGroup, zTypographySchema } from '@/components/Editor/FormSchema/Typography'
import { z } from 'zod'

export const zStyleFormSchema = z.object({
  // Typography
  ...zTypographySchema.shape,
  ...zLayoutSchema.shape,
  ...zSpacingSchema.shape,
  ...zAppearanceSchema.shape,
  ...zPositionSchema.shape,
})

export type StyleFormSchema = z.infer<typeof zStyleFormSchema>

/**
 * Type for flattened component with name and default value
 */
type FlattenedComponent = {
  name: string
  defaultValue: string | number | boolean
}

/**
 * Flatten all components including nested groups
 * Extracts form fields from grouped components and handles special cases like inputWithOptions
 */
const flattenComponents = (components: (FormComponent | GroupedComponent)[]): FlattenedComponent[] => {
  return components.flatMap((component) => {
    if ('groups' in component) {
      // This is a GroupedComponent
      return component.groups.flatMap((group: FormComponent) => {
        // For inputWithOptions, we need to extract both the input field and the select field
        if (group.type === 'inputWithOptions') {
          const inputWithOptions = group as InputWithOptionsComponent
          return [
            { name: inputWithOptions.name, defaultValue: inputWithOptions.defaultValue },
            { name: inputWithOptions.selectName, defaultValue: inputWithOptions.options?.[0]?.value || 'px' },
          ]
        }
        return { name: group.name, defaultValue: group.defaultValue }
      })
    }
    // This is a FormComponent
    return { name: component.name, defaultValue: component.defaultValue }
  })
}

const allComponents = flattenComponents([
  ...TypographyGroup,
  ...LayoutGroups,
  // ...SpacingComponents,
  ...AppearanceGroups,
  ...PositionComponents,
])

export const StyleFormDefaultValues: StyleFormSchema = allComponents.reduce((acc, component) => {
  // Type assertion is safe here because we know all flattened components
  // come from the form schema definitions
  ;(acc as Record<string, string | number | boolean>)[component.name] = component.defaultValue
  return acc
}, {} as StyleFormSchema)

export const StyleFormComponents: StyleSection[] = [
  {
    label: 'Typography',
    components: TypographyGroup,
  },
  {
    label: 'Layout',
    components: LayoutGroups,
  },
  {
    label: 'Spacing',
    components: SpacingGroups,
  },
  {
    label: 'Appearance',
    components: AppearanceGroups,
  },
  {
    label: 'Position',
    components: PositionComponents,
  },
]
