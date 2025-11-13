# @reallygoodwork/coral-to-vue

Convert Coral specifications to Vue 3 component code.

## Installation

```bash
npm install @reallygoodwork/coral-to-vue
# or
pnpm add @reallygoodwork/coral-to-vue
# or
yarn add @reallygoodwork/coral-to-vue
```

## Usage

```typescript
import type { CoralRootNode } from '@reallygoodwork/coral-core'
import { coralToVue } from '@reallygoodwork/coral-to-vue'

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

const vueCode = await coralToVue(coralSpec)
console.log(vueCode)
```

## Options

```typescript
interface Options {
  componentFormat?: 'sfc' // Default: 'sfc' - Single File Component format
  styleFormat?: 'inline' | 'className' // Default: 'inline'
  includeTypes?: boolean // Default: true - Generate TypeScript types
  indentSize?: number // Default: 2
  prettier?: boolean // Default: false - Format output with Prettier
}
```

### Prettier Formatting

When `prettier: true` is set, the generated code will be formatted using Prettier with Vue parser. This ensures consistent, production-ready code formatting.

**Note:** Prettier is a peer dependency. Make sure it's installed:

```bash
npm install prettier
```

## Features

- ✅ Converts Coral specs to Vue 3 Single File Components (SFC)
- ✅ Uses Composition API with `<script setup>` syntax
- ✅ Generates TypeScript interfaces for props
- ✅ Converts React hooks to Vue reactivity:
  - `useState` → `ref()`
  - `useEffect` → `watchEffect()` or `watch()`
  - `useMemo` → `computed()`
  - `useCallback` → regular function
  - `useReducer` → `reactive()`
  - `useContext` → `inject()`
- ✅ Generates methods/functions
- ✅ Converts styles to inline styles (`:style` binding)
- ✅ Handles nested children
- ✅ Supports imports
- ✅ Proper Vue template syntax

## Vue-Specific Features

### Component Format

Vue components are generated as Single File Components (SFC) with `<script setup>` syntax:

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface ButtonProps {
  label: string
}

const props = defineProps<ButtonProps>()
const count = ref(0)
</script>

<template>
  <button>{{ label }}</button>
</template>
```

### Props

Props are generated using Vue's `defineProps()` macro with TypeScript support:

```typescript
// Type-based declaration (default)
const props = defineProps<ButtonProps>()

// Runtime declaration (when includeTypes: false)
const props = defineProps({
  label: { type: String, required: true },
})
```

### State Management

React hooks are converted to Vue's Composition API:

- **useState** → `ref()`: `const count = ref<number>(0)`
- **useEffect** → `watchEffect()` or `watch()`: `watchEffect(() => { ... })`
- **useMemo** → `computed()`: `const value = computed(() => { ... })`
- **useCallback** → regular function: `const callback = () => { ... }`
- **useReducer** → `reactive()`: `const state = reactive({ ... })`
- **useContext** → `inject()`: `const theme = inject<Theme>('theme')`

### Template Syntax

JSX is converted to Vue template syntax:

- `className` → `class`
- `onClick` → `@click`
- `{text}` → `{{ text }}`
- `style={{ ... }}` → `:style="{ ... }"`

### Event Handlers

React event handlers are converted to Vue event handlers:

- `onClick` → `@click`
- `onChange` → `@change`
- `onSubmit` → `@submit`

## API

### `coralToVue(spec: CoralRootNode, options?: Options): Promise<string>`

Main function that converts a Coral specification to Vue component code.

### Utility Functions

- `generateImports(imports?: CoralImportType[]): string`
- `generateProps(componentProperties?: CoralComponentPropertyType, componentName?: string, includeTypes?: boolean): string`
- `generatePropsInterface(componentProperties?: CoralComponentPropertyType, componentName?: string): string`
- `generateStateDeclarations(stateHooks?: CoralStateType[]): string`
- `generateMethods(methods?: CoralMethodType[]): string`
- `stylesToInlineStyle(styles?: CoralStyleType): string`
- `generateTemplateElement(node: CoralNode, indent?: number): string`

## Examples

### Simple Component

```typescript
const spec: CoralRootNode = {
  name: 'Greeting',
  componentName: 'Greeting',
  elementType: 'div',
  textContent: 'Hello, World!',
}

const code = await coralToVue(spec)
```

Generates:

```vue
<script setup lang="ts">
</script>

<template>
  <div>
    Hello, World!
  </div>
</template>
```

### Component with Props and State

```typescript
const spec: CoralRootNode = {
  name: 'Counter',
  componentName: 'Counter',
  elementType: 'div',
  componentProperties: {
    initialCount: {
      type: 'number',
      optional: true,
    },
  },
  stateHooks: [
    {
      name: 'count',
      setterName: 'setCount',
      tsType: 'number',
      initialValue: 0,
    },
  ],
  children: [
    {
      name: 'button',
      elementType: 'button',
      textContent: 'Increment',
    },
  ],
}

const code = await coralToVue(spec)
```

Generates:

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface CounterProps {
  initialCount?: number
}

const props = defineProps<CounterProps>()
const count = ref<number>(0)
</script>

<template>
  <div>
    <button>
      Increment
    </button>
  </div>
</template>
```

## License

MIT
