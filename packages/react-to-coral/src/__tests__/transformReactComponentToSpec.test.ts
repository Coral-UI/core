import { transformReactComponentToSpec } from '../transformReactComponentToSpec'

describe('transformReactComponentToSpec', () => {
  it('should parse a simple React component', () => {
    const component = `
      import React from 'react';

      const SimpleComponent = () => {
        return <div className="container">Hello World</div>;
      };

      export default SimpleComponent;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('SimpleComponent')
    expect(result.elementType).toBe('div')
    expect(result.name).toBe('SimpleComponent')
    expect(result.isComponentSet).toBe(false)
  })

  it('should parse component with props', () => {
    const component = `
      import React from 'react';

      interface Props {
        title: string;
        count: number;
      }

      const ComponentWithProps = ({ title, count }: Props) => {
        return <div>{title} - {count}</div>;
      };

      export default ComponentWithProps;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('ComponentWithProps')
    expect(result.componentProperties).toBeDefined()
  })

  it('should parse component with state hooks', () => {
    const component = `
      import React, { useState } from 'react';

      const StatefulComponent = () => {
        const [count, setCount] = useState(0);
        const [name, setName] = useState('test');

        return <div>{count} - {name}</div>;
      };

      export default StatefulComponent;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('StatefulComponent')
    expect(result.stateHooks).toBeDefined()
    expect(result.stateHooks).toHaveLength(2)
  })

  it('should parse component with methods', () => {
    const component = `
      import React from 'react';

      const ComponentWithMethods = () => {
        const handleClick = () => {
          console.log('clicked');
        };

        const handleSubmit = (data: string) => {
          return data.toUpperCase();
        };

        return <div onClick={handleClick}>Click me</div>;
      };

      export default ComponentWithMethods;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('ComponentWithMethods')
    expect(result.methods).toBeDefined()
    expect(result.methods?.length).toBeGreaterThan(0)
  })

  it('should parse function declaration components', () => {
    const component = `
      import React from 'react';

      function FunctionComponent() {
        return <div>Function Component</div>;
      }

      export default FunctionComponent;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('FunctionComponent')
    expect(result.type).toBe('Function')
  })

  it('should handle nested JSX elements', () => {
    const component = `
      import React from 'react';

      const NestedComponent = () => {
        return (
          <div className="wrapper">
            <h1>Title</h1>
            <section>
              <p>Paragraph</p>
              <button>Click</button>
            </section>
          </div>
        );
      };

      export default NestedComponent;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.componentName).toBe('NestedComponent')
    expect(result.children).toBeDefined()
    expect(result.children?.length).toBeGreaterThan(0)
  })

  it('should handle imports correctly', () => {
    const component = `
      import React from 'react';
      import { useState, useEffect } from 'react';
      import Button from './Button';

      const ImportComponent = () => {
        return <div><Button /></div>;
      };

      export default ImportComponent;
    `

    const result = transformReactComponentToSpec(component)

    expect(result.imports).toBeDefined()
    expect(result.imports?.length).toBeGreaterThan(0)
    expect(result.imports?.[0]?.source).toBe('react')
  })
})
