import { CoralColorType, CoralNode, CoralStyleType } from '@reallygoodwork/coral-core'

/**
 * Represents a variant property value that can be a string or boolean
 */
export type VariantPropertyValue = string | boolean

/**
 * Represents a variant property with type information
 */
export interface VariantProperty {
  type: 'string' | 'boolean' | string[]
  value: VariantPropertyValue
}

/**
 * A record of variant properties mapped by their normalized names
 */
export type VariantProperties = Record<string, VariantProperty>

/**
 * RGB color values used by Figma (0-1 range)
 */
export interface FigmaRGB {
  r: number
  g: number
  b: number
}

/**
 * Type guard to check if a value is a CoralColorType
 */
export function isCoralColor(value: unknown): value is CoralColorType {
  return typeof value === 'object' && value !== null && 'hex' in value && 'rgb' in value && 'hsl' in value
}

/**
 * Type guard to check if a value is a FigmaRGB
 */
export function isFigmaRGB(value: unknown): value is FigmaRGB {
  return (
    typeof value === 'object' &&
    value !== null &&
    'r' in value &&
    'g' in value &&
    'b' in value &&
    typeof (value as FigmaRGB).r === 'number' &&
    typeof (value as FigmaRGB).g === 'number' &&
    typeof (value as FigmaRGB).b === 'number'
  )
}

/**
 * Style differences for responsive breakpoints
 */
export type StyleDifferences = Partial<CoralStyleType> | null

/**
 * Helper to safely clone objects for Figma API
 */
export type CloneableValue =
  | null
  | undefined
  | boolean
  | number
  | string
  | CloneableValue[]
  | { [key: string]: CloneableValue }

export type Element = FrameNode | ComponentNode | InstanceNode | TextNode
export type ElementWithOptionalText = FrameNode | ComponentNode | InstanceNode

export type textAlign = 'left' | 'center' | 'right' | 'justify' | 'start' | 'end'

export type VariantWithBreakpoint = {
  variantNode: ComponentNode | null
  breakpoint: string
  nodeData: CoralNode
}
