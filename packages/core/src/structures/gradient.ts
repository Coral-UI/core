import { z } from 'zod'

import { zCoralColorSchema } from './color'

export const zCoralGradientTypeSchema = z.object({
  angle: z.number().describe('The angle of the gradient'),
  type: z
    .union([z.literal('linear'), z.literal('radial'), z.literal('LINEAR'), z.literal('RADIAL')])
    .describe('The type of the gradient'),
  colors: z
    .array(
      z
        .object({
          color: zCoralColorSchema,

          position: z.number().describe('The position of the color in the gradient'),
        })
        .describe('An object representing a single color stop in the gradient'),
    )
    .describe('The color stops of the gradient'),
})

export type CoralGradientType = z.infer<typeof zCoralGradientTypeSchema>
