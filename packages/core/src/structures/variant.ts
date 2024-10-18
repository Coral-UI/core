import { z } from 'zod'

import { zCoralStyleSchema } from './styles'
import { zCoralNameSchema } from './utilities'

export const zCoralVariantSchema = z.object({
  name: zCoralNameSchema.describe('The name of the variant'),
  figmaNodeRef: z.string().nullish().describe('The reference to the Figma node'),
  options: z.record(z.string(), z.any()).nullish().describe('The options of the variant'),
  styles: zCoralStyleSchema.nullish(),
})

export type CoralVariantType = z.infer<typeof zCoralVariantSchema>
