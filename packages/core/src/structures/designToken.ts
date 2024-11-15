import { z } from 'zod'

import { zCoralColorSchema } from './color'
import { zCoralGradientTypeSchema } from './gradient'
import { zCoralNameSchema } from './utilities'

export const zCoralDesignTokenSchema = z.object({
  property: zCoralNameSchema.describe('The CSS property of the design token'),
  tokenName: zCoralNameSchema.describe('The name of the design token'),
  fallbackValue: z
    .union([z.string(), z.number(), zCoralColorSchema, zCoralGradientTypeSchema])
    .describe('The fallback value of the design token'),
})

export type CoralDesignTokenType = z.infer<typeof zCoralDesignTokenSchema>
