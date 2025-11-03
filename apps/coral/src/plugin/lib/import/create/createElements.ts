import { hasResponsiveStyles } from '@/plugin/lib/import/assert/hasResponsiveStyles'
import { createComponentWithVariants } from '@/plugin/lib/import/components/createComponentWithVariants'
import { createElementAsComponent } from '@/plugin/lib/import/create/createElementAsComponent'
import { deferredActionsQueue } from '@/plugin/lib/import/utils/deferredActions'
import { textAlign } from '@/plugin/lib/types'

import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

export const createElements = async (
  spec: CoralRootNode | CoralNode,
  textAlign?: textAlign,
): Promise<ComponentNode | ComponentSetNode> => {
  const parentTextAlign = spec.styles?.['textAlign'] as textAlign | undefined
  const effectiveTextAlign = parentTextAlign || textAlign

  // Clear any existing deferred actions from previous runs
  deferredActionsQueue.clear()

  let result: ComponentNode | ComponentSetNode

  // Check if this spec or any of its descendants has responsive styles
  if (hasResponsiveStyles(spec)) {
    // Create a component set with variants
    result = await createComponentWithVariants(spec, effectiveTextAlign)
  } else {
    // Otherwise, create a regular component (all imports become components by default)
    result = await createElementAsComponent(spec, effectiveTextAlign)
  }

  // Execute all deferred actions after the tree is fully built
  deferredActionsQueue.executeAll()

  return result
}
