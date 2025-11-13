import { ELEMENT_TYPE_DEFINITIONS } from '@/utils/elementTypes'
import * as z from 'zod'

import { CoralElementType } from '@reallygoodwork/coral-core'

// Extract all valid element types from ELEMENT_TYPE_DEFINITIONS
const elementTypes = ELEMENT_TYPE_DEFINITIONS.map((def) => def.type) as [CoralElementType, ...CoralElementType[]]

export const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(elementTypes),
  textContent: z.string().optional(),
  // elementAttributes: z.record(z.string(), z.any()).optional(),
  // responsiveStyles: z.record(z.string(), z.any()).optional(),
  // breakpoints: z.record(z.string(), z.any()).optional(),
})

export type FormValues = z.infer<typeof formSchema>
