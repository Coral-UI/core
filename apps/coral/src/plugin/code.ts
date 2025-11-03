import { EXPORT_SPEC, IMPORT_SPEC } from '@/plugin/lib/events'
import { exportSpec } from '@/plugin/lib/export/exportSpec'
import { buildBasicStructure } from '@/plugin/lib/import/utils/buildBasicStructure'

import { parseUISpec } from '@reallygoodwork/coral-core'

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

      // Build the structure from the spec
      const { component, analysis } = await buildBasicStructure(spec)

      // Log analysis results
      console.log('\n=== Structure Built ===')
      console.log('Component:', component.name)
      console.log('Type:', component.type)
      console.log('\nAnalysis:')
      console.log('- Fonts Loaded:', analysis.fontsToLoad.length)
      console.log('- Responsive Variants:', analysis.responsiveVariants.length)
      console.log('- Auto Layout Nodes:', analysis.autoLayoutNodes.length)
      console.log('- Total Nodes:', analysis.nodeStyles.length)

      if (analysis.autoLayoutNodes.length > 0) {
        console.log('\nAuto Layout Applied:')
        analysis.autoLayoutNodes.forEach((al) => {
          console.log(`  - ${al.nodeName}: ${al.textAlign} alignment`)
        })
      }

      if (analysis.responsiveVariants.length > 0) {
        console.log('\nResponsive Variants Created:')
        analysis.responsiveVariants.forEach((rv) => {
          console.log(`  - ${rv.name}`)
        })
      }

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
    } catch (error) {
      console.error('Error importing spec:', error)
      figma.ui.postMessage({
        type: 'IMPORT_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
