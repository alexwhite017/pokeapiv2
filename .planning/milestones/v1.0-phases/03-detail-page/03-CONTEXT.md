# Phase 3: Detail Page - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Apply type-color theming, polished stat bars, and dark move tables throughout the existing detail page. No new sections or data sources — this is a visual overhaul of what's already there.

</domain>

<decisions>
## Implementation Decisions

### Page-level type immersion
- Full-page type gradient: `linear-gradient(to bottom, var(--color-{primaryType}), #18181b)` applied on the page root (html/body or App root) — bleeds edge to edge, full viewport width
- Gradient starts above the NavBar — NavBar picks up the type color too (type-tinted background reflecting the active Pokémon's type)
- Right-side sections (Stats, LearnSet, DexEntries) use semi-transparent panels (`bg-black/40` or similar) so the type gradient shows through behind all content

### Stat bar animation
- Bars animate in on mount: width transitions from `0%` → `{value}%` with ~300ms ease-out
- Bar track (empty portion): `bg-black/20` or similar semi-transparent dark — gradient is visible behind the track
- Bar height and row spacing: Claude's discretion — pick whatever looks best with the new color scheme and transparent track

### Move table columns
- Keep all columns: level/TM number, name, type, power, accuracy, PP
- Two separate tables remain (Level-up moves and TM/Machine moves) — each with their own type-accented header panel
- Table header: `bg-{type}-secondary` — matches the StatGraph panel pattern already established in the codebase
- Data rows: dark (consistent with dark row requirement in DETAIL-04)

### Type badge consistency
- Harmonize to `rounded-full` pill badges across all badge appearances on the detail page: type badges in BasicData, and type cells in move tables
- Text only — no icons or additional content in badges

### Claude's Discretion
- Stat bar height and row padding (adequate spacing per DETAIL-03, but exact dimensions are Claude's call)
- NavBar implementation detail for type-tinting (CSS variable on root, prop drilling, or context — whichever is simplest)

</decisions>

<specifics>
## Specific Ideas

- Pattern reference: gradient from type color to near-black mirrors exactly what Phase 2 did for card backgrounds — extend that same approach to the full page
- The `StatGraph` component's existing structure (outer `bg-{type}` shell, `bg-{type}-secondary` interior sections) is the established panel pattern — move tables should match it

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-detail-page*
*Context gathered: 2026-02-27*
