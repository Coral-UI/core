import { FigmaLogo, Trash } from '@phosphor-icons/react'

import { IMPORT_SPEC } from '../../plugin/lib/events'
import { Button } from '../components/Button'
import { Editor } from '../components/Editor'
import { useSpecValue } from '../state/specValue'

export const Import = () => {
  const { value, setValue } = useSpecValue()

  const handleClickImport = () => {
    parent.postMessage({ pluginMessage: { type: IMPORT_SPEC, message: JSON.parse(value) } }, '*')
  }

  const handleClickClear = () => {
    setValue('')
  }

  return (
    <div className="flex flex-col px-4">
      <div className="my-6">
        <Editor language="json" />
        <div className="flex gap-2 py-4 mt-6 border-t border-border">
          <Button icon={FigmaLogo} iconPosition="left" onClick={handleClickImport}>
            Import to Figma
          </Button>
          <Button variant="destructive" icon={Trash} iconPosition="left" onClick={handleClickClear}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
