import { Sandpack } from '@codesandbox/sandpack-react'
import { githubLight, sandpackDark } from '@codesandbox/sandpack-themes'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { DEFAULT_CSS_RESET } from '@/components/Editor/CssResetDialog'
import { CoralRootNode } from '@reallygoodwork/coral-core'
import { coralToReact } from '@reallygoodwork/coral-to-react'

interface SandboxProps {
  specValue: CoralRootNode
  cssReset?: string
}

export const Sandbox = ({ specValue, cssReset }: SandboxProps) => {
  // Use default CSS reset if none is provided
  const effectiveCssReset = cssReset || DEFAULT_CSS_RESET
  const { theme } = useTheme()
  const componentName = specValue.componentName || specValue.name || 'Component'
  const [reactCode, setReactCode] = useState<string>('// Loading...')
  const [cssCode, setCssCode] = useState<string>('')

  useEffect(() => {
    const generateCode = async () => {
      const ComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1)
      const spec = {
        ...specValue,
        componentName: ComponentName,
      }
      try {
        // Generate CSS and React code
        const { reactCode, cssCode: generatedCssCode } = await coralToReact(spec, {
          prettier: true,
          styleFormat: 'className',
        })
        setReactCode(reactCode)
        setCssCode(generatedCssCode)
      } catch (error) {
        console.error('Failed to generate React code:', error)
        setReactCode('// Error generating code')
        setCssCode('/* Error generating CSS */')
      }
    }

    generateCode()
  }, [specValue])

  const ComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1)

  const files: Record<string, { code: string; active?: boolean; readOnly?: boolean }> = {
    '/App.js': {
      code: `import React from 'react'
import './reset.css'
import { ${ComponentName} } from './${ComponentName}.js'
import './${ComponentName}.css'

export default function App() {
  return (
    <div>
      <${ComponentName} />
    </div>
  )
}
  `,
      active: true,
      readOnly: true,
    },
    [`/${ComponentName}.js`]: {
      code: reactCode,
      active: false,
      readOnly: true,
    },
    [`/${ComponentName}.css`]: {
      code: cssCode,
      active: false,
      readOnly: true,
    },
  }

  // Always include CSS reset file (uses default if none provided)
  files['/reset.css'] = {
    code: effectiveCssReset,
    active: false,
    readOnly: true,
  }

  return (
    <div className="w-full shadow-popover rounded-lg overflow-hidden">
      <Sandpack
        files={files}
        theme={theme === 'dark' ? sandpackDark : githubLight}
        template="react"
        options={{
          externalResources: ['https://cdn.tailwindcss.com'],
          showLineNumbers: true,
          editorHeight: 600,
          wrapContent: true,
        }}
      />
    </div>
  )
}
