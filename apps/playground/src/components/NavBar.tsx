import { Link } from '@tanstack/react-router'
import { ModeToggle } from './ThemeToggle'

export const NavBar = () => {
  return (
    <div className="border-b border-border bg-background fixed top-0 left-0 right-0 z-50">
      <div className="px-4 mx-auto flex items-center justify-between  h-12">
        <nav className="py-2 flex gap-2 text-sm">
          <Link to="/" className="[&.active]:font-semibold ">
            Home
          </Link>
          <Link to="/playground" className="[&.active]:font-semibold">
            Playground
          </Link>
          <Link to="/editor" className="[&.active]:font-semibold">
            Editor
          </Link>
        </nav>
        <ModeToggle />
      </div>
    </div>
  )
}
