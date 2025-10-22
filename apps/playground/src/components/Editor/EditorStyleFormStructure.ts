import { z } from 'zod'

import { AppearanceGroups, zAppearanceSchema } from './Appearance'
import { LayoutGroups, zLayoutSchema } from './Layout'
import { PositionComponents, zPositionSchema } from './Position'
import { SpacingGroups, zSpacingSchema } from './Spacing'
import { TypographyGroup, zTypographySchema } from './Typography'
import type { StyleSection } from './types'

export const zStyleFormSchema = z.object({
  // Typography
  ...zTypographySchema.shape,
  ...zLayoutSchema.shape,
  ...zSpacingSchema.shape,
  ...zAppearanceSchema.shape,
  ...zPositionSchema.shape,
})

export type StyleFormSchema = z.infer<typeof zStyleFormSchema>

// Flatten all components including nested groups
const flattenComponents = (components: any[]): any[] => {
  return components.flatMap((component) => {
    if (component.groups) {
      return component.groups.flatMap((group: any) => {
        // For inputWithOptions, we need to extract both the input field and the select field
        if (group.type === 'inputWithOptions') {
          return [
            { name: group.name, defaultValue: group.defaultValue },
            { name: group.selectName, defaultValue: group.options?.[0]?.value || 'px' } // Default to 'px'
          ]
        }
        return group
      })
    }
    return component
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
  acc[component.name as keyof StyleFormSchema] = component.defaultValue
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
