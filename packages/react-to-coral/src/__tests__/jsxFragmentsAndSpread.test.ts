import { transformReactComponentToSpec } from '../transformReactComponentToSpec'

describe('JSX Fragments and Spread Operators', () => {
  it('should handle JSX fragments with <> syntax', () => {
    const component = `
      import React from 'react';

      const FragmentComponent = () => {
        return (
          <>
            <h1>Title</h1>
            <p>Content</p>
          </>
        );
      };

      export default FragmentComponent;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('FragmentComponent')
    expect(result.elementType).toBe('React.Fragment')
    expect(result.children).toBeDefined()
    expect(Array.isArray(result.children) ? result.children.length : 0).toBe(2)
  })

  it('should handle React.Fragment syntax', () => {
    const component = `
      import React from 'react';

      const FragmentComponent = () => {
        return (
          <React.Fragment>
            <div>First</div>
            <div>Second</div>
          </React.Fragment>
        );
      };

      export default FragmentComponent;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('FragmentComponent')
    expect(result.elementType).toBe('React.Fragment')
    expect(result.children).toBeDefined()
    expect(Array.isArray(result.children) ? result.children.length : 0).toBe(2)
  })

  it('should handle spread attributes in JSX', () => {
    const component = `
      import React from 'react';

      const SpreadComponent = ({ commonProps, ...restProps }) => {
        return (
          <div {...commonProps} className="wrapper" {...restProps}>
            <span>Content</span>
          </div>
        );
      };

      export default SpreadComponent;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('SpreadComponent')
    expect(result.elementType).toBe('div')
    expect(result.componentProperties).toBeDefined()

    // Check that spread attributes are captured
    const props = result.componentProperties as Record<string, unknown>
    expect(Object.keys(props)).toContain('...commonProps')
    expect(Object.keys(props)).toContain('...restProps')
    // className is moved to styles, not componentProperties
    expect(result.styles).toBeDefined()
  })

  it('should handle JSX expressions in children', () => {
    const component = `
      import React from 'react';

      const ExpressionComponent = ({ items, isVisible }) => {
        return (
          <div>
            {isVisible && <span>Visible content</span>}
            {items.map(item => <p key={item.id}>{item.name}</p>)}
            {"Static string"}
            {42}
          </div>
        );
      };

      export default ExpressionComponent;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('ExpressionComponent')
    expect(result.elementType).toBe('div')
    expect(result.children).toBeDefined()
    expect(Array.isArray(result.children) ? result.children.length : 0).toBeGreaterThan(0)

    // Check that JSX expressions are captured
    const children = Array.isArray(result.children) ? result.children : []
    const expressionChildren = children.filter(
      (child: Record<string, unknown>) => child.elementType === 'jsx-expression',
    )
    expect(expressionChildren).toBeDefined()
    expect(expressionChildren.length).toBeGreaterThan(0)
  })

  it('should handle nested fragments', () => {
    const component = `
      import React from 'react';

      const NestedFragmentComponent = () => {
        return (
          <>
            <h1>Main Title</h1>
            <>
              <h2>Sub Title</h2>
              <p>Nested content</p>
            </>
            <footer>Footer</footer>
          </>
        );
      };

      export default NestedFragmentComponent;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('NestedFragmentComponent')
    expect(result.elementType).toBe('React.Fragment')
    expect(result.children).toBeDefined()
    expect(Array.isArray(result.children) ? result.children.length : 0).toBe(3) // h1, nested fragment, footer

    // Check nested fragment
    const children = Array.isArray(result.children) ? result.children : []
    const nestedFragment = children.find((child: Record<string, unknown>) => child.elementType === 'React.Fragment')
    expect(nestedFragment).toBeDefined()
    const nestedChildren = Array.isArray(nestedFragment?.children) ? nestedFragment.children : []
    expect(nestedChildren.length).toBe(2) // h2, p
  })

  it('should handle complex prop spreading with objects', () => {
    const component = `
      import React from 'react';

      const ComplexSpreadComponent = ({ style, ...props }) => {
        const additionalProps = { 'data-testid': 'component', role: 'button' };

        return (
          <button
            {...props}
            {...additionalProps}
            style={{ ...style, padding: '10px' }}
            onClick={() => console.log('clicked')}
          >
            Click me
          </button>
        );
      };

      export default ComplexSpreadComponent;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('ComplexSpreadComponent')
    expect(result.elementType).toBe('button')

    const props = result.componentProperties as Record<string, unknown>
    expect(Object.keys(props)).toContain('...props')
    expect(Object.keys(props)).toContain('...additionalProps')
    expect(props.style).toContain('...style')
    expect(props.onClick).toContain('console.log')
  })
})
