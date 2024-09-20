import { zTS_TYPES } from '@config/TSTypes'
import z from 'zod'

export const zMethod = z.object({
  name: z.string(),
  params: z.array(z.string()),
  body: z.string(),
  tsType: zTS_TYPES.nullish(),
  stateInteractions: z.object({
    reads: z.array(z.string()),
    writes: z.array(z.string()),
  }),
})

export const zMethodArray = z.array(zMethod)

export type Methods = z.infer<typeof zMethodArray>
