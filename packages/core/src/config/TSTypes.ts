import { z } from 'zod'

export const zTS_TYPES = z.union([
  z.literal('string'),
  z.literal('number'),
  z.literal('boolean'),
  z.literal('array'),
  z.literal('object'),
  z.literal('function'),
  z.literal('undefined'),
  z.literal('null'),
])

export type TS_TYPES = z.infer<typeof zTS_TYPES>
