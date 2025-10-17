import { z } from 'zod/v4'

import { zCoralStyleSchema } from './styles'

// Media query types
export const zBreakpointTypeSchema = z
  .enum(['min-width', 'max-width', 'min-height', 'max-height'])
  .describe('The type of media query condition')

// Simple breakpoint: single condition (e.g., min-width: 768px)
export const zSimpleBreakpointSchema = z
  .object({
    type: zBreakpointTypeSchema.describe('The type of the breakpoint condition'),
    value: z.string().describe('The value of the breakpoint (e.g., "768px", "50rem")'),
  })
  .describe('A simple breakpoint with a single condition')

// Range breakpoint: two conditions (e.g., min-width: 768px AND max-width: 1024px)
export const zRangeBreakpointSchema = z
  .object({
    min: z
      .object({
        type: z.enum(['min-width', 'min-height']).describe('The minimum condition type'),
        value: z.string().describe('The minimum value (e.g., "768px")'),
      })
      .optional()
      .describe('The minimum condition for the range'),
    max: z
      .object({
        type: z.enum(['max-width', 'max-height']).describe('The maximum condition type'),
        value: z.string().describe('The maximum value (e.g., "1024px")'),
      })
      .optional()
      .describe('The maximum condition for the range'),
  })
  .refine((data) => data.min || data.max, {
    message: 'At least one of min or max must be defined',
  })
  .describe('A range breakpoint with min and/or max conditions')

// Union of simple and range breakpoints
export const zBreakpointSchema = z
  .union([zSimpleBreakpointSchema, zRangeBreakpointSchema])
  .describe('A breakpoint definition (simple or range)')

// Responsive style entry
export const zResponsiveStyleSchema = z
  .object({
    breakpoint: zBreakpointSchema.describe('The breakpoint at which these styles apply'),
    label: z.string().optional().describe('Optional label for this breakpoint (e.g., "Mobile", "Tablet")'),
    styles: zCoralStyleSchema.describe('The styles to apply at this breakpoint'),
  })
  .describe('A set of styles to apply at a specific breakpoint')

// Array of responsive styles
export const zCoralResponsiveStylesSchema = z
  .array(zResponsiveStyleSchema)
  .optional()
  .describe('An array of responsive style definitions for different breakpoints')

// Export types
export type BreakpointType = z.infer<typeof zBreakpointTypeSchema>
export type SimpleBreakpoint = z.infer<typeof zSimpleBreakpointSchema>
export type RangeBreakpoint = z.infer<typeof zRangeBreakpointSchema>
export type Breakpoint = z.infer<typeof zBreakpointSchema>
export type ResponsiveStyle = z.infer<typeof zResponsiveStyleSchema>
export type CoralResponsiveStyles = z.infer<typeof zCoralResponsiveStylesSchema>
