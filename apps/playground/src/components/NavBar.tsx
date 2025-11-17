import { useIsElectron } from '@/hooks/useIsElectron'
import { IconHome, IconIcons, IconTransformFilled } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

import { ModeToggle } from './ThemeToggle'

const links = [
  {
    to: '/',
    label: 'Home',
    icon: IconHome,
  },
  {
    to: '/editor',
    label: 'Editor',
    icon: IconIcons,
  },
  {
    to: '/convert',
    label: 'Convert',
    icon: IconTransformFilled,
  },
]

export const NavBar = () => {
  const electron = useIsElectron()

  return (
    <div
      className="border-b border-border bg-background fixed top-0 left-0 right-0 z-50"
      style={{ appRegion: 'drag' } as React.CSSProperties}
    >
      <div
        className={`px-4 mx-auto flex items-center justify-between  ${electron.isElectron ? (electron.isMac ? 'pl-20' : 'pl-20') : ''}`}
        style={{ appRegion: 'no-drag' } as React.CSSProperties}
      >
        <nav className="flex text-xs divide-x divide-border border-x border-border">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="[&.active]:bg-sidebar [&.active]:text-foreground inline-flex items-center gap-2.5 px-3.5 text-muted-foreground/80 py-3 [&.active>svg]:text-blue-300"
              style={{ appRegion: 'no-drag' } as React.CSSProperties}
            >
              <link.icon className="size-3.5" />
              {link.label}
            </Link>
          ))}
        </nav>
        <ModeToggle />
      </div>
    </div>
  )
}
