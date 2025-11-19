import type { AccessibilityResults } from '@/lib/accessibility/checkAccessibility'

import type { CoralRootNode } from '@reallygoodwork/coral-core'

export interface Component {
  id: string
  libraryId: string
  name: string
  description?: string
  spec: CoralRootNode
  accessibility?: AccessibilityResults
  createdAt: string
  updatedAt: string
}

export interface CreateComponentInput {
  libraryId: string
  name: string
  description?: string
  spec: CoralRootNode
}

export interface UpdateComponentInput {
  name?: string
  description?: string
  spec?: CoralRootNode
  accessibility?: AccessibilityResults
}
