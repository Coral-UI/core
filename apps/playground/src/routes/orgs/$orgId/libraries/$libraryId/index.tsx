// import { LibraryDetail } from '@/components/Library/LibraryDetail'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CardGrid } from '@/components/CardGrid'
import { ComponentCard } from '@/components/Library/ComponentCard'
import { CreateComponentDialog } from '@/components/Library/CreateComponentDialog'
import { LoadingContent } from '@/components/LoadingContent'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { aggregateAccessibilityResults, formatAccessibilityStatus, getAccessibilityBadgeVariant } from '@/lib/accessibility/utils'
import { useComponents } from '@/hooks/queries/useComponents'
import { useLibrary } from '@/hooks/queries/useLibraries'
import { Component } from '@/types'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'

export const Route = createFileRoute('/orgs/$orgId/libraries/$libraryId/')({
  component: LibraryDetail,
})

function LibraryDetail() {
  const { orgId, libraryId } = Route.useParams()
  const { data: library, isLoading: libLoading } = useLibrary(libraryId)
  const { data: components = [], isLoading: compsLoading } = useComponents(libraryId)

  const libraryAccessibility = useMemo(() => aggregateAccessibilityResults(components), [components])
  const badgeVariant = getAccessibilityBadgeVariant(libraryAccessibility)

  if (libLoading || compsLoading) {
    return <LoadingContent type="libraries" />
  }

  if (!library) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Library not found</div>
        <Link to="/orgs/$orgId" params={{ orgId }}>
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
          <Link to="/orgs/$orgId/libraries/$libraryId/tokens" params={{ orgId, libraryId }}>
            <Button variant="outline">Design Tokens</Button>
          </Link>
          <Link to="/orgs/$orgId/libraries/$libraryId/css-reset" params={{ orgId, libraryId }}>
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
