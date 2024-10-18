import { useRoute } from '../state/route'
import { Button } from './Button'

export const Header = () => {
  const { setRoute } = useRoute()
  return (
    <header className="flex items-center justify-between p-4 border-b border-white/5">
      <h1 className="text-md font-medium text-white">🪸 CoralUI</h1>
      <div className="flex items-center gap-2">
        <Button onClick={() => setRoute('import')}>Import Spec</Button>
        <Button onClick={() => setRoute('export')}>Export Spec</Button>
        <Button onClick={() => setRoute('preview')}>Preview</Button>
        <Button onClick={() => setRoute('settings')}>Settings</Button>
      </div>
    </header>
  )
}
