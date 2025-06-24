import { transformReactComponentToSpec } from '../transformReactComponentToSpec'
import { formatValidationResults, validateReactComponent } from '../validateInput'

describe('Input Validation and Error Handling', () => {
  describe('validateReactComponent', () => {
    it('should validate a correct React component', () => {
      const component = `
        import React from 'react';

        const ValidComponent = () => {
          return <div>Hello World</div>;
        };

        export default ValidComponent;
      `

      const result = validateReactComponent(component)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject empty input', () => {
      const result = validateReactComponent('')

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]?.message).toContain('cannot be empty')
    })

    it('should reject null/undefined input', () => {
      const result = validateReactComponent(null as unknown as string)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]?.message).toContain('must be a non-empty string')
    })

    it('should detect mismatched braces', () => {
      const component = `
        const Component = () => {
          return <div>Hello {name</div>;
        };
      `

      const result = validateReactComponent(component)

      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('braces'))).toBe(true)
    })

    it('should detect mismatched parentheses', () => {
      const component = `
        const Component = (() => {
          return <div>Hello</div>;
        };
      `

      const result = validateReactComponent(component)

      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.message.includes('parentheses'))).toBe(true)
    })

    it('should warn about missing React import', () => {
      const component = `
        const Component = () => {
          return <div>Hello</div>;
        };
      `

      const result = validateReactComponent(component)

      expect(result.warnings.some((w) => w.message.includes('No React import'))).toBe(true)
    })

    it('should warn about class components', () => {
      const component = `
        import React from 'react';

        class Component extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
      `

      const result = validateReactComponent(component)

      expect(result.warnings.some((w) => w.message.includes('Class components'))).toBe(true)
    })

    it('should warn about advanced React features', () => {
      const component = `
        import React, { Suspense, lazy } from 'react';

        const LazyComponent = lazy(() => import('./Other'));

        const Component = () => {
          return (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyComponent />
            </Suspense>
          );
        };
      `

      const result = validateReactComponent(component)

      expect(result.warnings.some((w) => w.message.includes('React Suspense'))).toBe(true)
      expect(result.warnings.some((w) => w.message.includes('React.lazy'))).toBe(true)
    })
  })

  describe('transformReactComponentToSpec error handling', () => {
    it('should throw error for invalid syntax', () => {
      const invalidComponent = `
        const Component = () => {
          return <div>Unclosed div;
        };
      `

      expect(() => {
        transformReactComponentToSpec(invalidComponent)
      }).toThrow('Failed to parse component')
    })

    it('should throw error for unparseable code', () => {
      const unparsableComponent = `
        this is not valid javascript {{{ )) !!
      `

      expect(() => {
        transformReactComponentToSpec(unparsableComponent)
      }).toThrow('Component validation failed')
    })

    it('should throw error when no component found', () => {
      const noComponent = `
        import React from 'react';

        const notAComponent = "just a string";
      `

      expect(() => {
        transformReactComponentToSpec(noComponent)
      }).toThrow('No valid React component found')
    })

    it('should throw error when no JSX found', () => {
      const noJSX = `
        import React from 'react';

        const Component = () => {
          return "just a string";
        };

        export default Component;
      `

      expect(() => {
        transformReactComponentToSpec(noJSX)
      }).toThrow('No JSX element found')
    })

    it('should skip validation when requested', () => {
      const invalidComponent = `
        const Component = () => {
          return "no jsx";
        };
      `

      expect(() => {
        transformReactComponentToSpec(invalidComponent, { skipValidation: true })
      }).toThrow('No JSX element found') // Should fail at later stage, not validation
    })

    it('should handle edge case with complex nested structures', () => {
      const complexComponent = `
        import React, { useState, useEffect } from 'react';

        const ComplexComponent = ({ data = [], onUpdate }) => {
          const [state, setState] = useState({ loading: false, error: null });

          useEffect(() => {
            if (data.length > 0) {
              setState(prev => ({ ...prev, loading: true }));
            }
          }, [data]);

          const handleClick = async (id) => {
            try {
              await onUpdate(id);
              setState({ loading: false, error: null });
            } catch (err) {
              setState({ loading: false, error: err.message });
            }
          };

          return (
            <>
              {state.loading && <div>Loading...</div>}
              {state.error && <div className="error">{state.error}</div>}
              <div className="container">
                {data.map(item => (
                  <div key={item.id} onClick={() => handleClick(item.id)}>
                    {item.name}
                  </div>
                ))}
              </div>
            </>
          );
        };

        export default ComplexComponent;
      `

      expect(() => {
        const result = transformReactComponentToSpec(complexComponent)
        expect(result.componentName).toBe('ComplexComponent')
        expect(result.stateHooks).toBeDefined()
        expect(result.methods).toBeDefined()
      }).not.toThrow()
    })
  })

  describe('formatValidationResults', () => {
    it('should format successful validation', () => {
      const result = { isValid: true, errors: [], warnings: [] }
      const formatted = formatValidationResults(result)

      expect(formatted).toContain('✅ Component validation passed')
    })

    it('should format validation with errors and warnings', () => {
      const result = {
        isValid: false,
        errors: [{ type: 'syntax' as const, message: 'Syntax error', suggestion: 'Fix syntax' }],
        warnings: [{ type: 'compatibility' as const, message: 'Warning message', suggestion: 'Consider this' }],
      }
      const formatted = formatValidationResults(result)

      expect(formatted).toContain('❌ Component validation failed')
      expect(formatted).toContain('Errors:')
      expect(formatted).toContain('Warnings:')
      expect(formatted).toContain('Syntax error')
      expect(formatted).toContain('Warning message')
      expect(formatted).toContain('💡 Fix syntax')
      expect(formatted).toContain('💡 Consider this')
    })
  })
})
