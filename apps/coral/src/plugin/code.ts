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

      // Build the structure from the spec (built in memory, not on page yet)
      const { component } = await buildBasicStructure(spec)

      // Ensure component is not already on the page
      // If it somehow got added during build, remove it first
      if (component.parent && component.parent === figma.currentPage) {
        // Re-append to trigger a single update (moves it to end of children array)
        const currentX = component.x
        const currentY = component.y
        figma.currentPage.appendChild(component)
        component.x = currentX
        component.y = currentY
      } else {
        // Component is not on page, position it and append
        component.x = 100
        component.y = 100
        figma.currentPage.appendChild(component)
      }

      // Clean up any temporary frames that were used during build
      // For component sets, there might be a tempFrame that needs cleanup
      if (component.type === 'COMPONENT_SET') {
        const tempFrameId = component.getPluginData('tempFrameId')
        if (tempFrameId) {
          try {
            const tempFrame = await figma.getNodeByIdAsync(tempFrameId)
            if (tempFrame && tempFrame.type === 'FRAME' && tempFrame.name === 'temp-variant-container') {
              // Component set has been moved to page, tempFrame should be empty now
              if (tempFrame.children.length === 0) {
                tempFrame.remove()
              }
            }
          } catch {
            // Temp frame already removed or doesn't exist, ignore
          }
          component.setPluginData('tempFrameId', '') // Clear the reference
        }
      }

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
