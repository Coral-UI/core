import { Sandpack } from '@codesandbox/sandpack-react'
import { githubLight, sandpackDark } from '@codesandbox/sandpack-themes'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { CoralRootNode } from '@reallygoodwork/coral-core'
import { coralToReact } from '@reallygoodwork/coral-to-react'

export const Sandbox = ({ specValue }: { specValue: CoralRootNode }) => {
  const { theme } = useTheme()
  const componentName = specValue.componentName || specValue.name || 'Component'
  const [reactCode, setReactCode] = useState<string>('// Loading...')

  useEffect(() => {
    const generateCode = async () => {
      const ComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1)
      const spec = {
        ...specValue,
        componentName: ComponentName,
      }
      try {
        const code = await coralToReact(spec, { prettier: true })
        setReactCode(code)
      } catch (error) {
        console.error('Failed to generate React code:', error)
        setReactCode('// Error generating code')
      }
    }

    generateCode()
  }, [specValue])

  const ComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1)

  const files = {
    '/App.js': {
      code: `import React from 'react'
import { ${ComponentName} } from './${ComponentName}.js'

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
