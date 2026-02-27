# Roadmap: PokeAPI Browser — Dark Theme + Type-Color UI Overhaul

## Overview

Transform an existing React SPA from a generic white-background data browser into a visually immersive, dark-themed Pokédex where each Pokémon's primary type drives the visual identity of every surface. The overhaul runs in four phases: establish the design token foundation, restyle the grid cards, restyle the detail page, then add the finishing polish details. Each phase depends on the previous — type-colored components cannot be built until the token layer exists; the detail page cannot be built until shared atoms are stable; polish details cannot be layered on until card dimensions are fixed.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Establish dark global theme, design tokens, and fix pre-existing production bugs (completed 2026-02-27)
- [ ] **Phase 2: Grid Cards** - Restyle Pokémon cards with type-colored backgrounds, artwork, and hover states
- [ ] **Phase 3: Detail Page** - Apply type-color theming, polished stat bars, and dark move tables throughout the detail page
- [ ] **Phase 4: Polish** - Add watermark, skeleton loading, and Prev/Next navigation to elevate the experience

## Phase Details

### Phase 1: Foundation
**Goal**: The app has a coherent dark base and all design tokens are in place — no light-colored holes, no silent production build failures
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. Every page background is dark — no white flash on load, on wide viewports, or on iOS overscroll bounce
  2. No `bg-white`, `text-black`, or hardcoded light colors remain anywhere in the component tree
  3. All dynamic Tailwind class patterns (bg/text/border/ring for all 18 types) generate correctly in `vite build` output
  4. Stat bar widths render correctly in production (no silent broken-width bug)
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Dark base (index.css) and design tokens (@theme in App.css)
- [x] 01-02-PLAN.md — Component dark sweep and stat bar production fix
- [x] 01-03-PLAN.md — LearnSet gray palette gap closure

### Phase 2: Grid Cards
**Goal**: The Pokémon grid communicates each Pokémon's type identity at a glance — type-colored backgrounds, prominent artwork, readable identity information, and a satisfying hover response
**Depends on**: Phase 1
**Requirements**: CARD-01, CARD-02, CARD-03, CARD-04, CARD-05
**Success Criteria** (what must be TRUE):
  1. Each grid card shows a full type-colored background matching the Pokémon's primary type
  2. Cards display the official artwork (not pixel sprite) as the visual centerpiece
  3. Type badges on cards are pill-shaped and consistently styled
  4. Cards lift with scale and shadow on hover
  5. Each card shows its Pokédex number in zero-padded `#NNN` format
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md — Static type lookup table (pokemonTypes.js) and PokemonCard component
- [ ] 02-02-PLAN.md — Wire Results.jsx to use PokemonCard; production build verification

### Phase 3: Detail Page
**Goal**: The detail page feels immersive and easy to scan — type identity saturates the page, stats are visually informative at a glance, and move tables are clean and readable
**Depends on**: Phase 2
**Requirements**: DETAIL-01, DETAIL-02, DETAIL-03, DETAIL-04
**Success Criteria** (what must be TRUE):
  1. The entire detail page — background, section containers, and accents — reflects the Pokémon's primary type color
  2. Stat bars communicate quality with color: red for low stats, through teal for exceptional stats
  3. Stat bars have consistent height, rounded corners, clear labels, and numeric values with adequate row spacing
  4. Move tables use dark rows, a type-accented header, and pill-shaped type badges in type cells
**Plans**: TBD

### Phase 4: Polish
**Goal**: The app earns "enthusiast-grade Pokédex" status through craft details — loading states, watermarks, and Pokémon-to-Pokémon navigation that make it feel complete and premium
**Depends on**: Phase 3
**Requirements**: POLISH-01, POLISH-02, POLISH-03
**Success Criteria** (what must be TRUE):
  1. Grid cards display a large low-opacity Pokédex number watermark behind the artwork
  2. The grid shows shimmer skeleton placeholders during initial data load instead of a text loading indicator
  3. On the detail page, the user can navigate to the previous or next Pokémon without returning to the grid
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete   | 2026-02-27 |
| 2. Grid Cards | 0/2 | Not started | - |
| 3. Detail Page | 0/TBD | Not started | - |
| 4. Polish | 0/TBD | Not started | - |
