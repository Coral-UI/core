import { z } from 'zod'

export const zCoralTSTypesSchema = z
  .union([
    z.literal('string'),
    z.literal('number'),
    z.literal('boolean'),
    z.literal('array'),
    z.literal('object'),
    z.literal('function'),
    z.any(),
  ])
  .nullable()

export type CoralTSTypes = z.infer<typeof zCoralTSTypesSchema>
