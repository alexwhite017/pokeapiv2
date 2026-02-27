# Project Research Summary

**Project:** PokeAPI Browser — Dark Theme + Type-Color UI Overhaul
**Domain:** React SPA Pokédex — dark-themed, type-color-driven redesign of existing app
**Researched:** 2026-02-27
**Confidence:** HIGH

## Executive Summary

This is a brownfield UI overhaul of an existing React 19 + Tailwind CSS 4 + Vite SPA, not a greenfield project. The core stack is locked and healthy. The goal is a transformation from a white-background generic data browser into an immersive, dark-themed Pokédex where each Pokémon's primary type drives the visual identity of every page. The pattern is well-established in the Pokédex UI genre (the Saepul Nahwan Dribbble design established type-color-as-card-background as the convention) and the technical approach is clear: CSS design tokens via Tailwind's `@theme` block, CSS custom property injection at the page level for runtime type theming, and incremental component replacement.

The recommended approach follows a strict build order: design token foundation first, then shared atom components (TypeBadge, SectionCard, PokemonCard), then the list page, then the detail page. This order is non-negotiable — type-colored components cannot be built correctly until the `@theme` token layer and `@source inline()` registry are established. Skipping ahead will produce components that work in `vite dev` but break silently in production builds, which is the single most dangerous failure mode in this project.

The dominant risk is Tailwind v4's dynamic class scanning limitation. The existing codebase already has this mostly solved via `@source inline()` in `App.css`, but the overhaul will introduce new class patterns (rings, gradients, shadows, text colors) that must each be explicitly registered. A secondary risk is the 20+ hardcoded `bg-white`/`text-black` instances scattered across `BasicData.jsx`, `SearchBar.jsx`, and `LearnSet.jsx` that will create jarring white holes in the dark theme if not audited and replaced with semantic tokens before other work begins.

## Key Findings

### Recommended Stack

The existing stack (React 19.1.1, React Router 7.9.1, Tailwind CSS 4.1.13, Vite 7.1.6) requires no changes. Four supporting libraries should be added: `motion` v12 (animations — the official successor to framer-motion with React 19 Strict Mode fixes), `clsx` v2.1.1 (conditional className construction), `tailwind-merge` v3.5.0 (Tailwind class conflict resolution — v3 explicitly adds TW4 support), and `class-variance-authority` v0.7.1 (type-badge and card variant definitions for the 18 Pokémon types). All are runtime dependencies, not dev-only.

**Core technologies:**
- React 19.1.1: UI framework — already installed, no changes
- Tailwind CSS 4.1.13: Utility CSS — already installed; requires CSS-first configuration via `@theme` and `@source inline()`, not `tailwind.config.js`
- `motion` ^12.34.3: Animations — card hover scale, stat bar fill, page transitions; import from `motion/react`
- `clsx` + `tailwind-merge`: Class composition — the `cn()` utility pattern allows safe className overrides in component APIs
- `class-variance-authority` ^0.7.1: Variant schemas — enforces consistent structure for 18-type badge and card variants

**Critical version requirement:** `tailwind-merge` must be v3.x, not v2.x. v2 supports Tailwind v3 only; v3 drops TW3 and adds TW4 support explicitly.

### Expected Features

The feature set is divided into a core visual overhaul (v1) and a polish pass (v1.x). The research is explicit: all seven v1 features are required for the redesign to achieve its stated goal. Missing any one of them leaves the app feeling incomplete.

**Must have (table stakes — v1 Core):**
- Dark global background (`bg-zinc-900` or equivalent) — the foundation everything else depends on; type colors only pop on dark surfaces
- Type-colored card backgrounds with official artwork — full `bg-${type}` card background, official artwork sprite (not 96×96 pixel sprite), name, dex number, and type badges
- Pill-shaped type badges (`rounded-full`) — consistent across grid cards, detail page, and move tables; a shared `TypeBadge` component eliminates drift
- Detail page full-type-color theming — entire page background and section containers reflect primary type, not just a sidebar tint
- Polished stat bars — quality-based coloring (6 thresholds: <30 red through 150+ teal per pokemondb.net convention), consistent height, rounded corners; replaces current per-stat flat color approach
- Move table dark styling — dark header, alternating dark/darker row stripes, type badges in cells
- Card hover state — `hover:scale-[1.03] hover:shadow-2xl transition-all` on card containers

