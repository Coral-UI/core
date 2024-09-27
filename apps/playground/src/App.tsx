import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import CodeMirror from '@uiw/react-codemirror'
import React from 'react'

import { transformHTMLToSpec, transformReactComponentToSpec } from '@reallygoodwork/coral-core'

import { TabButtons } from './components/TabButtons'

function App() {
  const [codeMirrorInputValue, setCodeMirrorInputValue] = React.useState<string>('')
  const [codeMirrorOutputValue, setCodeMirrorOutputValue] = React.useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('react')

  const handleInputChange = (value: string) => {
    setCodeMirrorInputValue(value.length > 0 ? value : '')
    if (selectedLanguage === 'html' && value.length > 0) {
      const spec = transformHTMLToSpec(value)
      setCodeMirrorOutputValue(JSON.stringify(spec, null, 2))
    } else if (selectedLanguage === 'react' && value.length > 0) {
      const spec = transformReactComponentToSpec(value)
      setCodeMirrorOutputValue(JSON.stringify(spec, null, 2))
    } else {
      setCodeMirrorOutputValue('')
    }
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setCodeMirrorInputValue('')
    setCodeMirrorOutputValue('')
  }

  return (
    <div className="flex flex-col h-screen antialiased">
      <header className="flex items-center justify-between p-4 border-b border-white/5">
        <h1 className="text-xl font-black tracking-tight text-gray-900">🪸 CoralUI</h1>

        <div className="flex gap-2">
          <TabButtons active={selectedLanguage === 'html'} onClick={() => handleLanguageChange('html')}>
            HTML
          </TabButtons>
          <TabButtons active={selectedLanguage === 'react'} onClick={() => handleLanguageChange('react')}>
            React
          </TabButtons>
        </div>
      </header>

      <div className="flex flex-col flex-1 editor max-h-[80dvh]">
        <div className="grid grid-cols-2 h-full overflow-hidden">
          <div className="flex flex-col overflow-auto">
            <CodeMirror
              theme={'dark'}
              height="100%"
              value={codeMirrorInputValue}
              onChange={handleInputChange}
              className="flex-1 pt-2 max-h-[80dvh]"
              extensions={[javascript({ jsx: true })]}
            />
          </div>
          <div className="flex flex-col  h-full overflow-auto">
            <CodeMirror
              theme={'dark'}
              height="100%"
              value={codeMirrorOutputValue}
              onChange={setCodeMirrorOutputValue}
              className="flex-1 border-l border-gray-600 pt-2 max-h-[80dvh]"
              extensions={[json()]}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
