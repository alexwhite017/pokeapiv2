# Testing Patterns

**Analysis Date:** 2026-02-27

## Test Framework

**Runner:**
- Not configured - no test framework detected
- No `jest.config.js`, `vitest.config.js`, or similar test configuration files
- No test scripts in `package.json` (only "dev", "build", "lint", "preview")

**Assertion Library:**
- Not present - no testing dependencies installed

**Run Commands:**
```bash
npm run lint              # Only linting available
npm run dev              # Development server
npm run build            # Production build
npm run preview          # Preview built app
```

## Test File Organization

**Location:**
- No test files present in codebase
- No `__tests__/` directory structure
- No `*.test.js`, `*.test.jsx`, `*.spec.js`, or `*.spec.jsx` files in `src/` directory
- Testing patterns: Not established

**Naming:**
- No test naming conventions defined or observed

**Structure:**
- Not applicable - no tests exist

## Test Structure

**Suite Organization:**
- Not applicable - testing not implemented

**Patterns:**
- No setup/teardown patterns
- No test assertions
- No test organization

## Mocking

**Framework:**
- Not used - no mocking library configured

**Patterns:**
- No mock data factories observed
- No fetch mocking (no fetch-mock, msw, or similar)
- Real API calls made in development and component logic

**What to Mock:**
- When testing is added, mock these external dependencies:
  - PokeAPI fetch calls in `fetchPokemon.jsx` and `fetchMoveList.jsx`
  - `useNavigate` hook from react-router
  - `useParams` hook from react-router

**What NOT to Mock:**
- React hooks (useState, useEffect) - test behavior instead
- Component rendering logic - test actual component output

## Fixtures and Factories

**Test Data:**
- No test fixtures or factories present
- Data files (`statNames.js`, `evNames.js`, `typeNames.js`) could serve as fixtures once testing is added
- Example static data structure from `statNames.js`:
  ```javascript
  export const statNames = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    speed: "Speed",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
  };
  ```

**Location:**
- Data files live in `src/data/` directory
- Could be extended to include mock API response fixtures

## Coverage

**Requirements:**
- Not enforced - no coverage configuration or targets

**View Coverage:**
- Not available - no testing setup

## Test Types

**Unit Tests:**
- Not implemented
- Would test:
  - Pure data transformations in `fetchPokemon.jsx` (API response filtering)
  - Data lookup functions (e.g., stat name mapping)
  - URL parameter parsing

**Integration Tests:**
- Not implemented
- Would test:
  - Component rendering with API data
  - Navigation between routes
  - State synchronization across components

**E2E Tests:**
- Not implemented
- Could use Cypress or Playwright to test:
  - Search bar autocomplete workflow
  - Pokemon details page loading and display
  - Type filtering functionality
  - Navigation between pages

## Common Patterns

**Async Testing:**
- Not applicable - no async test patterns established
- Components use `useEffect` + `useState` for async data loading
- When testing, would need async/await patterns:
  ```javascript
  // Pattern to follow when testing async operations:
  // 1. Mock fetch responses
  // 2. Render component
  // 3. Wait for async operations
  // 4. Assert expected state/output
  ```

**Error Testing:**
- Not applicable - no error testing patterns
- Error handling in code uses try-catch with simple throw statements
- When testing, would need to:
  - Mock failed API responses
  - Assert error states are handled gracefully
  - Verify error messages are displayed to users

## Critical Testing Gaps

**Untested Components:**
- `SearchBar.jsx` (190 lines) - complex state management for active types
- `Results.jsx` (99 lines) - data filtering and filtering logic
- `PokemonDetails.jsx` (67 lines) - multi-step data fetching
- `BasicData.jsx` (234 lines) - conditional rendering based on props
- `LearnSet.jsx` (342 lines) - largest component, complex move filtering and sorting

**Untested Functions:**
- `fetchPokemon.jsx` - multiple API endpoints, data filtering for type combinations
- `fetchMoveList.jsx` - complex Promise.all patterns and data transformation

**High-Risk Areas Without Tests:**
- API data filtering logic in `fetchPokemon.jsx` (lines 39-41: type intersection filter)
- Move sorting in `LearnSet.jsx` (lines 47-59: complex version_group_details lookup)
- String manipulation for display (e.g., Pokemon name formatting with hyphens)

## Recommended Testing Approach

**Setup Steps:**
1. Install test framework: `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom`
2. Create `vitest.config.js` with React plugin
3. Create `src/**/*.test.jsx` files co-located with components
4. Add test script to `package.json`: `"test": "vitest"`

**First Tests to Write:**
1. Unit tests for data transformation in `fetchPokemon.jsx`
2. Component snapshot tests for `NavBar.jsx` (simplest component)
3. Integration tests for `SearchBar.jsx` with mocked navigation
4. API error handling tests for fetch functions

---

*Testing analysis: 2026-02-27*