**Should have (polish — v1.x):**
- Large dex number watermark on cards (absolute positioned, low opacity, high craft signal at near-zero cost)
- Section header type-accent borders (`border-l-4 border-${type}` on section titles)
- Skeleton loading for grid cards (shimmer placeholder matching card proportions)
- Prev/Next Pokémon navigation on detail page (data already available in `allPokemonData`)
- Type filter active state refinement (replace `ring-black` with `ring-white/70`)

**Defer to v2+:**
- Category icons in move tables (Physical/Special/Status SVGs — no icon assets in project yet)
- Artwork float/bleed effect (layout complexity risk at mobile breakpoints)
- Smooth skeleton-to-content crossfade (per-card `onLoad` state tracking is more complex than it appears)

**Anti-features to explicitly avoid:**
- Pure black (#000000) background (causes halation; use `#111827` or `#18181b`)
- Light/dark theme toggle (PROJECT.md specifies dark-only; toggle would require every type color to work in both contexts)
- Overcrowded card information (grid cards should carry artwork, name, dex number, type badges only)
- Animation-heavy hover effects (rotation, flip, 3D tilt) — performance cost on 1,025-card grid is prohibitive

### Architecture Approach

The architecture uses a three-layer CSS token system. Layer 1 is primitive tokens in `@theme` (type palette, dark surface palette, spacing, typography, radius — all become Tailwind utility classes automatically). Layer 2 is semantic tokens as CSS custom properties on `:root` (`--color-accent` maps to the current page's type color and is overridden at the `PokemonDetails` page wrapper via an inline `style` prop). Layer 3 is component-scoped tokens in `@layer components`. This cascade-based theming approach requires zero React Context and zero re-renders for type color changes — the CSS cascade delivers it.

**Major components:**
1. `index.css` — Design system root: all `@theme` tokens, `@source inline()` registry, `@custom-variant dark` declaration; the single source of truth for all design tokens
2. `components/shared/` — TypeBadge (type pill, used everywhere), PokemonCard (type-colored grid card), SectionCard (dark section wrapper replacing `containerSkeleton`), NavBar, SearchBar
3. `PokemonDetails` — Sets `--color-accent: var(--color-type-${primaryType})` on page wrapper; all descendant components consume the semantic token via CSS cascade
4. `data/typeColors.js` — New file: type name → CSS variable name mapping; single source of truth for JS-side type color lookup
5. `useTypeFilter` (custom hook) — Extract navigation logic from `SearchBar.jsx` before any visual changes; owns `active1`, `active2`, and `navigate` calls

**Key pattern: CSS custom property injection, not React Context.** The type is runtime data from the API; CSS custom properties on a DOM ancestor are the correct mechanism for delivering runtime visual values without JS re-renders.

### Critical Pitfalls

1. **New dynamic class patterns not registered in `@source inline()`** — Every new `ring-${type}`, `text-${type}`, `from-${type}` pattern must be immediately added to `App.css`'s `@source inline()` registry. Dev mode works regardless; production builds silently strip unregistered dynamic classes. Treat the registry as mandatory, not optional. Verify with `vite build && vite preview` after each new pattern.

2. **Hardcoded light colors creating dark theme holes** — The codebase has 20+ `bg-white`, `text-black`, `bg-gray-*` instances in `BasicData.jsx`, `SearchBar.jsx`, `LearnSet.jsx`. `index.css` also sets `background-color: white` on `:root`. These must be audited and replaced with semantic tokens in the foundation phase, before any component restyling begins. Run `grep -rn "bg-white\|text-black\|bg-gray-" src/` as a completion gate for the foundation phase.

3. **Stat bar widths using interpolated arbitrary values (pre-existing production bug)** — `StatGraph.jsx` uses `w-[${computed}%]` which Tailwind's scanner cannot evaluate. This is either already broken in production or coincidentally working via the `w-[{1..100..1}%]` range generator. Replace with `style={{ width: '...%' }}` before redesigning stat bars — fix the foundation, then style it.

4. **SearchBar navigation logic broken by visual restructuring** — The 192-line `SearchBar.jsx` has navigation state tightly coupled to JSX structure. Extract to a `useTypeFilter` custom hook before any visual changes. Verify with manual testing: single type filter, dual type filter, deselect one from dual, clear all, back-navigate from detail.

5. **Dark base not applied to `:root`/`body`** — If only layout containers get dark classes, the viewport area outside `#root` flashes white on load (FOUC), on wide viewports (>1280px), and on iOS overscroll bounce. Set dark background on `html` and `body` in `index.css` in the same commit that establishes the dark base.

## Implications for Roadmap

Based on research, the architecture's build order maps directly to roadmap phases. This ordering is explicit in ARCHITECTURE.md and validated by PITFALLS.md — do not reorder.

### Phase 1: Design Token Foundation

**Rationale:** All subsequent work depends on the token layer being in place. Type-colored components cannot be built without `bg-type-*` classes generated. Dark components cannot be built without dark surface tokens. This phase has zero visual output but prevents all major pitfalls.

**Delivers:** Dark page background everywhere (including `:root` and `body`), full `@theme` token set (18 type colors + dark surface palette + typography + spacing + radius), `@source inline()` registry for all 18 types across bg/text/border/ring patterns, `@custom-variant dark` declaration with `.dark` class on `<html>`, `cn()` utility in `src/lib/cn.js`, stat bar width fix (replace interpolated arbitrary values with inline styles).

**Addresses (from FEATURES.md):** Dark global background (table stakes P1)

**Avoids (from PITFALLS.md):** Pitfall 1 (dynamic class registry), Pitfall 3 (stat bar production bug), Pitfall 5 (FOUC/dark base holes), Pitfall 2 (hardcoded light colors — audit and token-replace in this phase)

**Research flag:** Standard patterns — Tailwind v4 `@theme` and `@source inline()` are fully documented in official docs. No additional research needed.

### Phase 2: Shared Component Library

**Rationale:** The atoms (TypeBadge, SectionCard, PokemonCard) are consumed by both pages. Building them before pages ensures consistency and prevents the type badge drift that currently exists. The SearchBar logic extraction must happen here before visual changes to it.

**Delivers:** `TypeBadge` component (pill-shaped, used on cards + detail + move tables), `SectionCard` component (replaces `containerSkeleton`, uses `--color-accent-muted` for section headers), `PokemonCard` component (extracted from Results.jsx inline JSX, dark surface with type badge and dex number), `NavBar` dark restyle, `useTypeFilter` custom hook extracted from `SearchBar.jsx`, `SearchBar` visual dark restyle (after hook extraction), `src/data/typeColors.js` created.

**Addresses (from FEATURES.md):** Pill-shaped type badges (table stakes P1), Card hover state (P1)

**Avoids (from PITFALLS.md):** Pitfall 4 (SearchBar navigation broken by visual changes — hook extracted first), type badge drift across contexts

**Research flag:** Standard patterns — component extraction and custom hook patterns are well-documented React. No additional research needed.

### Phase 3: List Page (Results)

**Rationale:** The list page is the entry point and the most visible surface. Once shared components exist, wiring them into the Results page is straightforward. This is the first phase with significant visual output.

**Delivers:** Results page using `PokemonCard` component, official artwork on grid cards (not pixel sprite), grid card with name + dex number + type badges, SearchBar fully dark-restyled, grid layout spacing polish.

**Addresses (from FEATURES.md):** Type-colored card backgrounds with official artwork (table stakes P1), Dex number on card (P1), Pokémon name formatting (P1)

**Avoids (from PITFALLS.md):** Card DOM complexity kept low (<5 nodes per card) for 1,025-card grid performance

**Research flag:** Standard patterns. No additional research needed.

### Phase 4: Detail Page

**Rationale:** The detail page is the most complex surface (5 section components, per-type theming, stat visualization, move tables). It depends on all shared components being stable. The CSS custom property injection pattern for per-type theming must be established at the page wrapper level before building any section components.

**Delivers:** `PokemonDetails` sets `--color-accent` on page wrapper, `BasicData` dark-restyled with type accent elements, `StatGraph`/`StatBar` redesigned with quality-based coloring (6 thresholds), `DexEntries` using `SectionCard`, `LearnSet` dark-styled with sticky header and type badge cells in move tables, section headers with `border-l-4 border-type-*` accent.

**Addresses (from FEATURES.md):** Detail page full-type-color theming (P1), Polished stat bars (P1), Move table dark styling (P1), Section header type accent borders (P2)

**Avoids (from PITFALLS.md):** Pitfall 3 (per-type theming inconsistency — `--color-accent` set once at page level, child components consume it, never re-derive from local type prop)

**Research flag:** Needs attention for stat quality-color threshold implementation and detail page layout (sidebar left, content right). Architecture is clear but implementation details may need iteration.

### Phase 5: Polish Pass

**Rationale:** Once the core visual overhaul is stable, add the differentiating details that elevate the app from "competent redesign" to "premium Pokédex." These are all low-complexity additions with high craft signal.

**Delivers:** Large dex number watermark on cards (absolute positioned, 5–15% opacity), skeleton loading for grid cards (shimmer placeholder), Prev/Next Pokémon navigation on detail page (uses existing `allPokemonData`), type filter active state refinement (`ring-white/70` instead of `ring-black`), shiny artwork toggle visual distinction (star/sparkle icon).

**Addresses (from FEATURES.md):** All P2 features — large dex number watermark, skeleton loading, Prev/Next navigation, type filter active state refinement

**Avoids (from PITFALLS.md):** Skeleton loading requires stable card dimensions (must be post-Phase 3 where fixed card height is established)

**Research flag:** Skeleton loading implementation pattern is worth a quick reference check during planning — the shimmer animation approach has known implementation variations.

### Phase Ordering Rationale

- **Token foundation before components:** Without `@theme` tokens and `@source inline()` registry, any component built with type colors will have production build failures. This is not optional.
- **Shared atoms before pages:** TypeBadge and SectionCard appear on both pages. Building them once prevents the class drift that currently exists where multiple inline implementations diverge.
- **SearchBar hook extraction before visual changes:** The navigation state machine in SearchBar is the highest-risk component in the codebase. Separating logic from presentation before touching the JSX is the only safe approach.
- **List page before detail page:** The list page is simpler (no per-type page theming, no 5-section composition) and exercises all shared components. It serves as validation that the shared layer works correctly.
- **Polish after core is stable:** All P2 features depend on stable card dimensions and component APIs. Attempting them earlier creates rework.

### Research Flags

Phases needing deeper research during planning:
- **Phase 4 (Detail Page):** The sidebar-left / content-right layout at different breakpoints, and the exact stat quality threshold color assignments, are worth a focused planning pass. The architecture is clear but the implementation details have enough variation to warrant confirmation.
- **Phase 5 (Polish — Skeleton Loading):** The shimmer animation approach for skeleton loading has multiple valid implementations; the roadmap planning phase should confirm which approach fits this stack (CSS animation vs. motion library).

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Official Tailwind v4 docs cover `@theme`, `@source inline()`, and `@custom-variant dark` exhaustively. No ambiguity.
- **Phase 2 (Shared Components):** React component extraction and custom hook patterns are standard. TypeBadge, SectionCard, and PokemonCard are well-understood component shapes.
- **Phase 3 (List Page):** Wiring `PokemonCard` into Results and restyling the grid is straightforward once shared components exist.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core stack locked; supporting libraries verified via npm registry and official docs; all version compatibility cross-checked |
| Features | HIGH (table stakes) / MEDIUM (differentiators) | Table stakes verified against direct codebase inspection and pokemondb.net/Dribbble reference analysis; differentiator priorities are research-informed but design judgment calls |
| Architecture | HIGH | All recommendations verified against official Tailwind v4 docs; CSS custom property injection for per-type theming is the canonical approach |
| Pitfalls | HIGH | All critical pitfalls verified against official Tailwind v4 docs + GitHub discussions + direct codebase inspection; the `@source inline()` requirement is confirmed in multiple official sources |

**Overall confidence:** HIGH

### Gaps to Address

- **Type colors on grid cards vs. API data availability:** The list API response does not include type data per Pokémon (only name + URL). ARCHITECTURE.md recommends dark-surface cards on the list page (no type color) with type coloring only on the detail page. This is a product decision that should be confirmed with project owner before Phase 3 begins. If type-colored grid cards are required, a different data strategy (pre-loading type data or batch-fetching) would be needed and is out of scope for this overhaul.
- **Type-specific text contrast decisions:** Electric (#F7D02C), Ground (#E2BF65), and Ice (#96D9D6) are bright colors that require dark text on type-colored backgrounds. An audit of all 18 types for foreground text color is needed during Phase 2 when TypeBadge is built. FEATURES.md flags this as a table-stakes requirement but does not provide a complete per-type text color table.
- **React Router import path standardization:** PITFALLS.md flags that the current codebase uses `"react-router/dist/index"` (non-standard path) in some components. This should be audited and standardized before any routing-dependent component refactoring.

## Sources

### Primary (HIGH confidence)
- https://tailwindcss.com/docs/dark-mode — `@custom-variant dark` directive
- https://tailwindcss.com/docs/theme — `@theme` token system, utility class generation
- https://tailwindcss.com/docs/detecting-classes-in-source-files — `@source inline()` for dynamic class generation
- https://tailwindcss.com/blog/tailwindcss-v4-1 — confirms `@source inline()` is a v4.1 feature
- https://tailwindcss.com/blog/tailwindcss-v4 — `@property`, CSS variables, `color-mix()` integration
- https://motion.dev/docs/react-upgrade-guide — `motion` package name and React 19 compatibility
- npm registry — motion@12.34.3, tailwind-merge@3.5.0, clsx@2.1.1, class-variance-authority@0.7.1 (version verification)
- Codebase direct inspection — `App.css`, `BasicData.jsx`, `StatGraph.jsx`, `SearchBar.jsx`, `index.css`, `Results.jsx`

### Secondary (MEDIUM confidence)
- pokemondb.net stat bar color threshold system — quality-based coloring convention (6 thresholds)
- Saepul Nahwan Dribbble Pokédex design — type-color-as-card-background convention
- https://gist.github.com/apaleslimghost/0d25ec801ca4fc43317bcff298af43c3 — Pokémon type hex color values (matches Bulbapedia)
- https://ui.shadcn.com/docs/theming — influential CSS-var-based theming reference pattern
- https://github.com/tailwindlabs/tailwindcss/discussions/15291 — Safelist in v4 community discussion
- https://blakejones.dev/blog/how-to-make-a-safelist-in-tailwind-v4.1+/ — `@source inline()` syntax (matches official docs)

### Tertiary (LOW confidence)
- outsidethebocz.com/pokedex.html — Dark background Pokédex design reference (hover interactions)
- Dark UI halation and contrast principles — design pattern references (multiple sources agree)

---
*Research completed: 2026-02-27*
*Ready for roadmap: yes*
