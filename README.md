# Coral UI Core 🪸

A collection of utility classes and components for building Coral UI.

## Installation

```bash
npm install @reallygoodwork/coral-core colord node-html-parser
```

## What is Coral UI?

CoralUI is a toolkit for building UI components in a declarative way. The goal is to provide a set of tools that make it easy to create and maintain UI components.

## Utilities

### `parseUISpec`

A utility for validating and parsing a Coral specification.

```typescript
import { parseUISpec } from '@reallygoodwork/coral-core'

const spec = parseUISpec({
  elementType: 'div',
  children: [],
  name: 'My Component',
  styles: {
    backgroundColor: 'red',
  },
})
```

### `transformHTMLToSpec`

A utility for transforming HTML to a Coral specification.

```typescript
import { transformHTMLToSpec } from '@reallygoodwork/coral-core'

const spec = transformHTMLToSpec('<div class="my-component">Hello, world!</div>')
```

### `tailwindToCSS`

A utility for converting Tailwind CSS to a basic style object.

```typescript
import { tailwindToCSS } from '@reallygoodwork/coral-core'

const styles = tailwindToCSS('bg-red-500 text-white')
```

### `transformReactComponentToSpec`

A utility for transforming a React component to a Coral specification.

```typescript
import { transformReactComponentToSpec } from '@reallygoodwork/coral-core'

const spec = transformReactComponentToSpec('<MyComponent />')
```
