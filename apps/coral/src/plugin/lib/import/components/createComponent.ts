import { CoralNode } from '@reallygoodwork/coral-core'

import { applyStyles } from '../styles/applyStyles'

export const createComponent = async (spec: CoralNode) => {
  const component = figma.createComponent()
  component.name = spec.name

  // Remove default white background - only apply fills if explicitly specified in styles
  component.fills = []

  // Enable auto-layout by default with HUG sizing
  component.layoutMode = 'VERTICAL'
  component.layoutSizingHorizontal = 'HUG'
  component.layoutSizingVertical = 'HUG'

  await applyStyles(component, spec)
  return component
}
