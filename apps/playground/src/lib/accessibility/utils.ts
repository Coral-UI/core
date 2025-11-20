import type { Component } from '@/types'

import type { AccessibilityResults } from './checkAccessibility'

export const IMPACT_LEVELS = ['critical', 'serious', 'moderate', 'minor'] as const

export type ImpactLevel = (typeof IMPACT_LEVELS)[number]

export interface AccessibilitySummary {
  errors: number
  warnings: number
  passes: number
}

/**
 * Get accessibility summary counts from accessibility results
 */
export function getAccessibilitySummary(accessibility?: AccessibilityResults): AccessibilitySummary {
  if (!accessibility) {
    return { errors: 0, warnings: 0, passes: 0 }
  }

  return {
    errors: accessibility.violations.length,
    warnings: accessibility.incomplete.length,
    passes: accessibility.passes.length,
  }
}

/**
 * Format accessibility status for display
 */
export function formatAccessibilityStatus(summary: AccessibilitySummary): string {
  const parts: string[] = []

  if (summary.errors > 0) {
    parts.push(`${summary.errors} ${summary.errors === 1 ? 'error' : 'errors'}`)
  }

  if (summary.warnings > 0) {
    parts.push(`${summary.warnings} ${summary.warnings === 1 ? 'warning' : 'warnings'}`)
  }

  if (summary.passes > 0) {
    parts.push(`${summary.passes} ${summary.passes === 1 ? 'pass' : 'passes'}`)
  }

  return parts.length > 0 ? parts.join(', ') : 'No checks'
}

/**
 * Aggregate accessibility results across multiple components
 */
export function aggregateAccessibilityResults(components: Component[]): AccessibilitySummary {
  const totals = components.reduce(
    (acc, component) => {
      const summary = getAccessibilitySummary(component.accessibility)
      return {
        errors: acc.errors + summary.errors,
        warnings: acc.warnings + summary.warnings,
        passes: acc.passes + summary.passes,
      }
    },
    { errors: 0, warnings: 0, passes: 0 },
  )

  return totals
}

/**
 * Get accessibility status badge variant based on results
 */
export function getAccessibilityBadgeVariant(
  summary: AccessibilitySummary,
): 'destructive' | 'warning' | 'success' | 'secondary' {
  if (summary.errors > 0) {
    return 'destructive'
  }
  if (summary.warnings > 0) {
    return 'warning'
  }
  if (summary.passes > 0) {
    return 'success'
  }
  return 'secondary'
}
