# PokeAPI Browser (pokeapi-r2)

## What This Is

A React SPA for browsing and exploring Pokémon data, styled as a dark-themed, visually immersive Pokédex where each Pokémon's primary type drives the entire UI. Users search and filter all 1,025 Pokémon, view type-colored grid cards with official artwork, and explore detail pages with type-saturated backgrounds, animated stat bars, dark move tables, and inline Prev/Next navigation.

## Core Value

A visually immersive, dark-themed Pokémon browser where each Pokémon's type identity drives the entire experience — from grid card to detail page — making it feel like a polished, enthusiast-grade Pokédex.

## Requirements

### Validated

<!-- Shipped and confirmed valuable -->

- ✓ Browse all 1,025 Pokémon in a searchable grid — existing (pre-v1.0)
- ✓ Filter Pokémon by single or dual type — existing (pre-v1.0)
- ✓ View Pokémon details: stats, moves (level-up + TM), Pokédex entries, evolution chain — existing (pre-v1.0)
- ✓ Navigate between list and detail views — existing (pre-v1.0)
- ✓ Sort moves by level or TM number — existing (pre-v1.0)
- ✓ Dark-themed global design with type colors as the visual hero — v1.0
- ✓ Pokémon cards show type-colored backgrounds, official artwork, name, and type badges — v1.0
- ✓ Each Pokémon's detail page reflects its type identity through color theming — v1.0
- ✓ Stat bars are visually polished and communicate quality at a glance — v1.0
- ✓ Move tables are dark, clean, and easy to scan — v1.0
- ✓ Grid shows skeleton loading states instead of text — v1.0
- ✓ Detail page has Prev/Next navigation for adjacent Pokémon — v1.0

### Active

<!-- Next milestone goals — not yet addressed -->

- [ ] Evolution chain implemented (currently placeholder)
- [ ] Error states for API failures
- [ ] Category icons (SVG) for Physical/Special/Status in move tables (MOVE-V2-01)
- [ ] Egg moves and tutor moves tables (MOVE-V2-02)

### Out of Scope

- Light/dark theme toggle — dark-only design direction; type colors work on dark surfaces only
- Pagination on grid — fixed 1,025 Pokémon universe; all loaded at once is intentional UX
- New data sources beyond PokeAPI — no backend changes
- User accounts / favorites — not core to browsing experience
- 3D/holographic hover effects — performance cost on 1,025-item grid; visual fatigue at scale
- Artwork bleed/float effect (DETAIL-V2-01) — deferred; complex layout with marginal gain
- Per-card skeleton-to-content crossfade (DETAIL-V2-02) — deferred; requires per-card onLoad tracking

## Context

**Shipped:** v1.0 UI Overhaul — 2026-02-27
**Codebase:** 2,782 LOC (src), React 19, Tailwind CSS 4, React Router 7, Vite 7. Client-side only SPA.
**What was built in v1.0:** Dark design token system (zinc palette + 18 type color tokens), type-colored PokemonCard grid, full detail page immersion, animated stat bars, dark move tables, shimmer skeleton loading, dex watermark, and Prev/Next navigation.

**Known issues:**
- Evolution chain page shows placeholder text — not yet implemented
- No error handling for API failures (blank UI on network error)

## Constraints

- **Tech stack:** React 19, Tailwind CSS 4, React Router 7 — no framework changes
- **Data:** PokeAPI only, no backend changes
- **Functionality:** All existing features must continue to work — this is a visual overhaul, not a feature rework

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dark theme as global base | User explicitly chose this direction | ✓ Good — no regressions |
| Type color backgrounds on cards | User selected this card style | ✓ Good — clear type identity at a glance |
| Keep existing tech stack | Brownfield project, no reason to change | ✓ Good — no migration cost |
| Dark-always, no `dark:` variants | Simpler — unconditionally dark app | ✓ Good — zero toggle complexity |
| Static `pokemonTypes.js` lookup | Zero extra API calls for type color rendering | ✓ Good — instant, no loading states needed |
| CSS custom property for dynamic gradients | Tailwind JIT purges string-interpolated classes | ✓ Good — correct in all builds |
| `@source inline()` for dynamic Tailwind patterns | Tailwind 4 requires explicit registration | ✓ Good — required for type badge classes |
| Stat bar inline styles for widths | JIT purges runtime-computed width utilities | ✓ Good — fixes silent production bug |
| CSS var `--active-type-color` on `:root` for NavBar | Zero prop drilling through component tree | ✓ Good — elegant signal with MutationObserver |
| Watermark before artwork in DOM order | Normal-flow artwork paints on top without z-index | ✓ Good — simpler than z-index management |
| 24 skeleton cards | Fills xl breakpoint viewport (6 cols × 4 rows) | ✓ Good — works at all narrower breakpoints |

---
*Last updated: 2026-02-27 after v1.0 milestone*
