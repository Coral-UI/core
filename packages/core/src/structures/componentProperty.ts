import { z } from 'zod/v4'

import { zCoralTSTypesSchema } from './TStypes'
import { zCoralNameSchema } from './utilities'

export const zCoralComponentPropertySchema = z
  .record(
    zCoralNameSchema.describe('The name of the component property'),
    z.union([
      z.any(),
      z.object({
        type: z.union([zCoralTSTypesSchema, z.array(zCoralTSTypesSchema).describe('An array of types used as or')]),
        options: z.record(z.string(), z.any()).nullish().describe('The options of the variant'),
        defaultValue: z.any().describe('The default value of the component property'),
      }),
      z.object({
        type: z.union([zCoralTSTypesSchema, z.array(zCoralTSTypesSchema).describe('An array of types used as or')]),
        value: z.any().describe('The value of the variant property'),
      }),
    ]),
  )
  .describe('The properties passed to the component')

export type CoralComponentPropertyType = z.infer<typeof zCoralComponentPropertySchema>
