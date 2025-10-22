# Dimension Units Support in Coral UI

This document demonstrates the new dimension units support in Coral UI, which allows you to specify CSS dimensions with explicit units.

## Overview

The Coral schema now supports dimension values in two formats:
1. **Plain numbers** - interpreted as pixels (backward compatible)
2. **Dimension objects** - with explicit value and unit properties

## Schema Definition

```typescript
// Single number (interpreted as pixels)
fontSize: 16

// Dimension object with explicit unit
fontSize: { value: 1.5, unit: 'rem' }
```

## Supported Units

The following CSS units are supported:
- `px` - Pixels
- `em` - Relative to font-size of the element
- `rem` - Relative to font-size of the root element
- `vw` - Viewport width percentage
- `vh` - Viewport height percentage
- `vmin` - Smaller of vw and vh
- `vmax` - Larger of vw and vh
- `%` - Percentage
- `ch` - Width of the "0" character
- `ex` - Height of the "x" character
- `cm`, `mm`, `in`, `pt`, `pc` - Absolute units

## Example Coral Spec

```json
{
  "name": "StyledComponent",
  "elementType": "div",
  "styles": {
    "fontSize": { "value": 1.5, "unit": "rem" },
    "padding": 16,
    "margin": { "value": 2, "unit": "em" },
    "width": { "value": 100, "unit": "%" },
    "lineHeight": { "value": 1.5, "unit": "rem" },
    "gap": 24
  }
}
```

## HTML Output

The above spec would generate:

```html
<div style="font-size: 1.5rem; padding: 16px; margin: 2em; width: 100%; line-height: 1.5rem; gap: 24px">
</div>
```

## Playground Support

The playground form now supports unit selection for dimension properties:

- **Font Size**: Choose between px, em, rem, vw, vh
- **Line Height**: Choose between px, em, rem, vw, vh
- **Letter Spacing**: Choose between px, em, rem, vw, vh
- **Width/Height**: Choose between px, em, rem, vw, vh
- **Margin/Padding**: Choose between px, em, rem, vw, vh
- **Gap**: Choose between px, em, rem, vw, vh
- **Position (top/right/bottom/left)**: Choose between px, em, rem, vw, vh

## Programmatic Usage

### Converting Dimensions to CSS

```typescript
import { dimensionToCSS } from '@reallygoodwork/coral-core'

// Plain number
dimensionToCSS(16) // "16px"

// Dimension object
dimensionToCSS({ value: 1.5, unit: 'rem' }) // "1.5rem"
dimensionToCSS({ value: 100, unit: '%' }) // "100%"
```

### Normalizing Dimensions

```typescript
import { normalizeDimension } from '@reallygoodwork/coral-core'

// Converts plain numbers to dimension objects
normalizeDimension(16) // { value: 16, unit: 'px' }

// Passes through dimension objects unchanged
normalizeDimension({ value: 1.5, unit: 'rem' }) // { value: 1.5, unit: 'rem' }
```

## Backward Compatibility

All existing Coral specs using plain numbers continue to work exactly as before. Numbers are interpreted as pixels:

```json
{
  "styles": {
    "fontSize": 16,
    "padding": 20
  }
}
```

This is equivalent to:

```json
{
  "styles": {
    "fontSize": { "value": 16, "unit": "px" },
    "padding": { "value": 20, "unit": "px" }
  }
}
```

## Implementation Details

### Core Changes
- Created `zDimensionSchema` in `packages/core/src/structures/dimension.ts`
- Updated `zCoralStyleValueSchema` to accept dimension objects
- Added helper functions: `dimensionToCSS()` and `normalizeDimension()`

### Coral-to-HTML Changes
- Updated to convert dimension objects to CSS strings
- Handles both number and dimension object formats

### Playground Changes
- Created `convertFormValuesToCoralStyles()` utility
- Created `convertCoralStylesToFormValues()` utility
- Form now properly combines value + unit fields into dimension objects
- Form correctly splits dimension objects into separate value/unit fields when loading

### Parser Support
- `react-to-coral` continues to work with tw2css output (plain numbers)
- `transformHTMLToSpec` preserves dimension objects when present
