import clsx from 'clsx'

import { useRoute } from '../state/route'

const NavButton = ({
  children,
  onClick,
  isActive,
}: {
  children: React.ReactNode
  onClick: () => void
  isActive: boolean
}) => {
  return (
    <button
      className={clsx(
        'hover:text-foreground/80 font-semibold tracking-tight text-xs text-foreground/60 py-1.5 px-4 rounded-md hover:bg-primary/5 transition-colors',
        isActive && 'text-primary bg-primary/20 hover:bg-primary/20 hover:text-primary',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export const Header = () => {
  const { setRoute, route } = useRoute()
  return (
    <header className="flex items-center justify-between p-4 border-b border-border h-14">
      <h1 className="text-xl font-medium text-white">🪸 CoralUI</h1>
      <div className="flex items-center text-sm gap-1">
        <NavButton isActive={route === 'import'} onClick={() => setRoute('import')}>
          Import Spec
        </NavButton>
        <NavButton isActive={route === 'export'} onClick={() => setRoute('export')}>
          Export Spec
        </NavButton>
        <NavButton isActive={route === 'preview'} onClick={() => setRoute('preview')}>
          Preview
        </NavButton>
        <NavButton isActive={route === 'settings'} onClick={() => setRoute('settings')}>
          Settings
        </NavButton>
      </div>
    </header>
  )
}
