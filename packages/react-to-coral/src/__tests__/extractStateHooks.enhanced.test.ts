import { parse } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import type { CoralStateType } from '@reallygoodwork/coral-core'

import { extractStateHooks } from '../extractStateHooks'

describe('extractStateHooks - Enhanced Hook Support', () => {
  const parseAndExtract = (code: string) => {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    })

    const result: { stateHooks?: Array<CoralStateType> } = {}

    traverse(ast, {
      CallExpression(path: NodePath<t.CallExpression>) {
        extractStateHooks(path, result)
      },
    })

    return result
  }

  it('should extract useEffect hook', () => {
    const code = `
      import React, { useEffect } from 'react';

      const Component = () => {
        useEffect(() => {
          console.log('effect');
        }, []);

        return <div>Test</div>;
      };
    `

    const result = parseAndExtract(code)

    expect(result.stateHooks).toBeDefined()
    expect(result.stateHooks?.length).toBe(1)
    expect(result.stateHooks?.[0]?.hookType).toBe('useEffect')
    expect(result.stateHooks?.[0]?.name).toBe('useEffect')
    expect(result.stateHooks?.[0]?.dependencies).toContain('[]')
  })

  it('should extract useReducer hook', () => {
    const code = `
      import React, { useReducer } from 'react';

      const reducer = (state, action) => state;

      const Component = () => {
        const [state, dispatch] = useReducer(reducer, { count: 0 });

        return <div>{state.count}</div>;
      };
    `

    const result = parseAndExtract(code)

    expect(result.stateHooks).toBeDefined()
    expect(result.stateHooks?.length).toBe(1)
    expect(result.stateHooks?.[0]?.hookType).toBe('useReducer')
    expect(result.stateHooks?.[0]?.name).toBe('state')
    expect(result.stateHooks?.[0]?.setterName).toBe('dispatch')
    expect(result.stateHooks?.[0]?.reducer).toContain('reducer')
  })

  it('should extract useContext hook', () => {
    const code = `
      import React, { useContext } from 'react';

      const ThemeContext = React.createContext();

      const Component = () => {
        const theme = useContext(ThemeContext);

        return <div>{theme}</div>;
      };
    `

    const result = parseAndExtract(code)

    expect(result.stateHooks).toBeDefined()
    expect(result.stateHooks?.length).toBe(1)
    expect(result.stateHooks?.[0]?.hookType).toBe('useContext')
    expect(result.stateHooks?.[0]?.name).toBe('theme')
    expect(result.stateHooks?.[0]?.initialValue).toContain('ThemeContext')
  })

  it('should extract useMemo hook', () => {
    const code = `
      import React, { useMemo } from 'react';

      const Component = ({ items }) => {
        const expensiveValue = useMemo(() => {
          return items.reduce((sum, item) => sum + item.value, 0);
        }, [items]);

        return <div>{expensiveValue}</div>;
      };
    `

    const result = parseAndExtract(code)

    expect(result.stateHooks).toBeDefined()
    expect(result.stateHooks?.length).toBe(1)
    expect(result.stateHooks?.[0]?.hookType).toBe('useMemo')
    expect(result.stateHooks?.[0]?.name).toBe('expensiveValue')
    expect(result.stateHooks?.[0]?.dependencies).toContain('[items]')
  })

  it('should extract useCallback hook', () => {
    const code = `
      import React, { useCallback } from 'react';

      const Component = ({ onSubmit }) => {
        const handleClick = useCallback(() => {
          onSubmit('clicked');
        }, [onSubmit]);

        return <button onClick={handleClick}>Click</button>;
      };
    `

    const result = parseAndExtract(code)

    expect(result.stateHooks).toBeDefined()
    expect(result.stateHooks?.length).toBe(1)
    expect(result.stateHooks?.[0]?.hookType).toBe('useCallback')
    expect(result.stateHooks?.[0]?.name).toBe('handleClick')
    expect(result.stateHooks?.[0]?.tsType).toBe('function')
    expect(result.stateHooks?.[0]?.dependencies).toContain('[onSubmit]')
  })

  it('should extract multiple hooks in the same component', () => {
    const code = `
      import React, { useState, useEffect, useMemo } from 'react';

      const Component = ({ items }) => {
        const [count, setCount] = useState(0);

        const total = useMemo(() => items.length, [items]);

        useEffect(() => {
          console.log('count changed', count);
        }, [count]);

        return <div>{count} / {total}</div>;
      };
    `

    const result = parseAndExtract(code)

    expect(result.stateHooks).toBeDefined()
    expect(result.stateHooks?.length).toBe(3)

    const hookTypes = result.stateHooks?.map((hook) => hook.hookType)
    expect(hookTypes).toContain('useState')
    expect(hookTypes).toContain('useMemo')
    expect(hookTypes).toContain('useEffect')
  })
})
