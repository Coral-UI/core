import { parseUISpec } from '@reallygoodwork/coral-core'

import { EXPORT_SPEC, IMPORT_SPEC } from './lib/events'
import { exportSpec } from './lib/exportSpec'

import { createElements } from './lib/import/importSpec'
//
console.clear()

figma.showUI(__html__, { width: 740, height: 878, themeColors: true })

figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection
  console.log(selection)
})

figma.ui.onmessage = async (msg) => {
  if (msg.type === EXPORT_SPEC) {
    const selection = figma.currentPage.selection[0]

    if (selection && selection.type === 'COMPONENT_SET') {
      const componentSetNode = selection as ComponentSetNode

      console.log('=== FIGMA COMPONENT SET DATA ===')
      console.log('Name:', componentSetNode.name)
      console.log('Type:', componentSetNode.type)
      console.log('Component Property Definitions:', componentSetNode.componentPropertyDefinitions)
      console.log('Number of children:', componentSetNode.children.length)
      console.log('\n--- VARIANTS ---')

      for (const child of componentSetNode.children) {
        const component = child as ComponentNode
        console.log(`\nVariant: ${component.name}`)
        console.log('  Variant Properties:', component.variantProperties)
        console.log('  Has children:', 'children' in component && component.children.length)
        if ('children' in component) {
          console.log('  Children:')
          for (const c of component.children) {
            console.log(`    - ${c.name} (${c.type})`)
          }
        }
      }
      console.log('\n=== END FIGMA DATA ===')
    }

    const spec = await exportSpec()
    figma.ui.postMessage({ type: 'SPEC_CREATED', message: spec })
  } else if (msg.type === IMPORT_SPEC) {
    try {
      const spec = await parseUISpec(msg.message)
      const elements = await createElements(spec)
      figma.currentPage.appendChild(elements)
      figma.currentPage.selection = [elements]
      figma.viewport.scrollAndZoomIntoView([elements])
    } catch (error) {
      console.error('Error importing spec', error)
    }
  }
}
