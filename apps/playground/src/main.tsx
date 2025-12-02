import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource-variable/geist'
// Import globals.css first so Tailwind can process @theme block
import '../app/globals.css'

// Then import index.css which uses Tailwind utilities

import { Editor } from '@/components/Editor/Editor'
import { Toaster } from '@/components/primitives/Sonner/sonner'
import { AnalyticsProvider } from '@/lib/analytics/analytics-context'
import { AuthProvider } from '@/lib/auth/auth-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { NavBar } from './components/NavBar'

// Prevent body scroll on the editor page
document.body.style.overflow = 'hidden'
document.body.style.height = '100dvh'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <AnalyticsProvider>
            <NavBar />
            <div className="pt-12">
              <Editor />
            </div>
            <Toaster richColors expand={false} />
          </AnalyticsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

//
