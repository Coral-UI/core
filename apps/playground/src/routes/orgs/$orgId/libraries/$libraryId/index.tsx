import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CardGrid } from '@/components/CardGrid'
import { ComponentCard } from '@/components/Library/ComponentCard'
import { CreateComponentDialog } from '@/components/Library/CreateComponentDialog'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { aggregateAccessibilityResults, formatAccessibilityStatus, getAccessibilityBadgeVariant } from '@/lib/accessibility/utils'
import { componentsQueryOptions, libraryQueryOptions } from '@/lib/queries/query-options'
import { Component } from '@/types'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const Route = createFileRoute('/orgs/$orgId/libraries/$libraryId/')({
  loaderDeps: ({ params }) => {
    // Defensively handle params being undefined
    if (!params) {
      return { libraryId: '' }
    }
    const libraryId = params.libraryId || ''
    return { libraryId }
  },
  loader: ({ context, deps }) => {
    if (!deps.libraryId || deps.libraryId.trim() === '') {
      // Don't throw error, just return empty promises - component will handle missing libraryId
      return Promise.resolve([])
    }
    return Promise.all([
      context.queryClient.ensureQueryData(libraryQueryOptions(deps.libraryId)),
      context.queryClient.ensureQueryData(componentsQueryOptions(deps.libraryId)),
    ])
  },
  component: LibraryDetail,
})

function LibraryDetail() {
  const params = Route.useParams()
  const orgId = params.orgId
  const libraryId = params.libraryId

  // If libraryId is missing or empty, show error (hooks must be called unconditionally)
  // But we'll use a safe fallback to prevent query errors
  const safeLibraryId = libraryId || ''

  const { data: library } = useSuspenseQuery(libraryQueryOptions(safeLibraryId))
  const { data: components = [] } = useSuspenseQuery(componentsQueryOptions(safeLibraryId))

  if (!libraryId || libraryId.trim() === '' || !library) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">{libraryId ? 'Library not found' : 'Invalid library ID'}</div>
        {orgId && (
          <Link to="/orgs/$orgId" params={{ orgId }}>
            <Button variant="outline" className="mt-4">
              Back to Organization
            </Button>
          </Link>
        )}
      </div>
    )
  }

  const libraryAccessibility = useMemo(() => aggregateAccessibilityResults(components), [components])
  const badgeVariant = getAccessibilityBadgeVariant(libraryAccessibility)

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
