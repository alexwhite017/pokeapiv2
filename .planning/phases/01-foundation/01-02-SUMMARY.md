---
phase: 01-foundation
plan: "02"
subsystem: ui
tags: [react, tailwind, dark-theme, design-tokens]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Dark surface/text design tokens (bg-surface-raised, bg-surface-inset, text-text-primary, text-text-secondary, border-surface-border)
provides:
  - All components swept of hardcoded light-mode colors (bg-white, text-black, bg-gray-300, etc.)
  - StatGraph stat bars using inline style width for production build safety
affects: [Phase 2 components, any future component work building on these files]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline style for dynamic width values that Tailwind cannot statically analyze"
    - "Semantic token usage over raw Tailwind palette classes throughout all components"

key-files:
  created: []
  modified:
    - src/components/NavBar.jsx
    - src/components/PokemonDetails.jsx
    - src/components/containerSkeleton.jsx
    - src/components/Results.jsx
    - src/components/PokemonDetailsComponents/BasicData.jsx
    - src/components/PokemonDetailsComponents/DexEntries.jsx
    - src/components/PokemonDetailsComponents/LearnSet.jsx
    - src/components/PokemonDetailsComponents/StatGraph.jsx

key-decisions:
  - "SearchBar.jsx out of scope — not listed in plan files, its hardcoded colors deferred to future plan"
  - "Static w-[35%] values in StatGraph are safe — only dynamic template-literal w-[${...}%] needed style prop replacement"

patterns-established:
  - "Pattern: Use style={{ width: '...' }} for any runtime-computed CSS width values rather than Tailwind JIT template literals"
  - "Pattern: All surface/text colors must use semantic tokens — never bg-white, text-black, or gray palette directly"

requirements-completed: [FOUND-02, FOUND-04]

# Metrics
duration: 6min
completed: 2026-02-27
---

# Phase 1 Plan 02: Component Dark Sweep & Stat Bar Fix Summary

**All 8 components swept of hardcoded light colors using dark surface tokens, and StatGraph stat bar fixed to use inline style width for production build correctness**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-02-27T18:02:43Z
- **Completed:** 2026-02-27T18:08:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Replaced all `bg-white`, `text-black`, `bg-gray-300`, `bg-gray-500`, `text-gray-800`, `text-gray-600`, and `hover:bg-green-400` across 7 targeted components with semantic dark tokens
- Fixed silent production build bug in `StatGraph.jsx` where `w-[${((stat.base_stat / 255) * 100).toFixed(0)}%]` runtime template interpolation caused Tailwind to strip the class — replaced with `style={{ width: '...' }}`
- Production build succeeds (`npm run build`) and no white surface islands remain in the 8 targeted files

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace hardcoded light colors in all components** - `075b38d` (feat)
2. **Task 2: Fix stat bar production build bug in StatGraph.jsx** - `9beb1d8` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/components/NavBar.jsx` - bg-gray-300 + text-gray-800 replaced with surface/text tokens
- `src/components/PokemonDetails.jsx` - bg-white + text-black replaced in wrapper, evolutions panel, and paragraph (3 locations)
- `src/components/containerSkeleton.jsx` - text-black replaced with text-text-primary in title h2
- `src/components/Results.jsx` - text-gray-600 replaced with text-text-secondary (2 locations)
- `src/components/PokemonDetailsComponents/BasicData.jsx` - 20+ instances of bg-white, text-black, hover:bg-green-400 replaced
- `src/components/PokemonDetailsComponents/DexEntries.jsx` - bg-white, bg-gray-500, border-gray-500, hover:bg-green-400 all replaced including ternary tab states
- `src/components/PokemonDetailsComponents/LearnSet.jsx` - bg-white + text-black replaced across both machine and level-up table sections
- `src/components/PokemonDetailsComponents/StatGraph.jsx` - text-black replaced; stat bar converted from dynamic Tailwind class to inline style width; border-gray-500 replaced with border-surface-border

## Decisions Made

- `SearchBar.jsx` was not in the plan's target file list, so its remaining hardcoded colors (`bg-white`, `text-black`) are intentionally out of scope and deferred — not a deviation, just plan scope boundary
- Static `w-[35%]` values in StatGraph were left untouched — only the runtime-interpolated `w-[${...}%]` was the bug; static values are safe with Tailwind

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `SearchBar.jsx` appeared in grep output post-task-1 — confirmed it was correctly out of scope (not listed in task files). Logged to deferred items for a future plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 8 targeted components are dark-theme correct with semantic tokens
- `StatGraph.jsx` stat bar width now works correctly in production builds
- `SearchBar.jsx` still has hardcoded light colors — needs its own sweep in a future plan
- Ready to proceed to Phase 1 Plan 03 or Phase 2 component work

---
*Phase: 01-foundation*
*Completed: 2026-02-27*

## Self-Check: PASSED

- All 8 modified component files confirmed present on disk
- SUMMARY.md confirmed present at .planning/phases/01-foundation/01-02-SUMMARY.md
- Both task commits confirmed in git log: 075b38d (Task 1), 9beb1d8 (Task 2)
