# Architecture

**Analysis Date:** 2026-02-27

## Pattern Overview

**Overall:** Client-side React SPA with route-based page components and shared utility functions

**Key Characteristics:**
- Component-based UI architecture using React with React Router v7
- Client-only rendering with fetch-based API integration to PokeAPI
- Separation of components into page-level and detailed sub-components
- Utility functions for data fetching organized separately from components
- Static lookup data (type names, stat names, colors) extracted into dedicated files

## Layers

**Presentation Layer:**
- Purpose: Render UI and handle user interactions
- Location: `src/components/`
- Contains: React functional components for pages (Results, PokemonDetails) and sub-components (SearchBar, BasicData, StatGraph, DexEntries, LearnSet)
- Depends on: Utility functions, data lookup files, React Router for navigation
- Used by: App.jsx router setup and browser rendering

**Utility/Services Layer:**
- Purpose: Fetch data from external APIs and transform responses
- Location: `src/functions/`
- Contains: `fetchPokemon.jsx` (main data fetcher), `fetchMoveList.jsx` (move details fetcher)
- Depends on: PokeAPI endpoint URLs
- Used by: All data-dependent components

**Data/Constants Layer:**
- Purpose: Provide static mapping data for UI rendering
- Location: `src/data/`
- Contains: `typeNames.js`, `statNames.js`, `statColors.js`, `evNames.js`, `gameColors.js`, `genRanges.js`, `statBackground.js`
- Depends on: Nothing
- Used by: Components for display logic and styling class generation

**Layout Layer:**
- Purpose: Provide reusable container structure
- Location: `src/components/containerSkeleton.jsx`
- Contains: ContainerSkeleton component for standardized section layouts
- Depends on: Type-based styling
- Used by: Detail page sub-components (DexEntries, LearnSet)

## Data Flow

**Home/Results Page:**

1. User loads "/" route → `App.jsx` renders `Results` component
2. `Results` component mounts → dispatches fetch via `fetchPokemon("pokemon", "")`
3. `fetchPokemon` calls PokeAPI `/pokemon?limit=1025` endpoint
4. Results data transformed to array of pokemon objects
5. User can filter by name using SearchBar state or sort by type
6. Clicking pokemon navigates to `/details/:pokemon` route

**Details Page:**

1. User navigates to `/details/:pokemon` → `App.jsx` renders `PokemonDetails` component
2. `PokemonDetails` extracts pokemon name from URL params via `useParams()`
3. Dispatches three parallel fetches via `fetchPokemon("pokemon", name)`:
   - `/pokemon/{name}` endpoint → core pokemon data
   - `/pokemon-species/{id}` endpoint → species/flavor text data
   - `/evolution-chain/{id}` endpoint → evolution data
4. Data returned as array [pokemon, species, evolution]
5. Grid layout displays BasicData (sidebar), DexEntries, LearnSet (level-up moves), LearnSet (machines), StatGraph

**Type Sorting:**

1. SearchBar type buttons trigger navigation to `/sort/{type}` or `/sort/{type1}+{type2}`
2. `Results` component receives typing param via `useParams()`
3. `fetchPokemon("type", typing)` called:
   - Single type: fetches `/type/{type}` and extracts pokemon list
   - Dual type: fetches both `/type/{type1}` and `/type/{type2}`, filters intersection
4. Filtered pokemon list rendered same as home page

**Move Loading (Details Page):**

1. `LearnSet` component filters pokemon.moves based on move_learn_method:
   - "level-up" for level-based moves
   - "machine" for TM/HM moves
2. For each move, `fetchMoveList` dispatches parallel fetches to `/move/{move_name}`
3. For machines: additionally fetches machine endpoint to get TM number
4. Move details returned and rendered in sortable tables

**State Management:**

- Page-level state (pokemonData, loading) held in component using `useState`
- Route parameters via React Router `useParams()` drive component behavior
- No global state management; data flows top-down via props
- UI state (activeTab, searchQuery, selectedGen) in individual components

## Key Abstractions

**Pokemon Data:**
- Purpose: Represents pokemon with stats, abilities, moves, species info
- Examples: `src/functions/fetchPokemon.jsx` returns PokeAPI pokemon object
- Pattern: Direct PokeAPI response object passed through components

**Move List:**
- Purpose: Fetch and transform move metadata for display
- Examples: `src/functions/fetchMoveList.jsx`
- Pattern: Filters moves by learn method, fetches full move details, sorts by TM number or level

**Type Color Mapping:**
- Purpose: Map pokemon types to Tailwind background classes for styling
- Examples: `src/data/typeNames.js` (types array), dynamic class generation `bg-${type}`
- Pattern: String interpolation in className props (note: requires SafeList in Tailwind config)

**Stat Display:**
- Purpose: Normalize stat names and provide consistent styling
- Examples: `src/data/statNames.js`, `src/data/statColors.js`, `src/data/statBackground.js`
- Pattern: Lookup objects with stat name as key, returns display label or CSS class

**Generation Range:**
- Purpose: Map tab index to pokemon game version names for filtering
- Examples: `src/data/genRanges.js`
- Pattern: Array indexed by generation (1-9), contains array of version names for that gen

**Container Skeleton:**
- Purpose: Reusable section wrapper with type-based styling
- Examples: `src/components/containerSkeleton.jsx`
- Pattern: Wrapper component accepting title, type, and children for consistent presentation

## Entry Points

**Application Root:**
- Location: `src/main.jsx`
- Triggers: Browser loads index.html
- Responsibilities: Bootstrap React app, configure Router with three routes, render to DOM

**App Component:**
- Location: `src/App.jsx`
- Triggers: All route navigation
- Responsibilities: Route-based conditional rendering of Results or PokemonDetails page components

**Results Component:**
- Location: `src/components/Results.jsx`
- Triggers: "/" and "/sort/{typing}" routes
- Responsibilities: Fetch pokemon list (all or filtered by type), manage search query state, render searchable grid

**PokemonDetails Component:**
- Location: `src/components/PokemonDetails.jsx`
- Triggers: "/details/{pokemon}" route
- Responsibilities: Fetch pokemon, species, and evolution data; compose detail page with sub-components

**SearchBar Component:**
- Location: `src/components/SearchBar.jsx`
- Triggers: Rendered on both Results and Details pages
- Responsibilities: Search input, type filter buttons, navigation for sorting/searching

## Error Handling

**Strategy:** Throw errors on fetch failures; errors not caught, causing component to crash

**Patterns:**
- Network errors: fetch response check `if (!response.ok) throw Error(...)`
- Missing data: Components check for data existence before rendering (e.g., `{pokemonData &&}`)
- Loading states: Components show "Loading..." while fetching
- No data fallback: Render "No entries available" when filtered data is empty

## Cross-Cutting Concerns

**Logging:** None - no logging framework in place

**Validation:** Minimal - filtering via `.includes()` for name search, type safety delegated to PokeAPI

**Authentication:** None - PokeAPI is public, no auth required

**Styling:** Tailwind CSS with dynamic class generation for type colors and stat colors (note: SafeList configuration required for dynamic classes to work in production)

---

*Architecture analysis: 2026-02-27*
