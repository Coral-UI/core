import { parseUISpec } from '@reallygoodwork/coral-core'

import { EXPORT_SPEC, IMPORT_SPEC } from './lib/events'
import { exportSpec } from './lib/exportSpec'
import { createElements } from './lib/import/importSpec'

console.clear()

figma.showUI(__html__, { width: 600, height: 900, themeColors: true })

figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection
  console.log(selection)
})

figma.ui.onmessage = async (msg) => {
  if (msg.type === EXPORT_SPEC) {
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
