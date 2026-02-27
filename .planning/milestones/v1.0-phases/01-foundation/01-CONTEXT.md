# Phase 1: Foundation - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the dark global theme, design tokens, and fix pre-existing production build bugs. This phase is infrastructure — no new visible features beyond the dark background itself. Every subsequent phase depends on these tokens being in place. Scope is: dark base, type color token definitions, `@source inline()` registry, stat bar width fix.

</domain>

<decisions>
## Implementation Decisions

### Type Color Palette
- Use Bulbapedia canonical hex values for all 18 Pokémon types (community-accepted, recognized by fans)
- Keep existing token naming pattern: `bg-fire`, `bg-water`, `bg-grass`, etc. — no refactoring needed
- Secondary type color variants (used as `bg-${type}-secondary`) derived automatically via `color-mix(in srgb, var(--color-{type}), black 40%)` — no manual secondary values needed
- Text contrast is decided per type manually: light types (Electric, Ice, Fairy, Normal, Flying) use dark text; dark types (Ghost, Dragon, Dark, Poison, etc.) use white text

### Claude's Discretion
- Exact dark background shade (`bg-zinc-900` vs `bg-gray-900` vs another) — pick whichever reads best with the type color palette
- Text color hierarchy (primary, secondary, muted) — standard off-white scale on dark
- Surface elevation levels (how many dark surface tiers for cards, sidebars, containers)
- Exact `@source inline()` brace expansion syntax for all needed class prefixes

</decisions>

<specifics>
## Specific Ideas

- The existing codebase already has `@source inline()` directives in `App.css` for `bg-`, `bg-*-secondary`, `border-border-*`, and `border-*` patterns — extend these rather than replacing them
- The stat bar width bug (`w-[${computed}%]` with runtime interpolation) should be replaced with `style={{ width: '${value}%' }}` inline style

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-02-27*
