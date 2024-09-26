import z from 'zod'

export const zStyleSchema = z
  .record(
    z.string().transform((key) => key.replace(/-./g, (match) => match.charAt(1).toUpperCase())),
    z.union([
      z.string(),
      z.number(),
      z
        .record(
          z.string().transform((key) => key.replace(/-./g, (match) => match.charAt(1).toUpperCase())),
          z.union([z.string(), z.number()]),
        )
        .nullish(),
    ]),
  )
  .nullish()

export type Style = z.infer<typeof zStyleSchema>
