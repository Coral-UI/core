import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CardGrid } from '@/components/CardGrid'
import { CreateLibraryDialog } from '@/components/Organization/CreateLibraryDialog'
import { LibraryCard } from '@/components/Organization/LibraryCard'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { libraryQueryOptions, librariesQueryOptions, organizationQueryOptions } from '@/lib/queries/query-options'
import { Library } from '@/types'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/orgs/$orgId/')({
  loaderDeps: ({ params }) => {
    // Defensively handle params being undefined (shouldn't happen but can during navigation)
    if (!params) {
      return { orgId: '' }
    }
    // Use optional chaining to safely access params.orgId
    const orgId = params.orgId || ''
    return { orgId }
  },
  loader: ({ context, deps }) => {
    if (!deps.orgId || deps.orgId.trim() === '') {
      // Don't throw error, just return empty promises - component will handle missing orgId
      return Promise.resolve([])
    }
    return Promise.all([
      context.queryClient.ensureQueryData(organizationQueryOptions(deps.orgId)),
      context.queryClient.ensureQueryData(librariesQueryOptions(deps.orgId)),
    ])
  },
  component: OrganizationDetailRoute,
})

function OrganizationDetailRoute() {
  const params = Route.useParams()
  const orgId = params.orgId

  // If orgId is missing or empty, show error (hooks must be called unconditionally)
  // But we'll use a safe fallback to prevent query errors
  const safeOrgId = orgId || ''

  const { data: organization } = useSuspenseQuery(organizationQueryOptions(safeOrgId))
  const { data: libraries = [] } = useSuspenseQuery(librariesQueryOptions(safeOrgId))

  if (!orgId || orgId.trim() === '' || !organization) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">{orgId ? 'Organization not found' : 'Invalid organization ID'}</div>
        <Link to="/">
          <Button variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <Breadcrumbs className="mb-4" />
      <PageHeader title={organization.name} description="Manage libraries and components">
        <CreateLibraryDialog organizationId={orgId} />
      </PageHeader>

      <CardGrid
        itemList={libraries}
        type="libraries"
        itemComponent={(library) => <LibraryCard library={library as Library} organizationId={orgId} />}
      >
        <CreateLibraryDialog organizationId={orgId} />
      </CardGrid>
    </div>
  )
}
