import { CoralNode, CoralRootNode } from '@reallygoodwork/coral-core'

import { textAlign } from '../../types'
import { hasResponsiveStyles } from '../assert/hasResponsiveStyles'
import { createComponentWithVariants } from '../components/createComponentWithVariants'
import { createElementAsComponent } from './createElementAsComponent'

export const createElements = async (spec: CoralRootNode | CoralNode, textAlign?: textAlign) => {
  const parentTextAlign = spec.styles?.['textAlign'] as textAlign | undefined
  const effectiveTextAlign = parentTextAlign || textAlign

  // Check if this spec or any of its descendants has responsive styles
  if (hasResponsiveStyles(spec)) {
    // Create a component set with variants
    return createComponentWithVariants(spec, effectiveTextAlign) as Promise<SceneNode>
  }

  // Otherwise, create a regular component (all imports become components by default)
  return createElementAsComponent(spec, effectiveTextAlign) as Promise<SceneNode>
}
