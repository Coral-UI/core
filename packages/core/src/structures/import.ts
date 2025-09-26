import { z } from 'zod/v4'

export const zCoralImportSchema = z
  .object({
    source: z.string().describe('The source of the import'),
    version: z.string().default('latest').describe('The version of the import'),
    specifiers: z
      .array(z.object({ name: z.string(), isDefault: z.boolean().optional(), as: z.string().optional() }))
      .describe('The specifiers of the import'),
  })
  .describe('An object representing an import of a dependency in a Coral Component')

export type CoralImportType = z.infer<typeof zCoralImportSchema>
