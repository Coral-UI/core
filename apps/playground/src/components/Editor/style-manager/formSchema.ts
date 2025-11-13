import * as z from 'zod'

const unitOptions = z.enum(['px', 'em', 'rem', 'vh', 'vw', 'dvh', 'dvw', '%', 'auto'])

export const formSchema = z.object({
  backgroundColor: z
    .string()
    .min(1)
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color'),
  backgroundColorFormat: z.enum(['hex', 'rgb', 'hsl', 'hsb']),
  color: z
    .string()
    .min(1)
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color'),
  colorFormat: z.enum(['hex', 'rgb', 'hsl', 'hsb']),
  paddingInlineStart: z.number().min(0),
  paddingInlineStartUnit: unitOptions,
  paddingInlineEnd: z.number().min(0),
  paddingInlineEndUnit: unitOptions,
  paddingBlockStart: z.number().min(0),
  paddingBlockStartUnit: unitOptions,
  paddingBlockEnd: z.number().min(0),
  paddingBlockEndUnit: unitOptions,
  marginInlineStart: z.number().min(0),
  marginInlineStartUnit: unitOptions,
  marginInlineEnd: z.number().min(0),
  marginInlineEndUnit: unitOptions,
  marginBlockStart: z.number().min(0),
  marginBlockStartUnit: unitOptions,
  marginBlockEnd: z.number().min(0),
  marginBlockEndUnit: unitOptions,
  borderEnabled: z.boolean().optional(),
  borderInlineStartWidth: z.number().min(0).optional(),
  borderInlineStartWidthUnit: unitOptions.optional(),
  borderInlineEndWidth: z.number().min(0).optional(),
  borderInlineEndWidthUnit: unitOptions.optional(),
  borderBlockStartWidth: z.number().min(0).optional(),
  borderBlockStartWidthUnit: unitOptions.optional(),
  borderBlockEndWidth: z.number().min(0).optional(),
  borderBlockEndWidthUnit: unitOptions.optional(),
  borderInlineStartStyle: z
    .enum(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'])
    .optional(),
  borderInlineEndStyle: z
    .enum(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'])
    .optional(),
  borderBlockStartStyle: z
    .enum(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'])
    .optional(),
  borderBlockEndStyle: z.enum(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']).optional(),
  borderInlineStartColor: z
    .string()
    .min(1)
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color')
    .optional(),
  borderInlineEndColor: z
    .string()
    .min(1)
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color')
    .optional(),
  borderBlockStartColor: z
    .string()
    .min(1)
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color')
    .optional(),
  borderBlockEndColor: z
    .string()
    .min(1)
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color')
    .optional(),
  borderTopLeftRadius: z.number().min(0).optional(),
  borderTopLeftRadiusUnit: unitOptions.optional(),
  borderTopRightRadius: z.number().min(0).optional(),
  borderTopRightRadiusUnit: unitOptions.optional(),
  borderBottomRightRadius: z.number().min(0).optional(),
  borderBottomRightRadiusUnit: unitOptions.optional(),
  borderBottomLeftRadius: z.number().min(0).optional(),
  borderBottomLeftRadiusUnit: unitOptions.optional(),
  display: z.enum(['block', 'inline', 'inline-block', 'flex', 'grid', 'none']),
  flexDirection: z.enum(['row', 'row-reverse', 'column', 'column-reverse']),
  flexWrap: z.enum(['nowrap', 'wrap', 'wrap-reverse']),
  flexSize: z.number().min(0).optional(),
  flexSizeUnit: unitOptions.optional(),
  flexGrow: z.number().min(0).optional(),
  flexShrink: z.number().min(0).optional(),
  flexBasis: z.number().min(0).optional(),
  flexBasisUnit: unitOptions.optional(),
  alignItems: z.enum(['flex-start', 'flex-end', 'center', 'baseline', 'stretch']).optional(),
  justifyContent: z
    .enum(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'])
    .optional(),
  overflowEnabled: z.boolean().optional(),
  overflowX: z
    .enum(['visible', 'hidden', 'clip', 'scroll', 'auto', 'inherit', 'initial', 'revert', 'revert-layer', 'unset'])
    .optional(),
  overflowY: z
    .enum(['visible', 'hidden', 'clip', 'scroll', 'auto', 'inherit', 'initial', 'revert', 'revert-layer', 'unset'])
    .optional(),
  gap: z.number().min(0).optional(),
  gapUnit: unitOptions.optional(),
  width: z.number().min(0).optional(),
  widthUnit: unitOptions.optional(),
  height: z.number().min(0).optional(),
  heightUnit: unitOptions.optional(),
  minWidth: z.number().min(0).optional(),
  minWidthUnit: unitOptions.optional(),
  maxWidth: z.number().min(0).optional(),
  maxWidthUnit: unitOptions.optional(),
  minHeight: z.number().min(0).optional(),
  minHeightUnit: unitOptions.optional(),
  maxHeight: z.number().min(0).optional(),
  maxHeightUnit: unitOptions.optional(),
  // Typography fields - optional section
  typographyEnabled: z.boolean().optional(),
  fontSize: z.number().min(0).optional(),
  fontSizeUnit: unitOptions.optional(),
  fontWeight: z.number().min(0).optional(),
  fontFamily: z.string().min(1).optional(),
  lineHeight: z.number().min(0).optional(),
  lineHeightUnit: unitOptions.optional(),
  letterSpacing: z.number().min(0).optional(),
  letterSpacingUnit: unitOptions.optional(),
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
  textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
  textDecoration: z.enum(['none', 'underline', 'overline', 'line-through']).optional(),
  textDecorationColor: z
    .string()
    .min(1)
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color')
    .optional(),
  textDecorationColorFormat: z.enum(['hex', 'rgb', 'hsl', 'hsb']).optional(),
  textDecorationStyle: z.enum(['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']).optional(),
  textDecorationThickness: z.number().min(0).optional(),
  textDecorationThicknessUnit: unitOptions.optional(),
  textUnderlinePosition: z
    .enum(['auto', 'from-font', 'under', 'left', 'right', 'center', 'underline', 'line-through'])
    .optional(),
  textUnderlineOffset: z.number().min(0).optional(),
  textUnderlineOffsetUnit: unitOptions.optional(),
})

/**
 * TypeScript type inferred from the form schema.
 * Use this type when you need to work with form values outside of the form component.
 *
 * @example
 * ```tsx
 * import type { StyleFormValues } from './formSchema';
 *
 * const handleChange = (values: StyleFormValues) => {
 *   console.log(values.backgroundColor);
 * };
 * ```
 */
export type StyleFormValues = z.infer<typeof formSchema>
