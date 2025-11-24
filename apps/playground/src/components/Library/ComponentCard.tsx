'use client'

import type { Component } from '@/types'
import { Button } from '@/components/primitives/Button/button'
import { Badge } from '@/components/primitives/Badge/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/primitives/Card/card'
import { useDeleteComponent } from '@/hooks/queries/useComponents'
import { formatAccessibilityStatus, getAccessibilityBadgeVariant, getAccessibilitySummary } from '@/lib/accessibility/utils'
import { formatDateReadable } from '@/lib/utils/date-format'
import Link from 'next/link'
import { EditIcon, Trash2Icon } from 'lucide-react'

interface ComponentCardProps {
  component: Component
  organizationId: string
  libraryId: string
}

export function ComponentCard({ component, organizationId, libraryId }: ComponentCardProps) {
  const deleteComponent = useDeleteComponent()
  const accessibilitySummary = getAccessibilitySummary(component.accessibility)
  const badgeVariant = getAccessibilityBadgeVariant(accessibilitySummary)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete "${component.name}"?`)) {
      deleteComponent.mutate({ id: component.id, libraryId })
    }
  }

  return (
    <Link href={`/orgs/${organizationId}/libraries/${libraryId}/components/${component.id}/edit`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {component.name}
                <EditIcon className="size-4 text-muted-foreground" />
              </CardTitle>
              {component.description && <CardDescription className="mt-1">{component.description}</CardDescription>}
              <CardDescription className="mt-1">
                Created {formatDateReadable(component.createdAt)}
              </CardDescription>
              {component.accessibility && (
                <div className="mt-2">
                  <Badge variant={badgeVariant} className="text-xs">
                    {formatAccessibilityStatus(accessibilitySummary)}
                  </Badge>
                  {component.accessibility.lastChecked && (
                    <CardDescription className="mt-1 text-xs">
                      Checked {formatDateReadable(component.accessibility.lastChecked)}
                    </CardDescription>
                  )}
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon-sm" onClick={handleDelete} className="shrink-0">
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Click to edit component</p>
        </CardContent>
      </Card>
    </Link>
  )
}
