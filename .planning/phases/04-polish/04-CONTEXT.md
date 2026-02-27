# Phase 4: Polish - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Three craft-detail features that elevate the app to "enthusiast-grade Pokédex" status: a dex number watermark on grid cards, shimmer skeleton loading on the grid, and Prev/Next Pokémon navigation on the detail page. All existing features remain untouched — this phase adds polish only.

</domain>

<decisions>
## Implementation Decisions

### Watermark (POLISH-01)
- Text content: `#NNN` format (hash prefix, zero-padded — matches existing card display language)
- Position: Bottom-right corner, anchored and partially clipped by card edge (jersey number / magazine aesthetic)
- Size: Very large — fills most of the card height, bold design element
- Opacity: Claude's discretion — pick a level that looks good against type-colored backgrounds

### Skeleton loading (POLISH-02)
- Color: Generic neutral (zinc-700/800) — type is unknown at load time, all skeletons look the same
- Count: Fill the viewport — show enough placeholders to cover the visible grid area
- Structure: Structured, not a plain rectangle — include an artwork zone placeholder, a name bar, and small badge bar placeholders that mirror the real card layout
- Animation: Standard left-to-right shimmer sweep (classic shimmer, not pulse)

### Navigation layout (POLISH-03)
- Placement: Both top and bottom of the detail page
- Content: Arrow + adjacent Pokémon's name + type color accent (name and type sourced from static pokemonTypes.js — zero extra API calls)
- Style: Text links with arrow icon — lightweight, not pill buttons or heavy button containers
- List scope: Always full dex order (#N-1 / #N+1), regardless of any active filter or search

### Navigation edge cases (POLISH-03)
- At #001 (no prev) and #1025 (no next): visually dimmed with `opacity-40 pointer-events-none` — control remains in layout (no jump), clearly non-interactive
- Scroll behavior: always scroll to top on Prev/Next navigation
- Name/type data source: static `pokemonTypes.js` lookup already in the codebase — no fetch needed

### Claude's Discretion
- Exact watermark opacity value (pick what looks cleanest on type-colored card backgrounds)
- Shimmer CSS implementation (Tailwind `animate-pulse` variant or custom keyframe — whichever integrates cleanly)
- Exact spacing and sizing of the nav row

</decisions>

<specifics>
## Specific Ideas

- Watermark feels like a jersey number or trading card serial — large, partially clipped, design-forward
- Nav controls should feel lightweight and inline, not like pagination buttons — the focus stays on the Pokémon content

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-polish*
*Context gathered: 2026-02-27*
