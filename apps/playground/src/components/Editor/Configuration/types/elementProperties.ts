import { ElementTreeNode } from '@/hooks/useElementTree'

/**
 * Props for ElementProperties component
 */
export interface ElementPropertiesProps {
  element: ElementTreeNode | null
  onUpdateElement: (elementId: string, updates: Partial<ElementTreeNode>) => void
}

/**
 * Callback type for updating element properties
 */
export type UpdatePropertyFn = (property: keyof ElementTreeNode, value: unknown) => void

/**
 * Field state helpers for form fields
 */
export interface FieldStateHelpers {
  isFieldSet: (fieldName: string) => boolean
  getInheritedFrom: (fieldName: string) => string | undefined
  onClearField: (fieldName: string) => void
}
