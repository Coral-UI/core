import { z } from 'zod'

export const zPropSchema = z
  .record(
    z.string(),
    z.union([
      z.string(),
      z.object({
        type: z.string(),
        name: z.string(),
      }),
    ]),
  )
  .nullish()

export const zPropsSchema = z.array(zPropSchema)

export type Props = z.infer<typeof zPropSchema>
