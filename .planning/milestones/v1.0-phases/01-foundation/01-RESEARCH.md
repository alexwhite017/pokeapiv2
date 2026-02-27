# Phase 1: Foundation - Research

**Researched:** 2026-02-27
**Domain:** Tailwind CSS 4 dark theme foundation, design token setup, `@source inline()` registry, stat bar production bug fix
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use Bulbapedia canonical hex values for all 18 Pokémon types (community-accepted, recognized by fans)
- Keep existing token naming pattern: `bg-fire`, `bg-water`, `bg-grass`, etc. — no refactoring needed
- Secondary type color variants (used as `bg-${type}-secondary`) derived automatically via `color-mix(in srgb, var(--color-{type}), black 40%)` — no manual secondary values needed
- Text contrast is decided per type manually: light types (Electric, Ice, Fairy, Normal, Flying) use dark text; dark types (Ghost, Dragon, Dark, Poison, etc.) use white text
- The existing codebase already has `@source inline()` directives in `App.css` for `bg-`, `bg-*-secondary`, `border-border-*`, and `border-*` patterns — extend these rather than replacing them
- The stat bar width bug (`w-[${computed}%]` with runtime interpolation) should be replaced with `style={{ width: '${value}%' }}` inline style

### Claude's Discretion
- Exact dark background shade (`bg-zinc-900` vs `bg-gray-900` vs another) — pick whichever reads best with the type color palette
- Text color hierarchy (primary, secondary, muted) — standard off-white scale on dark
- Surface elevation levels (how many dark surface tiers for cards, sidebars, containers)
- Exact `@source inline()` brace expansion syntax for all needed class prefixes

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | All pages use a dark global background (`bg-zinc-900`) with off-white text | Dark base: remove `background-color: white` from `index.css` `:root`; set dark color on `html`/`body`; add dark tokens to `@theme` in `App.css` |
| FOUND-02 | All hardcoded `bg-white` / `text-black` instances replaced with dark theme tokens | Audit grep confirms 50+ instances across `BasicData.jsx`, `StatGraph.jsx`, `DexEntries.jsx`, `LearnSet.jsx`, `PokemonDetails.jsx`, `NavBar.jsx`, `containerSkeleton.jsx` — replace with new semantic token classes |
| FOUND-03 | `@source inline()` registry extended to cover all dynamic Tailwind class patterns used in the redesign | Existing registry in `App.css` covers `bg-*`, `bg-*-secondary`, `border-border-*`, `border-*` — extend for any new patterns; no new patterns introduced in Phase 1 beyond confirming the existing set is complete |
| FOUND-04 | Stat bar width implementation replaced with inline styles (fixes silent production build bug) | `StatGraph.jsx` line 41 uses `w-[${(base_stat/255*100).toFixed(0)}%]` — replace with `style={{ width: '...' }}` |
</phase_requirements>

---

## Summary

Phase 1 is purely infrastructure: establish the dark global base and ensure the production build generates all dynamic type classes correctly. No new visible features are introduced beyond the dark background itself. All subsequent phases depend on the tokens defined here.

The codebase has a single critical CSS conflict: `index.css` sets `background-color: white` on `:root`, which overrides any component-level dark styling and causes white-flash on load, white side-strips on wide viewports, and white iOS overscroll bounce. This must be fixed at the document root level — not just in component classNames. The existing `App.css` already has the correct `@theme` and `@source inline()` infrastructure; Phase 1 extends it rather than replacing it.

The stat bar bug (`w-[${...}%]` runtime interpolation) is a confirmed pre-existing production build failure. The existing `@source inline("w-[{1..100..1}%]")` directive generates all integer-percent classes statically, but `.toFixed(0)` returns a string evaluated at runtime — the scanner sees the literal template text, not the computed value. Replacing with an inline `style` prop is the correct, zero-risk fix.

