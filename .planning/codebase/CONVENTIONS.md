# Coding Conventions

**Analysis Date:** 2026-02-27

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `SearchBar.jsx`, `Results.jsx`, `PokemonDetails.jsx`)
- Data files: camelCase (e.g., `statNames.js`, `evNames.js`, `typeNames.js`)
- Utility/function files: camelCase (e.g., `fetchPokemon.jsx`, `fetchMoveList.jsx`)
- Directories: lowercase with hyphens for multi-word names (e.g., `PokemonDetailsComponents/`)

**Functions:**
- React components: PascalCase for component names (e.g., `SearchBar`, `BasicData`, `StatGraph`)
- Async functions: camelCase with clear action verbs (e.g., `fetchPokemon`, `fetchMoveList`)
- Event handlers: camelCase with `on` prefix in JSX callbacks (e.g., `onChange`, `onClick`)

**Variables:**
- Local state: camelCase (e.g., `pokemonData`, `searchQuery`, `activeTab`)
- Constants exported: camelCase for object exports (e.g., `statNames`, `evNames`, `types`)
- Boolean flags: clear descriptive names (e.g., `loading`, `is_hidden`, `active1`, `active2`)

**Types:**
- No TypeScript usage detected; codebase uses plain JavaScript
- JSDoc comments not consistently applied (see Comments section below)

## Code Style

**Formatting:**
- Prettier configured (`.prettierrc` present but empty - uses defaults)
- Indentation: 2 spaces (observed across all files)
- Line length: Mixed, some lines exceed 80 characters (particularly in JSX className props)
- Quotes: Double quotes for strings (consistently used)

**Linting:**
- ESLint configured with `eslint.config.js`
- Rules:
  - `no-unused-vars`: Error with pattern `^[A-Z_]` to allow uppercase-starting unused vars
  - React Hooks: `react-hooks/recommended-latest` enforced
  - React Refresh: `react-refresh` configured for Vite
- No TypeScript linting (JS/JSX only)

## Import Organization

**Order:**
1. React and framework imports (e.g., `import { useState, useEffect } from "react"`)
2. External library imports (e.g., `import { useNavigate } from "react-router"`)
3. Local component imports (relative paths, e.g., `import SearchBar from "./SearchBar"`)
4. Data/utility imports (relative paths, e.g., `import { types } from "../data/typeNames"`)

**Path Aliases:**
- No path aliases configured
- All imports use relative paths (e.g., `../data/`, `../../functions/`, `../components/`)

## Error Handling

**Patterns:**
- Try-catch blocks used in async fetch operations (minimal):
  - Example: `if (!response.ok) { throw new Error("Network response was not ok"); }`
  - Error messages are generic and repeated across all fetch functions
- No custom error classes or error boundary components observed
- Error states stored in component state (e.g., `setLoading`, `setPokemonData`)
- Errors in async operations handled with simple throw statements
- Components display "Loading..." as fallback during API calls

**Guidelines:**
- Errors are not logged to console
- No error recovery mechanisms in place
- Failed API calls will crash the component without graceful fallback

## Logging

**Framework:** Console not explicitly used for logging
- No logging framework detected (no winston, pino, etc.)
- No console.log statements in production code
- Debug comments present (e.g., `/* Placeholder: Replace with actual... */` in `LearnSet.jsx`)

**Patterns:**
- No consistent logging approach
- No debug mode or log levels
- Comments used instead of logging for developer notes

## Comments

**When to Comment:**
- Comments are sparse throughout codebase
- When used, they describe non-obvious logic or mark placeholder sections
- Example placeholders: `/* Placeholder: Replace with actual type fetching logic */` (lines 277-278 in `LearnSet.jsx`)

**JSDoc/TSDoc:**
- No JSDoc comments used
- No function documentation
- No parameter type documentation
- No return type documentation

## Function Design

**Size:**
- Components range from ~50 lines (NavBar) to ~340 lines (LearnSet)
- Larger components show opportunities for refactoring
- Example: `LearnSet.jsx` has duplicated JSX for "level" and "machine" modes (lines 69-194 vs 195-338)

**Parameters:**
- React components use destructuring with curly braces:
  ```javascript
  const BasicData = ({ poke, species }) => { ... }
  const StatGraph = ({ poke }) => { ... }
  ```
- Props passed explicitly without spread operators
- Async functions accept simple parameters (string/object types):
  ```javascript
  async function fetchPokemon(sort, pokemon) { ... }
  async function fetchMoveList(moves, list, gen) { ... }
  ```

**Return Values:**
- React components return JSX or conditional JSX
- Async functions return Promise-resolved JSON data
- No explicit return type annotations (not using TypeScript)
- Conditional renders using ternary operators and logical && operators

## Module Design

**Exports:**
- Named exports for data constants: `export const types = [...]`
- Default exports for components: `export default App`, `export default SearchBar`
- Default exports for async functions: `export default fetchPokemon`
- Mixed export strategy: some modules use named exports, others use default

**Barrel Files:**
- No barrel files (`index.js`) used for organizing exports
- Each file has single primary export
- Imports import directly from source files

## Special Patterns

**React Hooks Usage:**
- `useState` for local component state
- `useEffect` for side effects and API calls
- `useParams` from react-router for URL parameters
- `useNavigate` from react-router for programmatic navigation
- ESLint rules enforce proper hook dependencies (missing dependencies in some useEffect hooks noted in `LearnSet.jsx` line 25 with eslint-disable comment)

**Data Structure:**
- Data files export objects/arrays as constants (e.g., `statNames`, `typeNames`, `evNames`)
- No data models or type definitions
- Direct access to nested API response objects

**Tailwind CSS Usage:**
- Dynamic class names generated with template literals:
  ```javascript
  className={`bg-${type} ${condition ? "ring-2" : ""}`}
  ```
- No component-level CSS modules
- Extensive use of responsive classes (sm:, md:, lg:)
- Custom colors referenced via config (e.g., `bg-${type}`, `bg-${type}-secondary`)

**URL/Navigation Patterns:**
- Route parameters destructured: `const { pokemon, typing } = useParams()`
- Navigation with `navigate()` hook: `navigate(`/sort/${type}`)`
- Pokemon names converted to lowercase: `.toLowerCase()`
- Hyphens used as spaces in URLs: `.replace(/\s+/g, "-")`

---

*Convention analysis: 2026-02-27*
