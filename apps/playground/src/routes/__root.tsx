import { NavBar } from '@/components/NavBar'
import { Toaster } from '@/components/ui/sonner'
import { createRootRoute, Outlet } from '@tanstack/react-router'

const RootLayout = () => (
  <>
    <NavBar />
    <Outlet />
    <Toaster richColors expand={false} />
  </>
)

export const Route = createRootRoute({ component: RootLayout })
