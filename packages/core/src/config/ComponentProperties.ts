import z from 'zod'

export const zComponentProperties = z.object({
  figmaNodeRef: z.string().nullish(),
  name: z.string().trim().nullish(),
  description: z.string().nullish(),
  tsType: z.enum(['string', 'number', 'boolean', 'array', 'object', 'function', 'undefined', 'null']).nullish(),
  defaultValue: z
    .union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.any()),
      z.record(z.string(), z.any()),
      z.function(),
      z.undefined(),
      z.null(),
    ])
    .nullish(),
  options: z.array(z.union([z.string(), z.number()])).nullish(),
})

export type ComponentProperties = z.infer<typeof zComponentProperties>
