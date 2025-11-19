import { ModeToggle } from './ThemeToggle'

export const NavBar = () => {
  return (
    <div className="border-b border-border bg-muted fixed top-0 left-0 right-0 z-50">
      <div className={`px-4 mx-auto flex items-center justify-between py-2`}>
        <h1 className="text-base font-medium tracking-tight">Coral</h1>
        <ModeToggle />
      </div>
    </div>
  )
}
