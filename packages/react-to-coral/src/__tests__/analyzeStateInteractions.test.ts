import { parse } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import * as _t from '@babel/types'

import { analyzeStateInteractions } from '../analyzeStateInteractions'

type Interactions = { reads: string[]; writes: string[] }

describe('analyzeStateInteractions', () => {
  const stateHooks = [
    { name: 'count', setterName: 'setCount', tsType: 'number' },
    { name: 'text', setterName: 'setText', tsType: 'string' },
  ]

  it('should detect state reads', () => {
    const ast = parse('const a = count;', { plugins: ['typescript'] })
    let interactions: Interactions = { reads: [], writes: [] }
    traverse(ast, {
      Program(path: NodePath) {
        interactions = analyzeStateInteractions(path, stateHooks)
      },
    })
    expect(interactions.reads).toEqual(['count'])
    expect(interactions.writes).toEqual([])
  })

  it('should detect state writes', () => {
    const ast = parse('setCount(1)', { plugins: ['typescript'] })
    let interactions: Interactions = { reads: [], writes: [] }
    traverse(ast, {
      CallExpression(path: NodePath) {
        interactions = analyzeStateInteractions(path, stateHooks)
      },
    })
    expect(interactions.writes).toEqual(['count'])
    expect(interactions.reads).toEqual([])
  })

  it('should detect both reads and writes', () => {
    const ast = parse('setText(text + "!")', { plugins: ['typescript'] })
    let interactions: Interactions = { reads: [], writes: [] }
    traverse(ast, {
      CallExpression(path: NodePath) {
        interactions = analyzeStateInteractions(path, stateHooks)
      },
    })
    expect(interactions.reads).toEqual(['text'])
    expect(interactions.writes).toEqual(['text'])
  })

  it('should not detect interactions for non-state variables', () => {
    const ast = parse('const a = myVar; setMyVar(a)', { plugins: ['typescript'] })
    let interactions: Interactions = { reads: [], writes: [] }
    traverse(ast, {
      Program(path: NodePath) {
        interactions = analyzeStateInteractions(path, stateHooks)
      },
    })
    expect(interactions.reads).toEqual([])
    expect(interactions.writes).toEqual([])
  })

  it('should handle complex expressions', () => {
    const ast = parse('if (count > 0) { setCount(count - 1) }', {
      plugins: ['typescript'],
    })
    let interactions: Interactions = { reads: [], writes: [] }
    traverse(ast, {
      IfStatement(path: NodePath) {
        interactions = analyzeStateInteractions(path, stateHooks)
      },
    })
    expect(interactions.reads).toEqual(['count'])
    expect(interactions.writes).toEqual(['count'])
  })
})
