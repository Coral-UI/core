import { z } from 'zod/v4'

export const Dependencies = z.object({
  name: z.string(),
  version: z.string().nullish(),
  path: z.string(),
})

export type Dependencies = z.infer<typeof Dependencies>
