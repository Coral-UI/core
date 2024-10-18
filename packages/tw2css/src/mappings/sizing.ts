const rem = 16

export const width = {
  'w-svw': {
    property: 'width',
    value: '100svw',
  },
  'w-lvw': {
    property: 'width',
    value: '100lvw',
  },
  'w-dvw': {
    property: 'width',
    value: '100dvw',
  },
  'w-min': {
    property: 'width',
    value: 'min-content',
  },
  'w-max': {
    property: 'width',
    value: 'max-content',
  },
  'w-': ['width'],
}

export const maxWidth = {
  'max-w-none': {
    property: 'maxWidth',
    value: 'none',
  },
  'max-w-xs': {
    property: 'maxWidth',
    value: 20 * rem,
  },
  'max-w-sm': {
    property: 'maxWidth',
    value: 24 * rem,
  },
  'max-w-md': {
    property: 'maxWidth',
    value: 28 * rem,
  },
  'max-w-lg': {
    property: 'maxWidth',
    value: 32 * rem,
  },
  'max-w-xl': {
    property: 'maxWidth',
    value: 36 * rem,
  },
  'max-w-2xl': {
    property: 'maxWidth',
    value: 42 * rem,
  },
  'max-w-3xl': {
    property: 'maxWidth',
    value: 48 * rem,
  },
  'max-w-4xl': {
    property: 'maxWidth',
    value: 56 * rem,
  },
  'max-w-5xl': {
    property: 'maxWidth',
    value: 64 * rem,
  },
  'max-w-6xl': {
    property: 'maxWidth',
    value: 72 * rem,
  },
  'max-w-7xl': {
    property: 'maxWidth',
    value: 80 * rem,
  },
  'max-w-full': {
    property: 'maxWidth',
    value: '100%',
  },
  'max-w-screen-sm': {
    property: 'maxWidth',
    value: 640,
  },
  'max-w-screen-md': {
    property: 'maxWidth',
    value: 768,
  },
  'max-w-screen-lg': {
    property: 'maxWidth',
    value: 1024,
  },
  'max-w-screen-xl': {
    property: 'maxWidth',
    value: 1280,
  },
  'max-w-screen-2xl': {
    property: 'maxWidth',
    value: 1536,
  },
  'max-w-prose': {
    property: 'maxWidth',
    value: '65ch',
  },
  'max-w-fit': {
    property: 'maxWidth',
    value: 'fit-content',
  },
  'max-w-max': {
    property: 'maxWidth',
    value: 'max-content',
  },
  'max-w-min': {
    property: 'maxWidth',
    value: 'min-content',
  },
  'max-w': ['maxWidth'],
}

export const minWidth = {
  'min-w-min': {
    property: 'minWidth',
    value: 'min-content',
  },
  'min-w-max': {
    property: 'minWidth',
    value: 'max-content',
  },
  'min-w-full': {
    property: 'minWidth',
    value: '100%',
  },
  'min-w': ['minWidth'],
}

export const height = {
  'h-svh': {
    property: 'height',
    value: '100svh',
  },
  'h-lvh': {
    property: 'height',
    value: '100lvh',
  },
  'h-dvh': {
    property: 'height',
    value: '100dvh',
  },
  'h-min': {
    property: 'height',
    value: 'min-content',
  },
  'h-max': {
    property: 'height',
    value: 'max-content',
  },
  'h-': ['height'],
}

export const minHeight = {
  'min-h-svh': {
    property: 'minHeight',
    value: '100svh',
  },
  'min-h-lvh': {
    property: 'minHeight',
    value: '100lvh',
  },
  'min-h-dvh': {
    property: 'minHeight',
    value: '100dvh',
  },
  'min-h-min': {
    property: 'minHeight',
    value: 'min-content',
  },
  'min-h-max': {
    property: 'minHeight',
    value: 'max-content',
  },
  'min-h-fit': {
    property: 'minHeight',
    value: 'fit-content',
  },
  'min-h-full': {
    property: 'minHeight',
    value: '100%',
  },
  'min-h': ['minHeight'],
}

export const maxHeight = {
  'max-h-svh': {
    property: 'maxHeight',
    value: '100svh',
  },
  'max-h-lvh': {
    property: 'maxHeight',
    value: '100lvh',
  },
  'max-h-dvh': {
    property: 'maxHeight',
    value: '100dvh',
  },
  'max-h-min': {
    property: 'maxHeight',
    value: 'min-content',
  },
  'max-h-max': {
    property: 'maxHeight',
    value: 'max-content',
  },
  'max-h-fit': {
    property: 'maxHeight',
    value: 'fit-content',
  },
  'max-h': ['maxHeight'],
}

export const size = {
  'size-min': [
    {
      property: 'width',
      value: 'min-content',
    },
    {
      property: 'height',
      value: 'min-content',
    },
  ],
  'size-max': [
    {
      property: 'width',
      value: 'max-content',
    },
    {
      property: 'height',
      value: 'max-content',
    },
  ],
  'size-fit': [
    {
      property: 'width',
      value: 'fit-content',
    },
    {
      property: 'height',
      value: 'fit-content',
    },
  ],
  'size-': ['width', 'height'],
}
