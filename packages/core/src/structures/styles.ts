import { z } from 'zod/v4'

import { zCoralColorSchema } from './color'
import { zCoralGradientTypeSchema } from './gradient'

export const zCoralStyleValueSchema = z
  .union([z.string(), z.number(), zCoralColorSchema, zCoralGradientTypeSchema])
  .describe('The value of a style property')

// Create a lazy schema to support recursive nesting for media queries and pseudo-selectors
export const zCoralStyleSchema: z.ZodType<CoralStyleType> = z.lazy(() =>
  z
    .record(
      z.string().describe('The name of a style property'),
      z.union([
        zCoralStyleValueSchema,
        z.record(z.string(), z.union([zCoralStyleValueSchema, zCoralStyleSchema])).describe('A nested style property'),
      ]),
    )
    .describe('The styles of the Coral Component'),
)

export type CoralStyleType = Record<
  string,
  string | number | z.infer<typeof zCoralColorSchema> | z.infer<typeof zCoralGradientTypeSchema> | Record<string, any>
>
