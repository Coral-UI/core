import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource-variable/geist'

import type { Metadata } from 'next'
import { LoadingContent } from '@/components/LoadingContent'
import { NavBar } from '@/components/NavBar'
import { Suspense } from 'react'

import { ClientProviders } from './client-providers'
import { Providers } from './providers'

import './globals.css'

export const metadata: Metadata = {
  title: '🪸 CoralUI Playground',
  description: 'Playground for Coral UI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@1,2&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <ClientProviders>
            <NavBar />
            <div className="pt-12">
              <Suspense fallback={<LoadingContent type="libraries" />}>{children}</Suspense>
            </div>
          </ClientProviders>
        </Providers>
      </body>
    </html>
  )
}
