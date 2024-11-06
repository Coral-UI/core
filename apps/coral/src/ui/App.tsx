import { useEffect } from 'react'

import { Header } from './components/Header'
import { Export } from './routes/Export'
import { Import } from './routes/Import'
import { Preview } from './routes/Preview'
import { Settings } from './routes/Settings'
import { useRoute } from './state/route'
import { useSpecValue } from './state/specValue'

const App = () => {
  const { route } = useRoute()
  const { setValue } = useSpecValue()

  useEffect(() => {
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage
      if (type === 'SPEC_CREATED') {
        setValue(JSON.stringify(message, null, 2))
      }
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-background antialiased">
      <Header />
      <div className="flex flex-col flex-1">
        {route === 'import' && <Import />}
        {route === 'export' && <Export />}
        {route === 'preview' && <Preview />}
        {route === 'settings' && <Settings />}
      </div>
    </div>
  )
}

export default App
