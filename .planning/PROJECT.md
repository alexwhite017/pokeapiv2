# PokeAPI Browser (pokeapi-r2)

## What This Is

A React SPA for browsing and exploring Pokémon data. Users can search and filter all 1,025 Pokémon by name or type, then dive into detailed pages showing stats, moves, Pokédex entries, and evolution chains — all powered by the public PokeAPI.

## Core Value

A visually immersive, dark-themed Pokémon browser where each Pokémon's type identity drives the entire experience — from the grid card to the detail page — making it feel like a polished, enthusiast-grade Pokédex.

## Requirements

### Validated

<!-- Shipped and confirmed valuable — inferred from existing codebase -->

- ✓ Browse all 1,025 Pokémon in a searchable grid — existing
- ✓ Filter Pokémon by single or dual type — existing
- ✓ View Pokémon details: stats, moves (level-up + TM), Pokédex entries, evolution chain — existing
- ✓ Navigate between list and detail views — existing
- ✓ Sort moves by level or TM number — existing

### Active

<!-- UI overhaul goals — what we're building toward -->

- [ ] Dark-themed global design with type colors as the visual hero
- [ ] Pokémon cards show type-colored backgrounds, artwork, name, and type badges
- [ ] Details page has clear visual hierarchy with generous spacing between sections
- [ ] Stat bars and move tables are visually polished and easy to scan
- [ ] Each Pokémon's detail page reflects its type identity through color theming
- [ ] Overall layout feels modern — not cramped, not cluttered

### Out of Scope

- User accounts or saved favorites — not core to this experience
- Backend/server-side rendering — static SPA stays as-is
- Adding new data sources beyond PokeAPI — keep scope focused

## Context

**Existing codebase:** React 19, Tailwind CSS 4, React Router 7, Vite 7. Client-side only SPA fetching from public PokeAPI. All styling currently uses Tailwind utility classes; type colors are dynamically generated via string interpolation (Tailwind SafeList required).

**Current problems identified:**
- Visual design feels generic and unpolished — no sense of Pokémon identity
- Navigation and discoverability feel awkward
- Details page is cramped and hard to parse — too much close together, ugly designs
- No cohesive dark theme — type colors aren't leveraged as a design element

**User's direction:** Dark theme overall; type colors as hero (card backgrounds, detail page accent colors); cards show artwork prominently; details page needs breathing room and visual polish.

## Constraints

- **Tech stack:** React 19, Tailwind CSS 4, React Router 7 — no framework changes
- **Data:** PokeAPI only, no backend changes
- **Functionality:** All existing features must continue to work — this is a visual overhaul, not a feature rework

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dark theme as global base | User explicitly chose this direction | — Pending |
| Type color backgrounds on cards | User selected this card style | — Pending |
| Keep existing tech stack | Brownfield project, no reason to change | — Pending |

---
*Last updated: 2026-02-27 after initialization*
