import { Sandpack } from '@codesandbox/sandpack-react'
import { useEffect, useState } from 'react'

import { CoralRootNode } from '@reallygoodwork/coral-core'
import { coralToReact } from '@reallygoodwork/coral-to-react'

export const Sandbox = ({ specValue }: { specValue: CoralRootNode }) => {
  const componentName = specValue.componentName || specValue.name || 'Component'
  const [reactCode, setReactCode] = useState<string>('// Loading...')

  useEffect(() => {
    const generateCode = async () => {
      try {
        const code = await coralToReact(specValue, { prettier: true })
        setReactCode(code)
      } catch (error) {
        console.error('Failed to generate React code:', error)
        setReactCode('// Error generating code')
      }
    }

    generateCode()
  }, [specValue])

  const files = {
    '/App.js': {
      code: `import React from 'react'
import { ${componentName} } from './${componentName}.js'

export default function App() {
  return (
    <div>
      <${componentName} />
    </div>
  )
}
  `,
      active: true,
      readOnly: true,
    },
    [`/${componentName}.js`]: {
      code: reactCode,
      active: false,
      readOnly: true,
    },
  }
  return (
    <div className="h-full w-full p-2">
      <Sandpack
        files={files}
        theme="dark"
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
