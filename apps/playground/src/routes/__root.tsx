import { NavBar } from '@/components/NavBar'
import { Toaster } from '@/components/ui/sonner'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout = () => (
  <>
    <NavBar />
    <Outlet />
    <TanStackRouterDevtools />
    <Toaster richColors expand={false} />
  </>
)

export const Route = createRootRoute({ component: RootLayout })
