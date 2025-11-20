import axe from 'axe-core'

import type { CoralRootNode } from '@reallygoodwork/coral-core'
import { coralToHTML } from '@reallygoodwork/coral-to-html'

export interface AccessibilityResults {
  violations: AxeViolation[]
  passes: AxePass[]
  incomplete: AxeIncomplete[]
  inapplicable: AxeInapplicable[]
  lastChecked: string
}

export interface AxeViolation {
  id: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  tags: string[]
  description: string
  help: string
  helpUrl: string
  nodes: AxeNode[]
}

export interface AxePass {
  id: string
  impact: null
  tags: string[]
  description: string
  help: string
  helpUrl: string
  nodes: AxeNode[]
}

export interface AxeIncomplete {
  id: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | null
  tags: string[]
  description: string
  help: string
  helpUrl: string
  nodes: AxeNode[]
}

export interface AxeInapplicable {
  id: string
  impact: null
  tags: string[]
  description: string
  help: string
  helpUrl: string
  nodes: AxeNode[]
}

export interface AxeNode {
  html: string
  target: string[]
  failureSummary?: string
  any?: Array<{ id: string; message: string }>
  all?: Array<{ id: string; message: string }>
  none?: Array<{ id: string; message: string }>
}

/**
 * Check accessibility of a Coral spec using axe-core
 * @param spec - The Coral root node to check
 * @returns Promise with accessibility results including violations, passes, incomplete, and inapplicable rules
 */
export async function checkAccessibility(spec: CoralRootNode): Promise<AccessibilityResults> {
  try {
    // Convert Coral spec to HTML
    const html = await coralToHTML(spec)

    // Create a temporary container element in the browser DOM
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '-9999px'
    container.style.width = '1px'
    container.style.height = '1px'
    container.style.overflow = 'hidden'
    container.setAttribute('aria-hidden', 'true')
    container.innerHTML = html

    // Append to body temporarily
    document.body.appendChild(container)

    try {
      // Setup axe-core with the container
      axe.setup(container)

      // Configure axe (no need to disable color-contrast in browser)
      const config = {}

      // Run accessibility check on the container
      const results = await axe.run(container, config)

      // Teardown axe
      axe.teardown()

      // Return structured results with timestamp
      return {
        violations: results.violations as AxeViolation[],
        passes: results.passes as AxePass[],
        incomplete: results.incomplete as AxeIncomplete[],
        inapplicable: results.inapplicable as AxeInapplicable[],
        lastChecked: new Date().toISOString(),
      }
    } finally {
      // Always clean up the temporary container
      document.body.removeChild(container)
    }
  } catch (error) {
    // If HTML generation fails or axe check fails, throw error
    throw new Error(`Accessibility check failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}
