import { z } from 'zod/v4'

import { zCoralTSTypesSchema } from './TStypes'
import { zCoralNameSchema } from './utilities'

export const zCoralStateSchema = z.object({
  name: zCoralNameSchema.describe(
    'The name of the state property. Will be used to represent the state symbol in the component.',
  ),
  setterName: zCoralNameSchema.describe(
    'The name of the setter function for the state property. Will be used to set the state symbol in the component.',
  ),
  initialValue: z.unknown().describe('The initial value of the state property.').nullish(),
  tsType: z
    .union([zCoralTSTypesSchema, z.array(zCoralTSTypesSchema)])
    .describe('The types of the state property. Can be a single type or an array of types'),
  hookType: z
    .enum(['useState', 'useEffect', 'useReducer', 'useContext', 'useMemo', 'useCallback'])
    .optional()
    .describe('The type of React hook used'),
  dependencies: z.string().optional().describe('Dependencies array for hooks like useEffect, useMemo, useCallback'),
  reducer: z.string().optional().describe('Reducer function for useReducer hook'),
})

export type CoralStateType = z.infer<typeof zCoralStateSchema>
