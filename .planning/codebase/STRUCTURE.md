# Codebase Structure

**Analysis Date:** 2026-02-27

## Directory Layout

```
pokeapi-r2/
├── src/                          # Application source code
│   ├── App.jsx                   # Root app component with router
│   ├── App.css                   # App-level styles
│   ├── main.jsx                  # Entry point, router setup
│   ├── index.css                 # Global styles
│   ├── assets/                   # Static assets
│   ├── components/               # React components
│   │   ├── NavBar.jsx            # Header navigation
│   │   ├── Results.jsx           # Pokemon list page
│   │   ├── PokemonDetails.jsx    # Pokemon detail page
│   │   ├── SearchBar.jsx         # Search/filter component
│   │   ├── containerSkeleton.jsx # Reusable container wrapper
│   │   └── PokemonDetailsComponents/
│   │       ├── BasicData.jsx     # Pokemon stats sidebar
│   │       ├── StatGraph.jsx     # Stats table visualization
│   │       ├── DexEntries.jsx    # Pokedex flavor text by generation
│   │       └── LearnSet.jsx      # Move learnset tables (level-up/machine)
│   ├── context/                  # Context API (empty, unused)
│   ├── data/                     # Static lookup data
│   │   ├── typeNames.js          # Array of pokemon types
│   │   ├── statNames.js          # Stat name mappings
│   │   ├── statColors.js         # Stat color class mappings
│   │   ├── statBackground.js     # Stat row background classes
│   │   ├── evNames.js            # EV name abbreviations
│   │   ├── gameColors.js         # Game version color mappings
│   │   └── genRanges.js          # Generation-to-version mappings
│   └── functions/                # Utility/service functions
│       ├── fetchPokemon.jsx      # Main data fetcher (pokemon/type/details)
│       └── fetchMoveList.jsx     # Move details fetcher
├── public/                       # Static public assets
├── dist/                         # Build output (not committed)
├── vite.config.js                # Vite build configuration
├── package.json                  # Dependencies and scripts
├── eslintrc.js                   # ESLint configuration
└── index.html                    # HTML entry point
```

## Directory Purposes

**`src/`:**
- Purpose: All application source code
- Contains: React components, utility functions, data lookup files
- Key files: `main.jsx` (bootstrap), `App.jsx` (routing)

**`src/components/`:**
- Purpose: React UI components for pages and sub-pages
- Contains: Page components (Results, PokemonDetails), layout components (NavBar, SearchBar), detail sub-components
- Key files: `Results.jsx` (home/sort page), `PokemonDetails.jsx` (detail page), `SearchBar.jsx` (search/filter)

**`src/components/PokemonDetailsComponents/`:**
- Purpose: Modular sub-components for pokemon detail page
- Contains: Specialized display components for different data types
- Key files: `BasicData.jsx` (sidebar info), `StatGraph.jsx` (stats table), `DexEntries.jsx` (flavor text), `LearnSet.jsx` (move tables)

**`src/data/`:**
- Purpose: Static mapping and lookup data
- Contains: Type names, stat names, color mappings, generation ranges
- Key files: All `.js` files export constants used by components for display logic

**`src/functions/`:**
- Purpose: Asynchronous data fetching and transformation
- Contains: Functions that call PokeAPI and return processed responses
- Key files: `fetchPokemon.jsx` (main fetcher), `fetchMoveList.jsx` (move detail fetcher)

**`src/context/`:**
- Purpose: Reserved for React Context API
- Status: Currently empty, unused
- Future use: Global state management if needed

## Key File Locations

**Entry Points:**
- `src/main.jsx`: Bootstrap React app, configure BrowserRouter with three routes
- `src/App.jsx`: Root component with conditional page rendering based on route
- `index.html`: HTML shell with root div

**Configuration:**
- `vite.config.js`: Vite build config with React and Tailwind plugins
- `package.json`: Dependencies (React, React Router, Tailwind, Vite) and dev scripts
- `.eslintrc.js`: ESLint rules for code quality

