import { EXPORT_SPEC } from '../../plugin/lib/events'
import { Button } from '../components/Button'
import { Editor } from '../components/Editor'

export const Export = () => {
  const handleClickExport = () => {
    parent.postMessage({ pluginMessage: { type: EXPORT_SPEC } }, '*')
  }

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-4 py-2">
        <h1 className="text-xl font-regular text-white">Export</h1>
      </header>
      <Editor language="json" className="flex-1" />
      <div className="flex gap-2 p-4 border-t border-white/10">
        <Button onClick={handleClickExport}>Export to Spec</Button>
      </div>
    </div>
  )
}
