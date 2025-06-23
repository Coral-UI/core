import { z } from 'zod/v4'

export const zCoralDependencySchema = z
  .object({
    name: z.string().describe('The name of the dependency'),
    version: z.string().describe('The version of the dependency'),
    path: z.string().describe('The path to the dependency'),
  })
  .describe('An object representing a dependency of another Coral document in a Coral Component')

export type CoralDependencyType = z.infer<typeof zCoralDependencySchema>
