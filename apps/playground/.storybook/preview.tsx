import type { Preview, Renderer } from '@storybook/react'
import { withThemeByClassName } from '@storybook/addon-themes'
import React from 'react'
import { themes } from 'storybook/theming'

// Import fonts
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource-variable/geist'
// Import global CSS with Tailwind CSS v4
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.light,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#111111',
        },
      ],
    },
  },
  decorators: [
    withThemeByClassName<Renderer>({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Story />
      </div>
    ),
  ],
}

export default preview
