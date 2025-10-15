import { ExportIcon, TrashIcon } from '@phosphor-icons/react'

import { EXPORT_SPEC } from '../../plugin/lib/events'
import { Button } from '../components/ui/button'
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
    <div className="">
      <div>
        <Editor language="json" />
        <div className="flex gap-2 mt-4 px-5 items-start justify-end bg-surface">
          <Button onClick={handleClickExport}>
            <ExportIcon />
            Export to Spec
          </Button>
          <Button variant="ghost" onClick={handleClickClear}>
            <TrashIcon />
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
