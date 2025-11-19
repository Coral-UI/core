// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

// @ts-check

import eslintConfig from '@reallygoodwork/coral-eslint-config/library.js'

export default [
  ...eslintConfig,
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'always',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]