**Core Logic:**
- `src/functions/fetchPokemon.jsx`: Handles home page fetch (all pokemon), type sorting (intersection of type1 + type2), detail page fetch (pokemon + species + evolution)
- `src/functions/fetchMoveList.jsx`: Fetches move details and TM information in parallel

**Page Components:**
- `src/components/Results.jsx`: Home and sort page, manages pokemonData state, search filtering
- `src/components/PokemonDetails.jsx`: Detail page, fetches pokemon/species/evolution, composes grid layout

**Shared Components:**
- `src/components/SearchBar.jsx`: Renders on both Results and Details, different layouts based on page prop
- `src/components/NavBar.jsx`: Header with home link, fixed positioning
- `src/components/containerSkeleton.jsx`: Wrapper for detail sections

**Testing:**
- Not detected - no test files present

## Naming Conventions

**Files:**
- Page components: PascalCase (e.g., `PokemonDetails.jsx`, `Results.jsx`)
- Utility functions: camelCase (e.g., `fetchPokemon.jsx`, `fetchMoveList.jsx`)
- Data/constants: camelCase (e.g., `typeNames.js`, `statColors.js`)
- Sub-component folders: PascalCase (e.g., `PokemonDetailsComponents/`)
- CSS files: Same name as component or lowercase (e.g., `App.css`, `index.css`)

**Directories:**
- Feature/domain folders: PascalCase (e.g., `PokemonDetailsComponents/`)
- Utility folders: camelCase (e.g., `functions/`, `context/`, `data/`)

**Component Exports:**
- Named exports not used; all components use `export default ComponentName`
- Functions exported as `export default functionName`

## Where to Add New Code

**New Feature (e.g., Evolution Display):**
- Primary code: `src/components/PokemonDetailsComponents/` (new component file)
- Data lookup if needed: `src/data/` (new constants file)
- Integration: Import in `src/components/PokemonDetails.jsx` and render in grid layout

**New Utility Function (e.g., Evolution Fetcher):**
- Implementation: `src/functions/` (new file, e.g., `fetchEvolutions.jsx`)
- Pattern: Async function taking parameters, fetch from PokeAPI, return processed data
- Usage: Import in component, call in useEffect when route params change

**New Data Lookup (e.g., Evolution Condition Mappings):**
- Implementation: `src/data/` (new file, e.g., `evolutionConditions.js`)
- Pattern: Export constant object or array
- Usage: Import in component, use for display logic or className generation

**New Page (e.g., Move Browser):**
- Component: Create `src/components/MoveBrowser.jsx`
- Route: Add route in `src/main.jsx` BrowserRouter
- Navigation: Add link in `src/components/NavBar.jsx`
- Share SearchBar: Reuse `src/components/SearchBar.jsx` with page prop if needed

**New Sub-component (e.g., Evolution Chain Display):**
- Implementation: `src/components/PokemonDetailsComponents/EvolutionChain.jsx`
- Pattern: Receive pokemon data via props, render using data from `src/data/` lookups
- Integration: Import in parent (PokemonDetails) and render with required props

## Special Directories

**`dist/`:**
- Purpose: Build output directory
- Generated: Yes, by Vite during build
- Committed: No (listed in .gitignore)

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes, by npm install
- Committed: No (listed in .gitignore)

**`public/`:**
- Purpose: Static assets served as-is
- Generated: No, manually managed
- Committed: Yes, but likely empty or minimal

**`assets/`:**
- Purpose: Application-specific images and static resources
- Generated: No, manually added
- Committed: Yes

## Import Path Style

**Standard Pattern:**
- Relative imports from same directory: `./ComponentName` or `./utils.js`
- Relative imports crossing directories: `../../data/typeNames.js` or `../functions/fetchPokemon.jsx`
- No path aliases configured in `vite.config.js`

**Module Boundaries:**
- Components import from: functions, data, and other components
- Functions import from: nothing (pure data fetching)
- Data files import from: nothing (pure constants)

---

*Structure analysis: 2026-02-27*
