import { NavBar } from '@/components/NavBar'
import { Toaster } from '@/components/ui/sonner'
import { createRootRoute, Outlet } from '@tanstack/react-router'

const RootLayout = () => (
  <div>
    <NavBar />
    <div className="pt-12">
      <Outlet />
    </div>
    <Toaster richColors expand={false} />
  </div>
)

export const Route = createRootRoute({ component: RootLayout })
