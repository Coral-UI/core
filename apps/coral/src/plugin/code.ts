import { EXPORT_SPEC, IMPORT_SPEC } from '@/plugin/lib/events'
import { exportSpec } from '@/plugin/lib/export/exportSpec'
import { buildBasicStructure } from '@/plugin/lib/import/utils/buildBasicStructure'

import { parseUISpec } from '@reallygoodwork/coral-core'

console.clear()

figma.showUI(__html__, { width: 600, height: 600, themeColors: true })

figma.ui.onmessage = async (msg) => {
  if (msg.type === EXPORT_SPEC) {
    const spec = await exportSpec()
    figma.ui.postMessage({ type: 'SPEC_CREATED', message: spec })
  } else if (msg.type === IMPORT_SPEC) {
    try {
      const spec = await parseUISpec(msg.message)

      // Build the structure from the spec
      const { component } = await buildBasicStructure(spec)

      // Position component on page
      component.x = 100
      component.y = 100

      // Select and zoom to the component
      figma.currentPage.selection = [component]
      figma.viewport.scrollAndZoomIntoView([component])

      figma.ui.postMessage({
        type: 'IMPORT_SUCCESS',
        message: `Created ${component.type}: ${component.name}`,
      })
      figma.notify(`Created ${component.type}: ${component.name}`, { timeout: 3000 })
    } catch (error) {
      console.error('Error importing spec:', error)
      figma.ui.postMessage({
        type: 'IMPORT_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
