import { z } from 'zod'

import { zCoralTSTypesSchema } from './TStypes'
import { zCoralNameSchema } from './utilities'

export const zCoralMethodSchema = z
  .object({
    name: zCoralNameSchema.describe('The name of the method'),
    description: z.string().nullish().describe('The description of the method'),
    body: z.string().describe('The body of the method'),
    parameters: z.array(
      z.union([
        zCoralNameSchema.describe('The name of the parameter argument'),
        z
          .object({
            name: zCoralNameSchema.describe('The name of the parameter'),
            tsType: z
              .union([zCoralTSTypesSchema, z.array(zCoralTSTypesSchema)])
              .nullish()
              .describe('The default value of the parameter as a TypeScript type'),
            defaultValue: z.any().nullish(),
          })
          .describe('An object representing a parameter argument of the method'),
      ]),
    ),
    stateInteractions: z
      .object({
        reads: z.array(z.string()).describe('The state properties that the method reads'),
        writes: z.array(z.string()).describe('The state properties that the method writes'),
      })
      .nullish()
      .describe(
        'The state interactions of the method. This is used to determine if the method interacts with the state directly and therefore should enforce the existence of component state in the Coral Config',
      ),
  })
  .describe('An object representing a method in a Coral Component')

export type CoralMethodType = z.infer<typeof zCoralMethodSchema>
