# Phase 2: Grid Cards - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Pokémon grid cards that communicate type identity at a glance — type-colored backgrounds, official artwork as the visual centerpiece, readable identity information, and a satisfying hover response. Clicking/navigating to Pokémon detail is a separate phase.

</domain>

<decisions>
## Implementation Decisions

### Type color treatment
- Subtle gradient background: type color → near-black/dark base, top to bottom
- Gradient anchors at top with the type color, fades to near-black at the bottom
- Dual-type Pokémon: primary type only drives the background color (no split/blend)

### Card information layout
- Bottom info strip: name on top line, type badge(s) below it
- Pokédex number (#NNN format) pinned to top-right corner of the card, outside the info strip
- Type badges sit within the bottom strip, below the name

### Artwork presentation
- Artwork contained within card bounds (no overflow past card edge), with padding
- ~65–70% of card vertical space is artwork, ~30–35% is the info strip
- Artwork renders directly against the type gradient (no inner panel or frosted layer)
- object-fit: contain — full Pokémon always visible, no cropping

### Hover behavior
- Card lifts with scale(1.03–1.04) + drop shadow
- Card and artwork transform together as one unit (no independent artwork movement)
- Transition: ~150ms ease-out — snappy, responsive feel
- No additional effects: no brightness boost, no border glow

### Claude's Discretion
- Exact shadow values (spread, blur, opacity, color)
- Specific padding values inside the card and info strip
- Font sizes and weights for name vs. Pokédex number
- Type badge colors and exact pill styling
- Border radius of the card itself

</decisions>

<specifics>
## Specific Ideas

No specific references mentioned — open to standard approaches within the decisions above.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-grid-cards*
*Context gathered: 2026-02-27*
