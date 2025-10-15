import { Link } from '@tanstack/react-router'

export const NavBar = () => {
  return (
    <div className="border-b border-border fixed top-0 left-0 right-0 z-50 bg-background">
      <div className="container mx-auto">
        <nav className="p-2 flex gap-2">
          <Link to="/" className="[&.active]:font-semibold">
            Home
          </Link>
          <Link to="/playground" className="[&.active]:font-semibold">
            Playground
          </Link>
          <Link to="/editor" className="[&.active]:font-semibold">
            Editor
          </Link>
        </nav>
      </div>
    </div>
  )
}
