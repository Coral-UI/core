import { makeQueryClient } from '@/app/get-query-client'
import { Button } from '@/components/ui/button'
import { librariesQueryOptions, organizationQueryOptions } from '@/lib/queries/query-options'
import { getLibrariesServer, getOrganizationServer } from '@/lib/queries/server-query-functions'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import Link from 'next/link'

import { OrganizationDetailClient } from './client'

type Props = {
  params: Promise<{ orgId: string }>
}

export default async function OrganizationDetailPage({ params }: Props) {
  const { orgId } = await params

  if (!orgId || orgId.trim() === '') {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Invalid organization ID</div>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  const queryClient = makeQueryClient()

  // Use server-side functions for prefetching
  await Promise.all([
    queryClient.prefetchQuery({
      ...organizationQueryOptions(orgId),
      queryFn: () => getOrganizationServer(orgId),
    }),
    queryClient.prefetchQuery({
      ...librariesQueryOptions(orgId),
      queryFn: () => getLibrariesServer(orgId),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrganizationDetailClient orgId={orgId} />
    </HydrationBoundary>
  )
}
