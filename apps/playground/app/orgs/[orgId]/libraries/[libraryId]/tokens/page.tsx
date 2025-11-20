import { makeQueryClient } from '@/app/get-query-client'
import { libraryQueryOptions, themesQueryOptions, tokensQueryOptions } from '@/lib/queries/query-options'
import { getLibraryServer, getThemesServer, getTokensServer } from '@/lib/queries/server-query-functions'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { TokensClient } from './client'

type Props = {
  params: Promise<{ orgId: string; libraryId: string }>
}

export default async function TokensPage({ params }: Props) {
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
      ...tokensQueryOptions(libraryId),
      queryFn: () => getTokensServer(libraryId),
    }),
    queryClient.prefetchQuery({
      ...themesQueryOptions(libraryId),
      queryFn: () => getThemesServer(libraryId),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TokensClient orgId={(await params).orgId} libraryId={libraryId} />
    </HydrationBoundary>
  )
}
