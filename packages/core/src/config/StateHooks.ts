import { z } from 'zod/v4'

export const zStateHook = z.object({
  name: z.string(),
  setterName: z.string(),
  initialValue: z.string().nullish(),
  tsType: z.enum(['string', 'number', 'boolean', 'array', 'object', 'function', 'undefined', 'null']).nullish(),
})

export const zStateHooks = z.array(zStateHook)

export type StateHooks = z.infer<typeof zStateHooks>
