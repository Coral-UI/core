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
        optional: z.boolean().optional().describe('Whether the property is optional'),
        description: z.string().optional().describe('Description of the property'),
        usage: z
          .object({
            contexts: z
              .array(
                z.object({
                  location: z.string().describe('Framework-agnostic location (e.g., "template", "computed", "method")'),
                  expression: z.string().describe('The expression or context where the prop is used'),
                  type: z
                    .enum(['binding', 'interpolation', 'conditional', 'iteration', 'event', 'reference'])
                    .describe('Type of usage'),
                }),
              )
              .optional()
              .describe('Contexts where this property is used within the component'),
            isUsed: z.boolean().default(false).describe('Whether this property is actually used in the component'),
            dependencies: z.array(z.string()).optional().describe('Other properties or state this prop depends on'),
          })
          .optional()
          .describe('Framework-agnostic usage metadata for transformation to other UI libraries'),
      }),
      z.object({
        type: z.union([zCoralTSTypesSchema, z.array(zCoralTSTypesSchema).describe('An array of types used as or')]),
        value: z.any().describe('The value of the variant property'),
        optional: z.boolean().optional().describe('Whether the property is optional'),
        description: z.string().optional().describe('Description of the property'),
        usage: z
          .object({
            contexts: z
              .array(
                z.object({
                  location: z.string().describe('Framework-agnostic location (e.g., "template", "computed", "method")'),
                  expression: z.string().describe('The expression or context where the prop is used'),
                  type: z
                    .enum(['binding', 'interpolation', 'conditional', 'iteration', 'event', 'reference'])
                    .describe('Type of usage'),
                }),
              )
              .optional()
              .describe('Contexts where this property is used within the component'),
            isUsed: z.boolean().default(false).describe('Whether this property is actually used in the component'),
            dependencies: z.array(z.string()).optional().describe('Other properties or state this prop depends on'),
          })
          .optional()
          .describe('Framework-agnostic usage metadata for transformation to other UI libraries'),
      }),
    ]),
  )
  .describe('The properties passed to the component')

export type CoralComponentPropertyType = z.infer<typeof zCoralComponentPropertySchema>
