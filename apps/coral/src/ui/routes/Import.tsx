import { IMPORT_SPEC } from '../../plugin/lib/events'
import { Button } from '../components/Button'
import { Editor } from '../components/Editor'
import { useSpecValue } from '../state/specValue'

export const Import = () => {
  const { value } = useSpecValue()

  const handleClickImport = () => {
    parent.postMessage({ pluginMessage: { type: IMPORT_SPEC, message: JSON.parse(value) } }, '*')
  }

  return (
    <div>
      <header className="flex items-center justify-between px-4 py-2">
        <h1 className="text-xl font-regular text-white">Import</h1>
      </header>
      <Editor language="json" />
      <div className="flex gap-2 p-4 border-t border-white/10">
        <Button onClick={handleClickImport}>Import to Spec</Button>
      </div>
    </div>
  )
}
