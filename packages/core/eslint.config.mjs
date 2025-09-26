// @ts-check

import eslintConfig from '@reallygoodwork/coral-eslint-config/library.js'

export default [
  ...eslintConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]
