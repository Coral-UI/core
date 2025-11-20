'use client'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CardGrid } from '@/components/CardGrid'
import { ComponentCard } from '@/components/Library/ComponentCard'
import { CreateComponentDialog } from '@/components/Library/CreateComponentDialog'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  aggregateAccessibilityResults,
  formatAccessibilityStatus,
  getAccessibilityBadgeVariant,
} from '@/lib/accessibility/utils'
import { componentsQueryOptions, libraryQueryOptions } from '@/lib/queries/query-options'
import { Component } from '@/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useMemo } from 'react'

type Props = {
  orgId: string
  libraryId: string
}

export function LibraryDetailClient({ orgId, libraryId }: Props) {
  const { data: library } = useSuspenseQuery(libraryQueryOptions(libraryId))
  const { data: components = [] } = useSuspenseQuery(componentsQueryOptions(libraryId))

  const libraryAccessibility = useMemo(() => aggregateAccessibilityResults(components), [components])
  const badgeVariant = getAccessibilityBadgeVariant(libraryAccessibility)

  if (!library) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Library not found</div>
        <Link href={`/orgs/${orgId}`}>
          <Button variant="outline" className="mt-4">
            Back to Organization
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <Breadcrumbs className="mb-4" />
      <PageHeader title={library.name} description="Manage components in this library">
        <div className="flex items-center gap-2">
          {components.length > 0 && (
            <Badge variant={badgeVariant} className="text-xs">
              {formatAccessibilityStatus(libraryAccessibility)}
            </Badge>
          )}
          <Link href={`/orgs/${orgId}/libraries/${libraryId}/tokens`}>
            <Button variant="outline">Design Tokens</Button>
          </Link>
          <Link href={`/orgs/${orgId}/libraries/${libraryId}/css-reset`}>
            <Button variant="outline">CSS Reset</Button>
          </Link>
          <CreateComponentDialog libraryId={libraryId} />
        </div>
      </PageHeader>

      <CardGrid
        itemList={components}
        type="components"
        itemComponent={(component) => (
          <ComponentCard component={component as Component} organizationId={orgId} libraryId={libraryId} />
        )}
      >
        <CreateComponentDialog libraryId={libraryId} />
      </CardGrid>
    </div>
  )
}
