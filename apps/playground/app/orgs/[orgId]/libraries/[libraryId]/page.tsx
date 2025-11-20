import { makeQueryClient } from '@/app/get-query-client'
import { Button } from '@/components/ui/button'
import { componentsQueryOptions, libraryQueryOptions } from '@/lib/queries/query-options'
import { getComponentsServer, getLibraryServer } from '@/lib/queries/server-query-functions'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import Link from 'next/link'

import { LibraryDetailClient } from './client'

type Props = {
  params: Promise<{ orgId: string; libraryId: string }>
}

export default async function LibraryDetailPage({ params }: Props) {
  const { orgId, libraryId } = await params

  if (!libraryId || libraryId.trim() === '') {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Invalid library ID</div>
        {orgId && (
          <Link href={`/orgs/${orgId}`}>
            <Button variant="outline" className="mt-4">
              Back to Organization
            </Button>
          </Link>
        )}
      </div>
    )
  }

  const queryClient = makeQueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      ...libraryQueryOptions(libraryId),
      queryFn: () => getLibraryServer(libraryId),
    }),
    queryClient.prefetchQuery({
      ...componentsQueryOptions(libraryId),
      queryFn: () => getComponentsServer(libraryId),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryDetailClient orgId={orgId} libraryId={libraryId} />
    </HydrationBoundary>
  )
}
