import { makeQueryClient } from '@/app/get-query-client'
import { libraryCssResetQueryOptions, libraryQueryOptions } from '@/lib/queries/query-options'
import { getLibraryCssResetServer, getLibraryServer } from '@/lib/queries/server-query-functions'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { CssResetClient } from './client'

type Props = {
  params: Promise<{ orgId: string; libraryId: string }>
}

export default async function CssResetPage({ params }: Props) {
  const { libraryId } = await params

  if (!libraryId || libraryId.trim() === '') {
    return null
  }

  const queryClient = makeQueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      ...libraryQueryOptions(libraryId),
      queryFn: () => getLibraryServer(libraryId),
    }),
    queryClient.prefetchQuery({
      ...libraryCssResetQueryOptions(libraryId),
      queryFn: () => getLibraryCssResetServer(libraryId),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CssResetClient orgId={(await params).orgId} libraryId={libraryId} />
    </HydrationBoundary>
  )
}
