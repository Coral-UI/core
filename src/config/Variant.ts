import { zElementSchema } from '@config/Element'
import { zStyleSchema } from '@config/Styles'
import z from 'zod'

export const zVariantBoundProperties = z.object({
  propertyName: z.string().nullish(),
  type: z
    .union([z.string(), z.number(), z.boolean(), z.array(z.any()), z.record(z.string(), z.any()), z.function()])
    .nullish(),
  value: z.record(z.string(), z.any()).nullish(),
})

export type VariantBoundProperties = z.infer<typeof zVariantBoundProperties>

export const zVariantSchema = z.object({
  elementType: zElementSchema,
  figmaNodeRef: z.string().nullish(),
  boundProperties: zVariantBoundProperties,
  styles: zStyleSchema,
  options: z.record(z.string(), z.any()).nullish(),
})

export type Variant = z.infer<typeof zVariantSchema>
