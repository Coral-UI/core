import { FileImage, Trash } from '@phosphor-icons/react'

import { EXPORT_SPEC } from '../../plugin/lib/events'
import { Button } from '../components/Button'
import { Editor } from '../components/Editor'
import { useSpecValue } from '../state/specValue'

export const Export = () => {
  const { setValue } = useSpecValue()
  const handleClickExport = () => {
    parent.postMessage({ pluginMessage: { type: EXPORT_SPEC } }, '*')
  }

  const handleClickClear = () => {
    setValue('')
  }

  return (
    <div className="flex flex-col px-4">
      <div className="my-6">
        <Editor language="json" className="flex-1" />
        <div className="flex gap-2 py-4 mt-6 border-t border-border">
          <Button icon={FileImage} iconPosition="left" onClick={handleClickExport}>
            Export to Spec
          </Button>
          <Button variant="destructive" icon={Trash} iconPosition="left" onClick={handleClickClear}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
