import type { CoralImportType } from '@reallygoodwork/coral-core'

import { generateImports } from '../generateImports'

describe('generateImports', () => {
  it('should generate default React import when no imports provided', () => {
    const result = generateImports()
    expect(result).toBe("import React from 'react'")
  })

  it('should generate default React import when empty array provided', () => {
    const result = generateImports([])
    expect(result).toBe("import React from 'react'")
  })

  it('should generate named import', () => {
    const imports: CoralImportType[] = [
      {
        source: 'react',
        specifiers: [
          { name: 'useState', isDefault: false },
          { name: 'useEffect', isDefault: false },
        ],
      },
    ]

    const result = generateImports(imports)
    expect(result).toContain("import React from 'react'")
    expect(result).toContain("import { useState, useEffect } from 'react'")
  })

  it('should generate default import', () => {
    const imports: CoralImportType[] = [
      {
        source: './Button',
        specifiers: [{ name: 'Button', isDefault: true }],
      },
    ]

    const result = generateImports(imports)
    expect(result).toContain("import Button from './Button'")
  })

  it('should generate default and named imports together', () => {
    const imports: CoralImportType[] = [
      {
        source: './utils',
        specifiers: [
          { name: 'helper', isDefault: true },
          { name: 'util', isDefault: false },
          { name: 'another', isDefault: false },
        ],
      },
    ]

    const result = generateImports(imports)
    expect(result).toContain("import helper, { util, another } from './utils'")
  })

  it('should handle import aliases', () => {
    const imports: CoralImportType[] = [
      {
        source: './Button',
        specifiers: [{ name: 'Button', isDefault: true, as: 'CustomButton' }],
      },
      {
        source: 'react',
        specifiers: [{ name: 'useState', isDefault: false, as: 'useCustomState' }],
      },
    ]

    const result = generateImports(imports)
    expect(result).toContain("import CustomButton from './Button'")
    expect(result).toContain("import { useState as useCustomState } from 'react'")
  })
})
