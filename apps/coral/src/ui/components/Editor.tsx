import MonacoEditor, { useMonaco } from '@monaco-editor/react'
import { useCallback } from 'react'

import { useFigmaTheme } from '../hooks/useFigmaTheme'

import { useSpecValue } from '../state/specValue'

type EditorProps = {
  handleChange?: (value: string) => void
  language: 'javascript' | 'json'
  height?: number
}

export const Editor = ({ language = 'javascript', height = 754, handleChange = () => {} }: EditorProps) => {
  const { value, setValue } = useSpecValue()
  const { isDarkTheme } = useFigmaTheme()

  const monaco = useMonaco()

  monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
    schemas: [
      {
        fileMatch: ['*'],
        uri: 'https://coral.design/schema.json',
      },
    ],
    enableSchemaRequest: true,
  })

  const onChangeHandler = useCallback(
    (newvalue: string | undefined) => {
      if (newvalue) {
        handleChange(newvalue)
        setValue(newvalue)
      }
    },
    [handleChange, setValue],
  )

  return (
    <div className="overflow-hidden border border-border">
      <MonacoEditor
        value={value}
        onChange={onChangeHandler}
        language={language}
        height={height}
        theme={isDarkTheme ? 'vs-dark' : 'vs-light'}
        // className={className}
        options={{
          minimap: {
            enabled: false,
          },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          fontSize: 11,
          wordWrap: 'on',
          useTabStops: false,
          tabSize: 2,
          contextmenu: false,
        }}
      />
    </div>
  )
}
