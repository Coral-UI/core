import { z } from 'zod/v4'

import { zCoralComponentPropertySchema } from './componentProperty'
import { zCoralDependencySchema } from './dependency'
import { zCoralDesignTokenSchema } from './designToken'
import { zCoralImportSchema } from './import'
import { zCoralMethodSchema } from './method'
import { zCoralStateSchema } from './state'
import { zCoralStyleSchema } from './styles'
import { zCoralTSTypesSchema } from './TStypes'
import { zCoralNameSchema, zElementSchema } from './utilities'

// Create a lazy schema to handle recursion properly
export const zCoralSchema: z.ZodType<CoralNode> = z.lazy(() =>
  z.object({
    componentParentFigmaNodeRef: z.string().optional().describe('The parent of the Coral Component'),
    description: z.string().optional().describe('The description of the Coral Component'),
    elementType: zElementSchema.describe('The type of the element to be created').default('div'),
    figmaType: z.string().optional().describe('The type of the Figma node to be created'),
    elementAttributes: z
      .union([z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])), z.undefined()])
      .optional()
      .describe('The attributes of the element to be created'),
    figmaNodeRef: z.string().optional().describe('The reference to the Figma node'),
    hasBackgroundImage: z.boolean().optional().describe('Whether the element has a background image'),
    isComponentInstance: z.boolean().optional().describe('Whether the element is a component instance'),
    name: zCoralNameSchema.describe('The name of the Coral Component'),
    options: z.record(z.string(), z.any()).nullish().describe('The options of the variant'),
    styles: zCoralStyleSchema.optional(),
    textContent: z.string().optional().describe('The text content of the element'),
    tsType: z.string().optional().describe('The TypeScript type of the Coral Component'),

    type: z
      .union([z.literal('COMPONENT'), z.literal('INSTANCE'), z.literal('COMPONENT_SET'), z.literal('NODE')])
      .default('NODE')
      .optional()
      .describe('The type of the Coral Component. Also used to determine the type of the node to be created in Figma'),
    variantProperties: z
      .record(
        zCoralNameSchema,
        z.object({
          type: z.union([zCoralTSTypesSchema, z.array(zCoralTSTypesSchema).describe('An array of types used as or')]),
          value: z.any().describe('The value of the variant property'),
        }),
      )
      .optional()
      .describe(
        'The variant properties of the Coral Component variant. Connects to the component properties of the Component Set or Component',
      ),
    children: z.array(zCoralSchema).nullish().describe('The children of the Coral Component'),
    variants: z.array(zCoralSchema).nullish().describe('The variants of the Coral Component'),
  })
)

export const zCoralRootSchema = zCoralSchema.and(
  z.object({
    $schema: z.literal('https://coral.design/schema.json').optional().describe('The schema of the Coral Component'),
    componentName: zCoralNameSchema
      .optional()
      .describe('The name of the Coral Component. Will override the name of the Coral Component if provided.'),
    componentProperties: zCoralComponentPropertySchema
      .optional()
      .describe('The component properties of the Coral Component'),
    config: z
      .record(z.string(), z.any())
      .nullish()
      .describe('The configuration of the Coral Component. Can be used to pass additional data to the component'),
    dependencies: z.array(zCoralDependencySchema).optional().describe('The dependencies of the Coral Component'),
    designTokens: z
      .record(zCoralNameSchema, zCoralDesignTokenSchema)
      .optional()
      .describe('The design tokens of the Coral Component'),
    imports: z.array(zCoralImportSchema).optional().describe('The imports of the Coral Component'),
    isComponentSet: z.boolean().optional().describe('Whether the element is a component set'),
    methods: z.array(zCoralMethodSchema).optional().describe('The methods of the Coral Component'),
    stateHooks: z.array(zCoralStateSchema).optional().describe('The state hooks of the Coral Component'),
    numberOfVariants: z.number().optional().describe('The number of instances of the Coral Component'),
  }),
)

// Forward declare the type for recursive reference
export type CoralNode = {
  componentParentFigmaNodeRef?: string
  description?: string
  elementType: z.infer<typeof zElementSchema>
  figmaType?: string
  elementAttributes?: Record<string, string | number | boolean | string[]>
  figmaNodeRef?: string
  hasBackgroundImage?: boolean
  isComponentInstance?: boolean
  name: string
  options?: Record<string, any> | null
  styles?: z.infer<typeof zCoralStyleSchema>
  textContent?: string
  tsType?: string
  type?: 'COMPONENT' | 'INSTANCE' | 'COMPONENT_SET' | 'NODE'
  variantProperties?: Record<string, { type: z.infer<typeof zCoralTSTypesSchema> | z.infer<typeof zCoralTSTypesSchema>[]; value: any }>
  children?: CoralNode[] | null
  variants?: CoralNode[] | null
}

export type CoralRootNode = CoralNode & {
  $schema?: 'https://coral.design/schema.json'
  componentName?: string
  componentProperties?: z.infer<typeof zCoralComponentPropertySchema>
  config?: Record<string, any> | null
  dependencies?: z.infer<typeof zCoralDependencySchema>[]
  designTokens?: Record<string, z.infer<typeof zCoralDesignTokenSchema>>
  imports?: z.infer<typeof zCoralImportSchema>[]
  isComponentSet?: boolean
  methods?: z.infer<typeof zCoralMethodSchema>[]
  stateHooks?: z.infer<typeof zCoralStateSchema>[]
  numberOfVariants?: number
}
