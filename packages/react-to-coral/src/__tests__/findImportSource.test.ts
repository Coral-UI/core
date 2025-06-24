import type { Result } from '../transformReactComponentToSpec'
import { findImportSource } from '../findImportSource'

describe('findImportSource', () => {
  it('should find the import source for a given component name', () => {
    const result: Result = {
      imports: [
        {
          source: 'my-library',
          version: '1.0.0',
          specifiers: [{ name: 'MyComponent', isDefault: false }],
        },
        {
          source: 'another-library',
          version: '2.0.0',
          specifiers: [{ name: 'AnotherComponent', isDefault: true }],
        },
      ],
    }
    const source = findImportSource('MyComponent', result)
    expect(source).toBe('my-library')
  })

  it('should return undefined if the component is not found', () => {
    const result: Result = {
      imports: [
        {
          source: 'my-library',
          version: '1.0.0',
          specifiers: [{ name: 'MyComponent', isDefault: false }],
        },
      ],
    }
    const source = findImportSource('NonExistentComponent', result)
    expect(source).toBeUndefined()
  })

  it('should handle cases with no imports', () => {
    const result: Result = {}
    const source = findImportSource('AnyComponent', result)
    expect(source).toBeUndefined()
  })

  it('should handle default imports', () => {
    const result: Result = {
      imports: [
        {
          source: 'react',
          version: '18.0.0',
          specifiers: [{ name: 'React', isDefault: true }],
        },
      ],
    }
    const source = findImportSource('React', result)
    expect(source).toBe('react')
  })
})