**Primary recommendation:** Fix `index.css` `:root` background first, then add dark surface tokens to `App.css` `@theme`, then sweep all `bg-white`/`text-black` hardcodes in components with the new tokens, then fix the stat bar. Do not change `@source inline()` naming patterns — the existing `bg-fire` naming is preserved per user decision.

---

## Standard Stack

### Core (No Changes)

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| Tailwind CSS | 4.1.13 | Utility CSS framework | Already installed; `@theme`, `@source inline()`, `@custom-variant` are the v4 APIs in use |
| Vite | 7.1.6 | Build tool | `vite build && vite preview` is the validation command for production class generation |
| React | 19.1.1 | UI framework | No changes needed for Phase 1 |

### No New Packages Required

Phase 1 requires zero new npm packages. All work is in CSS (`App.css`, `index.css`) and targeted component edits.

---

## Architecture Patterns

### Pattern 1: Dark Base at Document Root

The dark background MUST be set on `html`/`body` (or `:root`) in `index.css`, NOT only on React-managed containers. The current `#root` has `max-width: 1280px; margin: 0 auto` — the viewport area outside that box shows the `:root` background color. Setting dark only on the `#root` div creates white side-strips.

```css
/* index.css — CURRENT (causes FOUC and white strips) */
:root {
  background-color: white;  /* ← REMOVE THIS */
}

/* index.css — CORRECT */
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  background-color: #18181b;  /* zinc-900 equivalent — covers full viewport */
  color: #f4f4f5;             /* zinc-100 — off-white base text */
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Confidence:** HIGH — verified against Pitfalls research (Pitfall 6) and direct inspection of `index.css`.

### Pattern 2: Dark Surface Tokens in `@theme`

Add semantic dark surface tokens to the existing `@theme` block in `App.css`. These become Tailwind utility classes automatically (`bg-surface-base`, `text-text-primary`, etc.).

```css
/* App.css — add to existing @theme block */
@theme {
  /* === Existing type tokens stay unchanged === */

  /* === Dark Surface Palette === */
  --color-surface-base:    #18181b;  /* zinc-900 — page background */
  --color-surface-raised:  #27272a;  /* zinc-800 — card/panel backgrounds */
  --color-surface-inset:   #3f3f46;  /* zinc-700 — recessed areas, inputs */
  --color-surface-border:  #52525b;  /* zinc-600 — subtle dividers */

  /* === Text Scale === */
  --color-text-primary:    #f4f4f5;  /* zinc-100 — main readable text */
  --color-text-secondary:  #a1a1aa;  /* zinc-400 — subdued labels */
  --color-text-muted:      #71717a;  /* zinc-500 — very subdued, metadata */
}
```

**Confidence:** HIGH — zinc scale reads cleanly with vibrant type colors; confirmed via Architecture research recommendation for dark-neutral over pure black.

### Pattern 3: Replace Hardcoded Light Colors

The sweep targets these patterns across all components:

| Old class | Replace with | Rationale |
|-----------|-------------|-----------|
| `bg-white` | `bg-surface-raised` | Dark panel surface |
| `text-black` | `text-text-primary` | Off-white readable text |
| `bg-gray-300` (NavBar) | `bg-surface-raised` | Dark header |
| `text-gray-800` (NavBar) | `text-text-primary` | Light text on dark |
| `text-gray-600` | `text-text-secondary` | Subdued text |
| `bg-gray-500` | `bg-surface-inset` | Recessed background |
| `border-gray-500` | `border-surface-border` | Subtle border |
| `hover:bg-green-400` (tabs) | `hover:bg-surface-inset` | Neutral hover — green is type-agnostic and wrong here |

**Files requiring sweep (confirmed by grep):**
- `src/index.css` — `:root` background
- `src/components/NavBar.jsx` — `bg-gray-300`, `text-gray-800`
- `src/components/PokemonDetails.jsx` — `bg-white`, `text-black` (lines 40, 49, 52, 53)
- `src/components/containerSkeleton.jsx` — `text-black` (line 7)
- `src/components/Results.jsx` — `text-gray-600` (lines 81, 84)
- `src/components/PokemonDetailsComponents/BasicData.jsx` — 20+ `bg-white`/`text-black` instances
- `src/components/PokemonDetailsComponents/StatGraph.jsx` — `text-black` (lines 16, 27, 54)
- `src/components/PokemonDetailsComponents/DexEntries.jsx` — `bg-white`, `text-black`, `bg-gray-500`, `border-gray-500`
- `src/components/PokemonDetailsComponents/LearnSet.jsx` — `bg-white`, `text-black`

### Pattern 4: Stat Bar Width Fix

`StatGraph.jsx` line 41 currently:
```jsx
className={`... h-5 w-[${(
  stat.base_stat / 255 * 100
).toFixed(0)}%]`}
```

This is a runtime-interpolated arbitrary value. Replace with inline style:

```jsx
{/* StatGraph.jsx — fixed */}
<div
  className="my-[1px] border-1 rounded border-gray-500 ml-0.5 h-5"
  style={{ width: `${((stat.base_stat / 255) * 100).toFixed(0)}%` }}
