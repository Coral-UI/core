import { useEffect } from 'react'

import { Header } from './components/Header'
import { Export } from './routes/Export'
import { Import } from './routes/Import'
// import { Preview } from './routes/Preview'
// import { Settings } from './routes/Settings'
import { useRoute } from './state/route'
import { useSpecValue } from './state/specValue'

const App = () => {
  const { route } = useRoute()
  const { setValue } = useSpecValue()

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Guard against HMR and other non-plugin messages
      if (!event.data?.pluginMessage) return

      const { type, message } = event.data.pluginMessage
      if (type === 'SPEC_CREATED') {
        setValue(JSON.stringify(message, null, 2))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [setValue])

  return (
    <div className="flex flex-col h-full bg-background antialiased">
      <Header />
      <div className="">
        {route === 'import' && <Import />}
        {route === 'export' && <Export />}
        {/* // {route === 'preview' && <Preview />}
        // {route === 'settings' && <Settings />} */}
      </div>
    </div>
  )
}

export default App
