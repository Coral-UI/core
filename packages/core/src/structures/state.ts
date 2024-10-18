import { z } from 'zod'

import { zCoralTSTypesSchema } from './TStypes'
import { zCoralNameSchema } from './utilities'

export const zCoralStateSchema = z.object({
  name: zCoralNameSchema.describe(
    'The name of the state property. Will be used to represent the state symbol in the component.',
  ),
  setterName: zCoralNameSchema.describe(
    'The name of the setter function for the state property. Will be used to set the state symbol in the component.',
  ),
  initialValue: z.any().describe('The initial value of the state property.').nullish(),
  tsType: z
    .union([zCoralTSTypesSchema, z.array(zCoralTSTypesSchema)])
    .describe('The types of the state property. Can be a single type or an array of types'),
})

export type CoralStateType = z.infer<typeof zCoralStateSchema>
