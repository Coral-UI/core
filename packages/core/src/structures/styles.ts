import { z } from 'zod'

import { zCoralColorSchema } from './color'
import { zCoralGradientTypeSchema } from './gradient'

export const zCoralStyleValueSchema = z
  .union([z.string(), z.number(), zCoralColorSchema, zCoralGradientTypeSchema])
  .describe('The value of a style property')

export const zCoralStyleSchema = z
  .record(
    z.string().describe('The name of a style property'),
    z.union([zCoralStyleValueSchema, z.record(z.string(), zCoralStyleValueSchema).describe('A nested style property')]),
  )
  .describe('The styles of the Coral Component')

export type CoralStyleType = z.infer<typeof zCoralStyleSchema>
