// import Editor, { useMonaco } from '@monaco-editor/react'
import { FigmaLogoIcon, TrashIcon } from '@phosphor-icons/react'

import { IMPORT_SPEC } from '../../plugin/lib/events'
import { Editor } from '../components/Editor'
import { Button } from '../components/ui/button'
import { useSpecValue } from '../state/specValue'

export const Import = () => {
  const { value, setValue } = useSpecValue()
  // const monaco = useMonaco()

  // monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
  //   schemas: [
  //     {
  //       fileMatch: ['*'],
  //       uri: 'https://schemas.tokens.studio/latest/tokens-schema.json',
  //     },
  //   ],
  //   enableSchemaRequest: true,
  // })

  const handleClickImport = () => {
    parent.postMessage({ pluginMessage: { type: IMPORT_SPEC, message: JSON.parse(value) } }, '*')
  }

  const handleClickClear = () => {
    setValue('')
  }

  return (
    <div className="">
      <div>
        <Editor language="json" />
        <div className="flex gap-2 mt-4 px-5 items-start justify-end bg-surface">
          <Button onClick={handleClickImport}>
            <FigmaLogoIcon />
            Import to Figma
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
