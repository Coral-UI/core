import type { AccessibilityResults } from '@/lib/accessibility/checkAccessibility'
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@/components/primitives/Accordion/accordion'
import { Badge } from '@/components/primitives/Badge/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/primitives/Empty/Empty'
import { ScrollArea } from '@/components/primitives/ScrollArea/ScrollArea'
import { getAccessibilitySummary } from '@/lib/accessibility/utils'
import { formatDateTime } from '@/lib/utils/date-format'
import { AlertCircleIcon, CheckCircleIcon, InfoIcon, LoaderIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Card } from '@/components/primitives/Card/card'

interface AccessibilityPanelProps {
  accessibility?: AccessibilityResults
  isChecking?: boolean
}

const IMPACT_COLORS = {
  critical: 'destructive',
  serious: 'destructive',
  moderate: 'secondary',
  minor: 'secondary',
} as const

export function AccessibilityPanel({ accessibility, isChecking = false }: AccessibilityPanelProps) {
  const summary = useMemo(() => getAccessibilitySummary(accessibility), [accessibility])

  // Group violations by impact level
  const violationsByImpact = useMemo(() => {
    if (!accessibility) return {}
    const grouped: Record<string, typeof accessibility.violations> = {
      critical: [],
      serious: [],
      moderate: [],
      minor: [],
    }

    accessibility.violations.forEach((violation) => {
      if (violation.impact && violation.impact in grouped) {
        grouped[violation.impact]?.push(violation)
      }
    })

    return grouped
  }, [accessibility])

  if (isChecking) {
    return (
      <div className="flex flex-col h-full">
        <div className="pt-1.5 px-2.5">
          <p className="text-sm font-medium text-muted-foreground">Accessibility</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-2">
            <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Checking accessibility...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!accessibility) {
    return (
      <div className="flex flex-col h-full ">
        <div className="pt-1.5 px-2.5">
          <p className="text-sm font-medium text-muted-foreground">Accessibility</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <InfoIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle>No accessibility data</EmptyTitle>
              <EmptyDescription>Save the component to run accessibility checks</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </div>
    )
  }

  const hasViolations = accessibility.violations.length > 0
  const hasWarnings = accessibility.incomplete.length > 0
  const hasPasses = accessibility.passes.length > 0

  return (
    <div >
      <div className="pt-1.5 px-2.5 pb-2">
        <p className="text-xs font-medium text-muted-foreground mb-2">Accessibility</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {summary.errors > 0 && (
            <Badge variant="destructive">
              <AlertCircleIcon className="size-3" />
              {summary.errors} {summary.errors === 1 ? 'error' : 'errors'}
            </Badge>
          )}
          {summary.warnings > 0 && (
            <Badge variant="secondary">
              <InfoIcon className="size-3" />
              {summary.warnings} {summary.warnings === 1 ? 'warning' : 'warnings'}
            </Badge>
          )}
          {summary.passes > 0 && (
            <Badge variant="success">
              <CheckCircleIcon className="size-3" />
              {summary.passes} {summary.passes === 1 ? 'pass' : 'passes'}
            </Badge>
          )}
        </div>
        {accessibility.lastChecked && (
          <p className="text-xs text-muted-foreground">Last checked: {formatDateTime(accessibility.lastChecked)}</p>
        )}
      </div>

      <ScrollArea className="flex-1 px-2.5">
        <div className="flex flex-col gap-4 pb-2.5">
          {hasViolations && (
            <div>
              <h3 className="text-sm font-medium mb-2">Violations</h3>
              <Accordion multiple={true} className="w-full">
                {Object.entries(violationsByImpact).map(([impact, violations]) => {
                  if (violations.length === 0) return null
                  return (
                    <AccordionItem key={impact} value={impact}>
                      <AccordionHeader>
                        <AccordionTrigger className="text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant={IMPACT_COLORS[impact as keyof typeof IMPACT_COLORS] || 'secondary'}>
                              {impact}
                            </Badge>
                            <span>
                              {violations.length} {violations.length === 1 ? 'violation' : 'violations'}
                            </span>
                          </div>
                        </AccordionTrigger>
                      </AccordionHeader>
                      <AccordionPanel>
                        <div className="flex flex-col gap-4">
                          {violations.map((violation) => (
                            <div key={violation.id} className="border-l-2 border-destructive pl-3 py-2">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium">{violation.help}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{violation.description}</p>
                                </div>
                                <a
                                  href={violation.helpUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline shrink-0"
                                >
                                  Learn more
                                </a>
                              </div>
                              <div className="mt-2 space-y-2">
                                {violation.nodes.map((node, idx) => (
                                  <div key={idx} className="text-xs">
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">
                                      {node.target.join(' ')}
                                    </code>
                                    {node.failureSummary && (
                                      <p className="text-muted-foreground mt-1">{node.failureSummary}</p>
                                    )}
                                    <details className="mt-1">
                                      <summary className="text-muted-foreground cursor-pointer text-[10px]">
                                        View HTML
                                      </summary>
                                      <pre className="mt-1 text-[10px] bg-muted p-2 rounded overflow-auto max-h-32">
                                        {node.html}
                                      </pre>
                                    </details>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionPanel>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          )}

          {hasWarnings && (
            <div>
              <h3 className="text-sm font-medium mb-2">Warnings</h3>
              <Accordion multiple={true} className="w-full">
                {accessibility.incomplete.map((incomplete) => (
                  <AccordionItem key={incomplete.id} value={incomplete.id}>
                    <AccordionHeader>
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Warning</Badge>
                          <span>{incomplete.help}</span>
                        </div>
                      </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionPanel>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">{incomplete.description}</p>
                        <a
                          href={incomplete.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Learn more
                        </a>
                        {incomplete.nodes.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {incomplete.nodes.map((node, idx) => (
                              <code key={idx} className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono block">
                                {node.target.join(' ')}
                              </code>
                            ))}
                          </div>
                        )}
                      </div>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {hasPasses && !hasViolations && !hasWarnings && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircleIcon className="size-8 text-accent-green-fg mb-2" />
              <p className="text-sm font-medium">All checks passed!</p>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.passes} accessibility {summary.passes === 1 ? 'check' : 'checks'} passed
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
