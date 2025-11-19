import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CardGrid } from '@/components/CardGrid'
import { LoadingContent } from '@/components/LoadingContent'
import { CreateLibraryDialog } from '@/components/Organization/CreateLibraryDialog'
import { LibraryCard } from '@/components/Organization/LibraryCard'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { useLibraries } from '@/hooks/queries/useLibraries'
import { useOrganization } from '@/hooks/queries/useOrganizations'
import { Library } from '@/types'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/orgs/$orgId/')({
  component: OrganizationDetailRoute,
})

function OrganizationDetailRoute() {
  const { orgId } = Route.useParams()
  const { data: organization, isLoading: orgLoading } = useOrganization(orgId)
  const { data: libraries = [], isLoading: libsLoading } = useLibraries(orgId)

  if (orgLoading || libsLoading) {
    return <LoadingContent type="libraries" />
  }

  if (!organization) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Organization not found</div>
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
