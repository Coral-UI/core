'use client'

import { Toaster } from '@/components/primitives/Sonner/sonner'
import { AnalyticsProvider } from '@/lib/analytics/analytics-context'
import { AuthProvider } from '@/lib/auth/auth-context'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { FormDevtools } from '@tanstack/react-form-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <AnalyticsProvider>
          {children}
          <Toaster richColors expand={false} />
          <TanStackDevtools
            plugins={[
              {
                name: 'FormDevtoolsPlugin',
                render: <FormDevtools />,
                defaultOpen: false,
              },
              {
                name: 'ReactQueryDevtoolsPanel',
                render: <ReactQueryDevtoolsPanel />,
                defaultOpen: false,
              },
            ]}
          />
        </AnalyticsProvider>
      </AuthProvider>
    </NextThemesProvider>
  )
}
