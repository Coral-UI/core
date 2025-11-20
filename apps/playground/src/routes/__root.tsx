import { NavBar } from '@/components/NavBar'
import { Toaster } from '@/components/ui/sonner'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'

import { LoadingContent } from '@/components/LoadingContent'

interface RouterContext {
  queryClient: QueryClient
}

const RootLayout = () => (
  <div>
    <NavBar />
    <div className="pt-12">
      <Suspense fallback={<LoadingContent type="libraries" />}>
        <Outlet />
      </Suspense>
    </div>
    <Toaster richColors expand={false} />
  </div>
)

export const Route = createRootRouteWithContext<RouterContext>()({ component: RootLayout })
