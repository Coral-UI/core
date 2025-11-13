# @reallygoodwork/coral-to-react

Convert Coral specifications to React component code.

## Installation

```bash
npm install @reallygoodwork/coral-to-react
# or
pnpm add @reallygoodwork/coral-to-react
# or
yarn add @reallygoodwork/coral-to-react
```

## Usage

```typescript
import type { CoralRootNode } from '@reallygoodwork/coral-core'
import { coralToReact } from '@reallygoodwork/coral-to-react'

const coralSpec: CoralRootNode = {
  name: 'Button',
  componentName: 'Button',
  elementType: 'button',
  componentProperties: {
    label: {
      type: 'string',
      optional: false,
    },
  },
  textContent: 'Click me',
}

const reactCode = coralToReact(coralSpec)
console.log(reactCode)
```

## Options

```typescript
interface Options {
  componentFormat?: 'function' | 'arrow' // Default: 'function'
  styleFormat?: 'inline' | 'className' // Default: 'inline'
  includeTypes?: boolean // Default: true
  indentSize?: number // Default: 2
  prettier?: boolean // Default: false - Format output with Prettier
}
```

### Prettier Formatting

When `prettier: true` is set, the generated code will be formatted using Prettier with TypeScript parser. This ensures consistent, production-ready code formatting.

**Note:** Prettier is a peer dependency. Make sure it's installed:

```bash
npm install prettier
```

### Examples

#### Function Declaration (default)

```typescript
const code = coralToReact(spec, { componentFormat: 'function' })
// Generates: export function ComponentName() { ... }
```

#### Arrow Function

```typescript
const code = coralToReact(spec, { componentFormat: 'arrow' })
// Generates: export const ComponentName = () => { ... }
```

## Features

- ✅ Converts Coral specs to React components
- ✅ Generates TypeScript interfaces for props
- ✅ Handles state hooks (useState, useEffect, useReducer, etc.)
- ✅ Generates methods/functions
- ✅ Converts styles to inline styles
- ✅ Handles nested children
- ✅ Supports imports
- ✅ Proper JSX formatting

## API

### `coralToReact(spec: CoralRootNode, options?: Options): string`

Main function that converts a Coral specification to React component code.

### Utility Functions

- `generateImports(imports?: CoralImportType[]): string`
- `generatePropsInterface(componentProperties?: CoralComponentPropertyType, componentName?: string): string`
- `generateStateHooks(stateHooks?: CoralStateType[]): string`
- `generateMethods(methods?: CoralMethodType[]): string`
- `stylesToInlineStyle(styles?: CoralStyleType): string`
- `generateJSXElement(node: CoralNode, indent?: number): string`

## License

MIT
