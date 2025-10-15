# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coral UI is a bi-directional design-to-code platform that creates a unified specification format (JSON schema) serving as the single source of truth for UI components. The system enables seamless transformation between Figma designs and production code across multiple frameworks.

## Development Commands

### Package Management
- Uses **pnpm** (version 10.12.3) - ensure you use pnpm for all operations
- Node.js requirement: ≥20.12.0

### Build & Development
```bash
# Install dependencies
pnpm install

# Development (all packages with watch mode)
pnpm dev

# Build all packages
pnpm build

# Clean build artifacts
pnpm clean:ws
```

### Testing
```bash
# Run all tests
pnpm test

# Watch mode for tests
pnpm test:watch

# Coverage reports
pnpm test:coverage

# For core package specifically:
cd packages/core
npm run test:verbose
```

### Code Quality
```bash
# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format:fix

# Type checking
pnpm typecheck

# Workspace dependency checking
pnpm lint:ws
```

## Architecture Overview

### Monorepo Structure
- **Turborepo** for build orchestration and caching
- **pnpm workspaces** for dependency management
- All tasks have proper dependency chains defined in `turbo.json`

### Core Packages (`packages/`)
- **`core/`**: Main validation and parsing engine using Zod v4 schemas
- **`react-to-coral/`**: AST-based React component analysis (Babel parser)
- **`coral-to-html/`**: HTML/CSS generation from Coral specs
- **`tw2css/`**: Tailwind CSS to standard CSS conversion
- **`style-to-tailwind/`**: Reverse transformation for style objects

### Applications (`apps/`)
- **`coral/`**: Figma plugin (Vite + React + TypeScript)
- **`docs/`**: Astro-based documentation site
- **`playground/`**: Development testing environment

### Key Data Flow
1. **Input Sources**: Figma components, React components, HTML, or JSON specs
2. **Central Specification**: Validated Coral JSON schema (Zod v4)
3. **Output Targets**: React components, HTML/CSS, Figma nodes, design tokens

## Important Development Practices

### Schema Validation
- All specifications validated through Zod v4 schemas in `packages/core/schemas/`
- Use consistent naming: `zComponentNameSchema` pattern
- Prefer `z.infer<typeof schema>` for type extraction
- Use `safeParse()` for runtime validation with error handling

### Package Dependencies
- Internal packages use `workspace:*` syntax in package.json
- Peer dependencies: `colord` for color manipulation, `node-html-parser` for HTML parsing
- Core package is framework-agnostic - keep it that way

### Figma Plugin Development
- Plugin code in `apps/coral/src/plugin/code.ts`
- UI in `apps/coral/src/ui/` (React components)
- Uses `figma.showUI()` and message passing for communication
- Build outputs to `apps/coral/code.js` for Figma

### AST Processing
- React component analysis uses Babel parser with JSX and TypeScript plugins
- Located in packages that end with `-to-coral` or `coral-to-*`
- Extract: imports, methods, state hooks, component properties, JSX structure

### Testing Strategy
- Jest with ts-jest preset
- Test files in `__tests__/` directories within each package
- Mock external dependencies (e.g., `tw2css` package)
- Run `pnpm typecheck` after making changes to ensure type safety

### Code Style
- Uses Prettier for formatting
- ESLint configuration in `utilities/eslint-config/`
- TypeScript configs in `utilities/typescript-config/`
- Import sorting with `@ianvs/prettier-plugin-sort-imports`

## Special Notes

### Performance Considerations
- Avoid artificial delays in production code (some exist in current codebase)
- Use parallel processing where possible (Turbo handles build parallelization)
- Schema validation is critical - don't bypass Zod validation

### Tailwind CSS v4 Support
- The project follows Tailwind v4 patterns (see `.cursor/rules/tailwind.mdc`)
- Use CSS-first configuration with `@theme` directive
- Prefer `bg-black/50` over deprecated `bg-opacity-*` utilities

### Figma Plugin Constraints
- Plugin must be self-contained (no external API calls)
- All processing happens client-side
- UI components should handle loading states properly

### Schema Generation
- Run `npm run schemas:generate` in core package to update JSON schemas
- Schemas are auto-generated from Zod definitions
- CLI tool available: `coral-schemas` binary

## File Locations for Common Tasks

- **Add new Coral spec validation**: `packages/core/src/structures/`
- **Modify React component parsing**: `packages/react-to-coral/`
- **Update Figma plugin UI**: `apps/coral/src/ui/`
- **Change HTML generation**: `packages/coral-to-html/`
- **Add new transformation utilities**: `packages/core/src/utils/`
- **Update schema definitions**: Auto-generated from TypeScript types in structures

This is a sophisticated codebase with clear separation of concerns. Always validate changes through the existing test suite and type checking before committing.