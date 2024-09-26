import { zImportObjectArray } from '@config/Imports'
import { zMethodArray } from '@config/Methods'
import { zPropSchema } from '@config/Props'
import { zStateHooks } from '@config/StateHooks'
import { zStyleSchema } from '@config/Styles'
import { zVariantSchema } from '@config/Variant'
import z from 'zod'

const zGenericProperty = z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
const zGenericObject = z.record(z.string(), zGenericProperty)

export const UISpecConfigSchema = zGenericObject.nullish()

export const zBaseNodeSchema = z.object({
  elementAttributes: zGenericObject.nullish(),
  elementType: z.string(),
  description: z.string().nullish(),
  hasBackgroundImage: z.boolean().nullish(),
  isComponent: z.boolean().nullish(),
  props: zPropSchema,
  name: z
    .string()
    .transform((val) => val.replace(/\s/g, '')) // Remove all whitespace
    .refine((val) => /^[a-zA-Z]/.test(val), {
      // Ensure first character is a letter
      message: 'Text content must start with a letter',
    })
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .nullish(),
  styles: zStyleSchema,
  variants: z.array(zVariantSchema).nullish(),
  tsType: z.string().nullish(),
  textContent: z.string().nullish(),
  methods: zMethodArray.nullish(),
  stateHooks: zStateHooks.nullish(),
  imports: zImportObjectArray.nullish(),
  importSource: z.string().nullish(),
  componentName: z.string().nullish(),
})

export type BaseNode = z.infer<typeof zBaseNodeSchema> & {
  children?: BaseNode[]
}

export const zTopLevelSchema = zBaseNodeSchema.extend({
  // Add top-level specific properties here
  methods: zMethodArray.nullish(),
  stateHooks: zStateHooks.nullish(),
  imports: zImportObjectArray.nullish(),
  importSource: z.string().nullish(),
  componentName: z.string().nullish(),
})

export const zUISpecSchema: z.ZodType<BaseNode> = zTopLevelSchema.extend({
  config: UISpecConfigSchema,

  children: z.lazy(() => zUISpecSchema.array()),
})

export type UISpec = z.infer<typeof zUISpecSchema>
