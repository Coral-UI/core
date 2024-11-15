import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { xcodeDark } from '@uiw/codemirror-themes-all'
import CodeMirror from '@uiw/react-codemirror'
import clsx from 'clsx'
import React from 'react'

import { transformHTMLToSpec } from '@reallygoodwork/coral-core'
import { coralToHTML } from '@reallygoodwork/coral-to-html'
import { transformReactComponentToSpec } from '@reallygoodwork/react-to-coral'

import { Toasts, useToasts } from './components/Toasts'

// import { TabButtons } from './components/TabButtons'

const NavButton = ({
  children,
  onClick,
  isActive,
}: {
  children: React.ReactNode
  onClick: () => void
  isActive: boolean
}) => {
  return (
    <button
      className={clsx(
        'hover:text-foreground/80 font-medium tracking-tight text-sm uppercase py-1.5 px-4 hover:bg-primary/5 transition-colors font-mono border border-transparent rounded-full',
        isActive
          ? 'text-primary-light dark:text-primary-dark bg-primary-dark/20 hover:bg-primary-dark/20 hover:text-primary-light dark:hover:text-primary-dark border-border-dark/20 dark:border-border-light/20'
          : 'text-muted-light dark:text-muted-dark border-border-light dark:border-border-dark hover:border-border-dark dark:hover:border-border-light',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function App() {
  const [inputValue, setInputValue] = React.useState<string>('')
  const [specValue, setSpecValue] = React.useState<string>('')
  const [_outputValue, setOutputValue] = React.useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('html')
  const { addToast } = useToasts()

  const handleInputChange = async (value: string) => {
    try {
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
    } catch (error) {
      console.log(error.toString())
      addToast(error.toString(), 'error')
    }
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setInputValue('')
    setSpecValue('')
  }

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark antialiased">
      <div className="px-4">
        <header className="flex items-center justify-between py-4 border-b border-border-light dark:border-border-dark h-20">
          <h1 className="text-2xl font-medium text-primary-light dark:text-primary-dark">🪸 CoralUI Playground</h1>

          <div className="flex items-center text-sm gap-1">
            <NavButton isActive={selectedLanguage === 'html'} onClick={() => handleLanguageChange('html')}>
              HTML
            </NavButton>
            <NavButton isActive={selectedLanguage === 'react'} onClick={() => handleLanguageChange('react')}>
              React
            </NavButton>
          </div>
        </header>
      </div>

      <div className="flex flex-col flex-1 max-h-[100dvh]">
        <div className="grid grid-cols-2 h-full overflow-hidden ">
          <div className="flex flex-col overflow-auto">
            <header className="flex items-center justify-between mt-8 px-4">
              <h2 className="text-xl font-medium tracking-tight text-primary-light dark:text-primary-dark">
                Input{' '}
                <span className="text-muted-light dark:text-muted-dark uppercase text-sm font-mono">
                  {selectedLanguage}
                </span>
              </h2>
            </header>
            <div className="px-4 mt-2 mb-6 flex flex-col flex-1 max-h-[80dvh] ">
              <div className="flex-1 flex flex-col shrink-0 overflow-hidden rounded-sm border border-border-light dark:border-border-dark">
                <CodeMirror
                  theme={xcodeDark}
                  height="100%"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="flex-1 max-h-[80dvh]"
                  extensions={[javascript({ jsx: true })]}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col overflow-auto">
            <header className="flex items-center justify-between mt-8 px-4">
              <h2 className="text-xl font-medium tracking-tight text-primary-light dark:text-primary-dark">
                Converted Spec
              </h2>
            </header>
            <div className="px-4 mt-2 mb-6 flex flex-col flex-1 max-h-[80dvh] border-l border-border-light dark:border-border-dark">
              <div className="flex-1 flex flex-col shrink-0 overflow-hidden rounded-sm border border-border-light dark:border-border-dark">
                <CodeMirror
                  theme={xcodeDark}
                  height="100%"
                  value={specValue}
                  onChange={setSpecValue}
                  className="flex-1 max-h-[80dvh]"
                  extensions={[json()]}
                />
              </div>
            </div>
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
      <Toasts />
    </div>
  )
}

export default App
