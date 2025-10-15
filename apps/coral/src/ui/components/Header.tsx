import { Button } from '@/ui/components/ui/button'

import { useRoute } from '../state/route'

export const Header = () => {
  const { setRoute, route } = useRoute()
  return (
    <header className="flex items-center justify-between border-b border-border px-5 py-4">
      <h1 className="text-sm font-medium text-foreground">🪸 CoralUI</h1>
      <div className="flex items-center gap-1">
        <Button variant={route === 'import' ? 'default' : 'secondary'} onClick={() => setRoute('import')} size="sm">
          Import Spec
        </Button>
        <Button variant={route === 'export' ? 'default' : 'secondary'} size="sm" onClick={() => setRoute('export')}>
          Export Spec
        </Button>
        <Button variant={route === 'preview' ? 'default' : 'secondary'} size="sm" onClick={() => setRoute('preview')}>
          Preview
        </Button>
        <Button variant={route === 'settings' ? 'default' : 'secondary'} size="sm" onClick={() => setRoute('settings')}>
          Settings
        </Button>
      </div>
    </header>
  )
}
