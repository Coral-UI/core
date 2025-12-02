import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as z from 'zod'

import { zCoralComponentPropertySchema } from '../structures/componentProperty'
import { zCoralRootSchema, zCoralSchema } from '../structures/coral'
import { zCoralDependencySchema } from '../structures/dependency'
import { zCoralDesignTokenSchema } from '../structures/designToken'
import { zCoralImportSchema } from '../structures/import'
import { zCoralMethodSchema } from '../structures/method'
import { zBreakpointSchema, zCoralResponsiveStylesSchema, zResponsiveStyleSchema } from '../structures/responsiveStyles'
import { zCoralStateSchema } from '../structures/state'
import { zCoralStyleSchema } from '../structures/styles'
import { zCoralTSTypesSchema } from '../structures/TStypes'
import { zCoralVariantSchema } from '../structures/variant'

export interface SchemaExportOptions {
  outputDir?: string
  target?: 'draft-7' | 'draft-2020-12'
  pretty?: boolean
  version?: string
  baseUrl?: string
}

export const SCHEMA_EXPORTS = {
  'coral-root': zCoralRootSchema,
  coral: zCoralSchema,
  'component-property': zCoralComponentPropertySchema,
  dependency: zCoralDependencySchema,
  'design-token': zCoralDesignTokenSchema,
  import: zCoralImportSchema,
  method: zCoralMethodSchema,
  'responsive-styles': zCoralResponsiveStylesSchema,
  'responsive-style': zResponsiveStyleSchema,
  breakpoint: zBreakpointSchema,
  state: zCoralStateSchema,
  styles: zCoralStyleSchema,
  'ts-types': zCoralTSTypesSchema,
  variant: zCoralVariantSchema,
} as const

export function exportSchemaToJSON(schema: z.ZodType<unknown>, options: SchemaExportOptions = {}): object {
  const { target = 'draft-2020-12', version, baseUrl } = options

  try {
    const jsonSchema = z.toJSONSchema(schema, {
      target,
    })

    // Add versioning and custom $id if provided
    if (version || baseUrl) {
      const enhanced = { ...jsonSchema }
      if (baseUrl && version) {
        enhanced.$id = `${baseUrl}/v${version}/schema.json`
      }
      if (version) {
        enhanced.version = version
      }
      return enhanced
    }

    return jsonSchema
  } catch (error) {
    console.warn(`Failed to convert schema to JSON Schema:`, error)
    return {
      $schema: `https://json-schema.org/${target === 'draft-2020-12' ? 'draft/2020-12' : 'draft-07'}/schema#`,
      type: 'object',
      description: 'Schema conversion failed',
      properties: {},
    }
  }
}

export function exportAllSchemas(options: SchemaExportOptions = {}): void {
  const { outputDir = './schemas', pretty = true, version, baseUrl } = options

  // Create output directory
  mkdirSync(outputDir, { recursive: true })

  // Export individual schemas
  Object.entries(SCHEMA_EXPORTS).forEach(([name, schema]) => {
    try {
      const jsonSchema = exportSchemaToJSON(schema, options)
      const filename = `${name}.schema.json`
      const filepath = join(outputDir, filename)

      const content = pretty ? JSON.stringify(jsonSchema, null, 2) : JSON.stringify(jsonSchema)

      writeFileSync(filepath, content, 'utf8')
      console.log(`✓ Exported ${name} schema to ${filepath}`)
    } catch (error) {
      // Log error but continue with other schemas
      console.warn(`⚠ Skipped ${name} schema due to error:`, error instanceof Error ? error.message : error)
    }
  })

  // Create index file with all schema references
  const indexSchema = {
    $schema:
      options.target === 'draft-7'
        ? 'https://json-schema.org/draft-07/schema#'
        : 'https://json-schema.org/draft/2020-12/schema#',
    ...(baseUrl && version && { $id: `${baseUrl}/v${version}/index.json` }),
    ...(version && { version }),
    title: 'Coral Design System Schemas',
    description: 'Collection of JSON schemas for the Coral design system',
    type: 'object',
    properties: {
      schemas: {
        type: 'object',
        properties: Object.keys(SCHEMA_EXPORTS).reduce(
          (acc, name) => {
            acc[name] = {
              $ref: `./${name}.schema.json`,
            }
            return acc
          },
          {} as Record<string, unknown>,
        ),
      },
    },
  }

  const indexContent = pretty ? JSON.stringify(indexSchema, null, 2) : JSON.stringify(indexSchema)

  writeFileSync(join(outputDir, 'index.schema.json'), indexContent, 'utf8')
  console.log(`✓ Created schema index at ${join(outputDir, 'index.schema.json')}`)
}
