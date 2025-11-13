import type { CoralImportType } from '@reallygoodwork/coral-core'

import { generateImports } from '../generateImports'

describe('generateImports', () => {
  it('should return empty string when no imports provided', () => {
    const result = generateImports()
    expect(result).toBe('')
  })

  it('should return empty string when empty array provided', () => {
    const result = generateImports([])
    expect(result).toBe('')
  })

  it('should generate named import', () => {
    const imports: CoralImportType[] = [
      {
        source: 'vue',
        specifiers: [
          { name: 'ref', isDefault: false },
          { name: 'reactive', isDefault: false },
        ],
      },
    ]

    const result = generateImports(imports)
    expect(result).toContain("import { ref, reactive } from 'vue'")
  })

  it('should generate default import', () => {
    const imports: CoralImportType[] = [
      {
        source: './Button.vue',
        specifiers: [{ name: 'Button', isDefault: true }],
      },
    ]

    const result = generateImports(imports)
    expect(result).toContain("import Button from './Button.vue'")
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
        source: './Button.vue',
        specifiers: [{ name: 'Button', isDefault: true, as: 'CustomButton' }],
      },
      {
        source: 'vue',
        specifiers: [{ name: 'ref', isDefault: false, as: 'useRef' }],
      },
    ]

    const result = generateImports(imports)
    expect(result).toContain("import CustomButton from './Button.vue'")
    expect(result).toContain("import { ref as useRef } from 'vue'")
  })
})
