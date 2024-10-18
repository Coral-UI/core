import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import CodeMirror from '@uiw/react-codemirror'
import React from 'react'

import { transformHTMLToSpec } from '@reallygoodwork/coral-core'
import { coralToHTML } from '@reallygoodwork/coral-to-html'
import { transformReactComponentToSpec } from '@reallygoodwork/react-to-coral'

import { TabButtons } from './components/TabButtons'

function App() {
  const [inputValue, setInputValue] = React.useState<string>('')
  const [specValue, setSpecValue] = React.useState<string>('')
  const [_outputValue, setOutputValue] = React.useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('react')

  const handleInputChange = async (value: string) => {
    setInputValue(value.length > 0 ? value : '')
    if (selectedLanguage === 'html' && value.length > 0) {
      const spec = transformHTMLToSpec(value)
      const html = await coralToHTML(spec)
      setOutputValue(html)
      setSpecValue(JSON.stringify(spec, null, 2))
    } else if (selectedLanguage === 'react' && value.length > 0) {
      const spec = transformReactComponentToSpec(value)
      setSpecValue(JSON.stringify(spec, null, 2))
      const html = await coralToHTML(spec)
      setOutputValue(html)
    } else {
      setSpecValue('')
    }
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setInputValue('')
    setSpecValue('')
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

      <div className="flex flex-col flex-1 max-h-[100dvh] editor">
        <div className="grid grid-cols-2 h-full overflow-hidden">
          <div className="flex flex-col overflow-auto">
            <header className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-xl font-medium tracking-tight text-white">Input</h2>
            </header>
            <CodeMirror
              theme={'dark'}
              height="100%"
              value={inputValue}
              onChange={handleInputChange}
              className="flex-1 pt-2 max-h-[80dvh]"
              extensions={[javascript({ jsx: true })]}
            />
          </div>
          <div className="flex flex-col h-full overflow-auto">
            <header className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-xl font-medium tracking-tight text-white">Spec</h2>
            </header>
            <CodeMirror
              theme={'dark'}
              height="100%"
              value={specValue}
              onChange={setSpecValue}
              className="flex-1 border-l border-gray-600 pt-2 max-h-[80dvh]"
              extensions={[json()]}
              readOnly
            />
          </div>
          {/* <div className="flex flex-col h-full overflow-auto">
            <header className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-xl font-medium tracking-tight text-white">Output</h2>
            </header>
            <CodeMirror
              theme={'dark'}
              height="100%"
              value={outputValue}
              className="flex-1 border-l border-gray-600 pt-2 max-h-[80dvh]"
              extensions={[javascript({ jsx: true })]}
              readOnly
            />
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default App
