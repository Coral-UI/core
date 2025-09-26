import { z } from 'zod/v4'

export const zImportObject = z.object({
  source: z.string(),
  specifiers: z.array(z.object({ name: z.string(), isDefault: z.boolean() })),
})

export const zImportObjectArray = z.array(zImportObject)

export type Imports = z.infer<typeof zImportObjectArray>