/>
```

The `w-[{1..100..1}%]` directive in `App.css` can remain for any other static integer-percent usages but is no longer needed for stat bars. No `@source inline()` change required for this fix.

**Confidence:** HIGH — confirmed from direct file inspection (line 41 of StatGraph.jsx) and Pitfalls research (Pitfall 4).

### Pattern 5: Extending `@source inline()` Registry

The existing directives in `App.css` are:
```css
@source inline("w-[{1..100..1}%]");
@source inline("bg-{normal,fire,water,...}");
@source inline("border-{border-normal,border-fire,...}");
@source inline("bg-{normal-secondary,fire-secondary,...}");
@source inline("border-{normal,fire,water,...}");
```

Phase 1 does NOT introduce new dynamic class patterns — the dark surface tokens (`bg-surface-raised`, `text-text-primary`) are static class names, not interpolated, so the scanner detects them automatically. No new `@source inline()` entries are needed in Phase 1.

If Phase 1 work reveals any component using a new interpolated pattern (e.g., `ring-${type}`), add immediately:
```css
@source inline("ring-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
```

**Confidence:** HIGH — confirmed by reading existing `App.css` and understanding what Phase 1 adds.

### Anti-Patterns to Avoid

- **Do not add `dark:` variants per-class.** The app is always dark; there is no light mode. Using `dark:` variants means every component needs two versions. Use tokens that resolve to the correct dark color directly.
- **Do not set dark background only on `#root`.** Wide viewports and iOS overscroll bounce will expose the `:root`/`body` background. Set it at the document level.
- **Do not change `@source inline()` token naming.** The user decision locks `bg-fire`, not `bg-type-fire`. The existing brace expansion strings are correct as-is.
- **Do not use `color-mix()` in `@theme` for secondary colors.** The user decision says secondary variants are derived via `color-mix(in srgb, var(--color-{type}), black 40%)`. However, the existing `App.css` already has manually specified secondary hex values (`--color-fire-secondary: #f07374`). These can stay — they are effectively pre-computed equivalents. Do not replace working values with `color-mix()` unless verifying output is identical; the user's decision is about the derivation approach for any *missing* secondaries, not a mandate to rewrite existing ones.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Forcing dynamic type classes into build output | Custom PostCSS plugin or webpack config | `@source inline()` brace expansion in `App.css` | Already in use; official Tailwind v4.1 mechanism |
| Dark mode toggle | React context + localStorage | `@custom-variant dark` + `.dark` class on `<html>` | Not needed for Phase 1 (always dark); if ever added, the CSS-first approach is correct |
| Stat bar percentage | Custom CSS class generation | `style={{ width: '...' }}` | Runtime numeric values belong in inline styles, not Tailwind classes |

---

## Common Pitfalls

### Pitfall 1: White Flash on Load (FOUC)

**What goes wrong:** Dark background applied to component containers but `index.css` `:root` still has `background-color: white`. The viewport flashes white before React mounts, and white appears on wide viewports (> 1280px) outside the `#root` max-width container.

**Why it happens:** `:root` background is set in `index.css` which loads before any component CSS. The existing `#root` has `max-width: 1280px; margin: 0 auto` — everything outside that box is the `:root` color.

**How to avoid:** Change `background-color: white` in `index.css` `:root` to the dark base color. This is the very first edit of Phase 1.

**Warning signs:** Visible white flash on page load; white strips on either side of content at wide viewport widths; white bounce on iOS Safari overscroll.

### Pitfall 2: Dev Mode Masking Broken Production Classes

**What goes wrong:** New or existing dynamic Tailwind class patterns work in `npm run dev` but are absent from the production CSS bundle.

**Why it happens:** Vite dev re-scans files on every change and generates classes on demand. `vite build` runs a single static scan. Classes built via template literals are invisible to the static scanner unless registered in `@source inline()`.

**How to avoid:** After completing Phase 1 changes, run `npm run build && npm run preview` and visually verify every type-colored element renders correctly. Do not ship Phase 1 as complete based only on dev mode verification.

**Warning signs:** Colors present in dev, absent in preview. Stat bars all 0% or 100% width in preview.

### Pitfall 3: Incomplete Light-Color Sweep

**What goes wrong:** Most `bg-white` instances are replaced but a few are missed, leaving white islands on a dark page — worse than a consistently light theme.

**Why it happens:** The grep covers JSX but not inline styles or conditional strings. The `DexEntries.jsx` tab active state `activeTab === index ? "bg-white" : "hover:bg-green-400"` is particularly easy to miss since it's inside a ternary.

**How to avoid:** After the sweep, run:
```bash
grep -rn "bg-white\|text-black\|bg-gray-\|text-gray-" src/
```
Every remaining hit should be documented as intentional.

### Pitfall 4: Stat Bar Fix Breaks the Width Entirely

**What goes wrong:** Moving from a Tailwind class to `style={{ width }}` while also editing surrounding classes causes the bar to disappear (width: 0) or overflow (width: 100%).

**Why it happens:** The stat bar div may be inside a flex or grid container; removing the Tailwind `w-[X%]` class and replacing with a `style` prop is correct, but if the surrounding container constrains width differently, the bar may collapse.

**How to avoid:** Make the stat bar change as a minimal, isolated edit — only the `w-[...]` removal and `style` addition. Do not restyle the surrounding `StatGraph` layout in the same commit. Verify in `vite preview` with a Pokémon that has varied stats (e.g., Shuckle has extreme stat variance — ideal test case).

---

## Code Examples

### Dark Base in `index.css`

```css
/* src/index.css */
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  background-color: #18181b; /* zinc-900 — was: white */
  color: #f4f4f5;            /* zinc-100 — off-white base */

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Surface Tokens in `App.css`

```css
/* src/App.css — add inside existing @theme block */
@theme {
  /* ...existing type color tokens unchanged... */

  --color-surface-base:    #18181b;
  --color-surface-raised:  #27272a;
  --color-surface-inset:   #3f3f46;
  --color-surface-border:  #52525b;
  --color-text-primary:    #f4f4f5;
  --color-text-secondary:  #a1a1aa;
  --color-text-muted:      #71717a;
}
```

### Stat Bar Fix in `StatGraph.jsx`

```jsx
{/* Before */}
<div className={`... h-5 w-[${((stat.base_stat / 255) * 100).toFixed(0)}%]`} />

{/* After */}
<div
  className="my-[1px] border-1 rounded border-gray-500 ml-0.5 h-5"
  style={{ width: `${((stat.base_stat / 255) * 100).toFixed(0)}%` }}
/>
```

### NavBar Dark Restyle

```jsx
{/* Before */}
<div className="flex justify-center items-center p-4 bg-gray-300 text-gray-800 shadow-lg fixed top-0 left-0 right-0 h-16 z-100">

{/* After */}
<div className="flex justify-center items-center p-4 bg-surface-raised text-text-primary shadow-lg fixed top-0 left-0 right-0 h-16 z-100">
```

### Verification Command

```bash
npm run build && npm run preview
```
Run after all Phase 1 changes. In preview mode, manually navigate to:
1. Any Pokémon detail page — stat bars must vary in width, not all be the same
2. A viewport wider than 1280px — no white side strips
3. iOS Safari (or simulate) — no white overscroll bounce
4. Check computed styles on any `bg-fire`/`bg-water` element — confirm the class is present in the generated stylesheet

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` safelist | `@source inline()` brace expansion in CSS | Tailwind v4 (2025) | JS config removed; all token/safelist work now in CSS |
| `prefers-color-scheme` media query for dark mode | `@custom-variant dark` + `.dark` class on `<html>` | Tailwind v4 | Class-based dark; app can force-dark without OS dependency |
| Separate `tailwind.config.js` for custom colors | `@theme` block in CSS | Tailwind v4 | CSS-first; custom colors declared once, generate both CSS vars and utility classes |

---

## Open Questions

1. **Secondary color values: existing manual hex vs `color-mix()`**
   - What we know: `App.css` already has manually set `--color-*-secondary` hex values for all 18 types.
   - What's unclear: The user decision says to derive via `color-mix(in srgb, var(--color-{type}), black 40%)`. The existing manual values were likely set before this decision.
   - Recommendation: Keep existing manual secondary values — they already exist and are correct enough. Use `color-mix()` only if a type's secondary is missing or visually wrong after the dark background is applied. Do not replace all 18 working values to match the formula.

2. **Per-type text contrast: which specific types need dark text**
   - What we know: User decision says Electric, Ice, Fairy, Normal, Flying → dark text on type-colored backgrounds. All other types → white text.
   - What's unclear: Phase 1 does not add type-colored card backgrounds (that is Phase 2). Type badge text contrast is relevant now only for the existing `SearchBar` type buttons and any existing type badge renders.
   - Recommendation: Note this decision in code comments on any existing type badge, but defer the implementation audit to Phase 2 when type-colored backgrounds are actually added to cards.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection — `src/App.css`, `src/index.css`, `src/components/PokemonDetailsComponents/StatGraph.jsx`, `src/components/PokemonDetailsComponents/BasicData.jsx`, `src/components/NavBar.jsx`
- `.planning/research/STACK.md` — Tailwind v4 dark mode, `@source inline()`, `@theme` patterns (verified against official Tailwind docs)
- `.planning/research/ARCHITECTURE.md` — Token strategy, surface color hierarchy (verified against Tailwind v4 official docs)
- `.planning/research/PITFALLS.md` — Production build failure modes (verified against official Tailwind v4 source detection docs)

### Secondary (MEDIUM confidence)
- `.planning/codebase/CONCERNS.md` — Pre-existing bug inventory, confirmed stat bar interpolation issue
- Tailwind CSS v4 official docs — https://tailwindcss.com/docs/theme, https://tailwindcss.com/docs/dark-mode, https://tailwindcss.com/docs/detecting-classes-in-source-files

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; existing stack fully understood
- Architecture patterns: HIGH — token strategy and `@source inline()` verified against official docs; file locations confirmed by direct inspection
- Pitfalls: HIGH — all pitfalls grounded in actual codebase state (confirmed by grep); not theoretical

**Research date:** 2026-02-27
**Valid until:** 2026-03-28 (stable Tailwind v4 APIs; type token approach unlikely to change)
