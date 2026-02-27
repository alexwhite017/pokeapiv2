# Retrospective

## Milestone: v1.0 — UI Overhaul

**Shipped:** 2026-02-27
**Phases:** 4 | **Plans:** 11 | **Commits:** ~49

### What Was Built

- Dark zinc design token system (zinc-900/800/700/600 surface hierarchy, zinc-100/400/500 text scale)
- 18 Pokémon type color CSS custom properties (`--color-{type}`) registered in Tailwind 4 `@theme`
- `PokemonCard` component with type-gradient background, official artwork, pill badges, hover lift
- `pokemonTypes.js` static lookup (1,025 entries) enabling instant type-color rendering without API calls
- Full detail page type immersion: full-page gradient + NavBar tint via `--active-type-color` CSS variable
- `StatGraph` with 6-color quality threshold scale (red → teal) and mount-triggered CSS animation
- Move tables: dark alternating rows, type-accented headers, `rounded-full` pill badges
- `SkeletonCard` component with shimmer animation (zinc-800/700 sweep) replacing "Loading..." text
- Dex number watermark on grid cards (`text-[7rem] text-white/15`, partially clipped by overflow-hidden)
- `PokemonNav` inline component on detail page: Prev/Next with type-color accents, edge case handling

### What Worked

- **Wave-based parallel execution** — Phase 4's 3 plans ran in ~3 min wall time vs ~6 min sequential; parallelization delivered clear speedup for independent plans
- **Static type lookup table** — `pokemonTypes.js` was the right call; eliminated API waterfall for type colors with zero runtime cost
- **CSS custom properties for dynamic values** — using `var(--color-{type})` in inline styles correctly bypassed Tailwind JIT purge; no safelist needed for gradients
- **`@source inline()` registry** — Tailwind 4's explicit class registration for dynamic utility patterns worked reliably once the pattern was established in Phase 1
- **Context files in plans** — `04-CONTEXT.md` with locked decisions meant Phase 4 agents didn't need to re-ask about color choices, count of skeletons, or nav placement

### What Was Inefficient

- **ROADMAP.md stale plan checkboxes** — The archived roadmap had unchecked boxes for Phase 2/3 plans (CLI copied state before plans were marked complete). Required manual fix during milestone completion.
- **MILESTONES.md accomplishments empty** — CLI's `summary-extract` found no `one_liner` field in SUMMARY files (SUMMARY format uses `provides:` not `one_liner:`). Accomplishments had to be written manually.
- **No audit before completion** — Skipped `audit-milestone`; no cross-phase integration check. Acceptable for a single-session project but worth running on longer milestones.

### Patterns Established

- **Always-dark approach**: No `dark:` class variants anywhere. The app is unconditionally dark — simpler, no media query complexity.
- **Inline styles for runtime-computed values**: Any Tailwind class built from runtime data (widths, dynamic colors) uses `style={{}}` with CSS custom properties instead of template literal class strings.
- **Design token before components**: Establishing the full `@theme` token layer in Phase 1 before touching any component was the right build order — no backtracking.
- **Watermark DOM order over z-index**: Placing decorative absolutely-positioned elements *before* normal-flow content in DOM order means they're painted underneath without z-index management.

### Key Lessons

- **`@source inline()` is required for Tailwind 4 dynamic classes** — Without it, `bg-fire`, `text-water`, etc. are purged from the production build. Add these registrations in Phase 1 of any Tailwind 4 project.
- **Plan the static data layer early** — `pokemonTypes.js` unlocked all subsequent type-color work. Establishing static lookup tables early avoids re-architecting later.
- **CSS custom properties on `:root` scale well** — Signaling cross-component state (active type color) via a CSS variable avoids React context setup and prop drilling for visual-only data.

### Cost Observations

- Model mix: 100% sonnet (balanced profile)
- Sessions: 1 session (all 4 phases in one context window reset per phase)
- Notable: 4 phases × ~27 min each = ~104 min total; parallel execution in wave-based plans saved ~30-40% on multi-plan phases

---

## Cross-Milestone Trends

| Metric | v1.0 |
|--------|------|
| Phases | 4 |
| Plans | 11 |
| Execution time | ~104 min |
| Files changed | 37 |
| LOC (src) | 2,782 |
| Verification score | 13/13 (100%) |
| Gaps found | 0 |
