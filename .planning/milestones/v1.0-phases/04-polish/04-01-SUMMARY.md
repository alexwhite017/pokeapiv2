---
phase: 04-polish
plan: "01"
subsystem: ui
tags: [react, tailwind, pokemon-card, watermark, design]

# Dependency graph
requires:
  - phase: 02-grid-cards
    provides: PokemonCard component with type gradient and artwork layout
provides:
  - PokemonCard with large dex number watermark in bottom-right corner
affects: [04-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [absolute-positioned decorative watermark using translate-x/y for partial clip]

key-files:
  created: []
  modified: [src/components/PokemonCard.jsx]

key-decisions:
  - "Watermark placed before artwork div in DOM order so artwork/info strip render on top without needing z-index"
  - "text-white/15 opacity chosen as correct balance — visible as design element against all type colors without competing with artwork"
  - "translate-x-1/4 translate-y-1/4 clips roughly bottom-right quarter at the overflow-hidden card edge for jersey-number aesthetic"

patterns-established:
  - "Decorative watermark pattern: absolute bottom-0 right-0 + translate offsets + text-white/15 + aria-hidden + pointer-events-none"

requirements-completed: [POLISH-01]

# Metrics
duration: 2min
completed: 2026-02-27
---

# Phase 4 Plan 01: Dex Number Watermark Summary

**Large semi-transparent #NNN watermark anchored bottom-right of each grid card, partially clipped for a jersey-number / trading-card aesthetic at text-white/15 opacity**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-27T19:43:04Z
- **Completed:** 2026-02-27T19:45:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Added large dex number watermark to PokemonCard — jersey-number aesthetic with partial clip at card edge
- Watermark uses text-[7rem] font-black, anchored bottom-right with translate-x-1/4 translate-y-1/4 for natural overflow-hidden clipping
- Artwork and info strip remain fully legible — watermark placed before artwork in DOM order so it sits below in stacking context
- Existing small top-right dex label (#NNN at text-xs/text-white/70) unchanged
- Build passes cleanly (59 modules, 0 errors)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add watermark to PokemonCard.jsx** - `4eb7f28` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified
- `src/components/PokemonCard.jsx` - Added watermark span between top-right dex label and artwork div

## Decisions Made
- Watermark placed before artwork div in DOM order (not after info strip) so normal-flow artwork/info strip elements paint on top of the absolutely positioned watermark — no z-index changes needed
- text-white/15 opacity is correct balance: visible as a design element against all 18 type gradient backgrounds while not competing with artwork
- translate-x-1/4 translate-y-1/4 clips roughly the bottom-right quarter of the large text at the overflow-hidden card boundary

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- POLISH-01 complete — grid cards now have the jersey-number watermark aesthetic
- Ready for 04-02 (next polish plan)
- No blockers or concerns

## Self-Check: PASSED

- FOUND: src/components/PokemonCard.jsx
- FOUND: .planning/phases/04-polish/04-01-SUMMARY.md
- FOUND commit: 4eb7f28 (feat: watermark)
- FOUND commit: 9f70338 (docs: plan metadata)

---
*Phase: 04-polish*
*Completed: 2026-02-27*
