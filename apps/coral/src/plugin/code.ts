import { EXPORT_SPEC, IMPORT_SPEC } from '@/plugin/lib/events'
import { exportSpec } from '@/plugin/lib/export/exportSpec'
import { createElements } from '@/plugin/lib/import/create/createElements'

import { parseUISpec } from '@reallygoodwork/coral-core'

//
console.clear()

figma.showUI(__html__, { width: 600, height: 600, themeColors: true })

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
