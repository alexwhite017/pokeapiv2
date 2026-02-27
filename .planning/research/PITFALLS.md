# Pitfalls Research

**Domain:** React + Tailwind CSS 4 UI overhaul with dynamic type theming (PokeAPI browser)
**Researched:** 2026-02-27
**Confidence:** HIGH — pitfalls verified against official Tailwind v4 docs, GitHub discussions, and direct codebase inspection

---

## Critical Pitfalls

### Pitfall 1: Expanding Dynamic Class Patterns Without Updating @source inline()

**What goes wrong:**
New CSS classes are added during the overhaul using the same `bg-${type}` / `border-border-${type}` / `bg-${type}-secondary` interpolation pattern. The classes appear correct in JSX and work in `vite dev` (because Vite rebuilds on change), but after `vite build` the new classes are stripped from the output CSS. The page looks fine locally but broken in production.

**Why it happens:**
Tailwind v4 scans source files as plain text at build time. It cannot execute JavaScript string interpolation. The current `App.css` already has four `@source inline()` directives that enumerate all 18 types explicitly for the existing class patterns. When the overhaul introduces new class shapes — for example `ring-${type}`, `text-${type}`, `shadow-${type}`, `from-${type}`, `to-${type}`, or any gradient/shadow/outline variant — those new patterns are invisible to the scanner unless a matching `@source inline()` directive is added. `vite dev` works by re-scanning on each file change, which can mask the absence of a safelist entry until a production build is run.

**How to avoid:**
Every time a new dynamic class pattern is introduced for type-based theming, immediately add a corresponding `@source inline()` line in `App.css`. Follow the exact brace-expansion format already used:
```css
@source inline("ring-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
```
Treat `App.css`'s `@source inline()` block as a registry — a new pattern in JSX always means a new entry here. Never rely on dev-mode working as proof the class will survive a production build.

**Warning signs:**
- A new dynamic class works in `npm run dev` but is absent from computed styles in `npm run build && npm run preview`
- Running `grep -r "bg-\${" src/` finds patterns not covered by a corresponding `@source inline()` in `App.css`
- The stat bars in `StatGraph.jsx` use `w-[${...}%]` — arbitrary values with interpolation. These are **not** covered by any `@source inline()` and will be purged in production. This is a pre-existing unaddressed issue.

**Phase to address:**
Foundation / theming setup phase — establish the `@source inline()` registry before adding any new dynamic classes. Fix the existing `w-[${...}%]` stat bar issue in the same pass.

---

### Pitfall 2: Hardcoded Light Colors Creating Dark Theme Holes

**What goes wrong:**
The overhaul applies a dark global background but scattered components remain visibly light because they use hardcoded Tailwind color classes (`bg-white`, `text-black`, `bg-gray-200`, `border-gray-400`) rather than semantic or dark-aware tokens. The result is jarring islands of white/gray on a dark page — a worse experience than a consistently light theme.

**Why it happens:**
The current codebase is built on a white-background assumption baked into `index.css` (`background-color: white`) and repeated throughout components. `SearchBar.jsx` alone contains: `bg-white`, `bg-gray-200`, `bg-gray-400` hardcoded in multiple places. `BasicData.jsx` has more than a dozen `bg-white` and `text-black` instances for data panels. Dark mode is typically applied by adding `dark:` variants, but if the base class is hardcoded to `bg-white`, a `dark:bg-gray-900` variant only works if `dark:` is explicitly added at every call site — and sites are easy to miss. There is no dark-mode check in any existing component.

**How to avoid:**
Before adding any `dark:` variants, audit every hardcoded color class in the codebase. Replace each with a semantic Tailwind CSS variable token defined in `@theme` (e.g., `--color-surface`, `--color-on-surface`) that resolves differently under the dark theme. This way, a single token change propagates everywhere instead of requiring per-site `dark:` additions. For panels inside type-colored containers (e.g., the white stat boxes inside `bg-${type}` sections), establish a deliberate contrast rule — either dark-tinted panels or translucent overlays — and apply it consistently.

A practical grep to run before declaring a phase complete:
```bash
grep -rn "bg-white\|text-black\|bg-gray-\|text-gray-" src/
```
Every hit should either be intentional (documented) or converted to a semantic token.

**Warning signs:**
- The `bg-white` count in `src/` is currently above 20 instances across `SearchBar.jsx`, `BasicData.jsx`, `LearnSet.jsx`, `Results.jsx`
- `index.css` sets `background-color: white` on `:root` — this overrides any Tailwind dark base until removed
- White "data cell" boxes inside type-colored containers will look broken on dark backgrounds unless explicitly handled

**Phase to address:**
Dark theme foundation phase — must be resolved before any other theming work begins, because subsequent phases will build on top of whatever semantic tokens are established here.

---

### Pitfall 3: Per-Type Theming Breaking When a Pokemon's Primary Type Changes Context

**What goes wrong:**
The detail page derives its entire color theme from `poke.types[0].type.name`. If a new component is added that wraps multiple Pokemon contexts (e.g., evolution chain cards showing types for evolved forms), and that component inherits or re-derives `type` independently, different sections of the page can end up themed to different types simultaneously — producing color chaos rather than coherent immersion.

**Why it happens:**
The current architecture propagates `type` as a string prop from the parent detail page down to each child (`BasicData`, `StatGraph`, `LearnSet`, `ContainerSkeleton`). This works as long as every component receives the same `type` value. During the overhaul, new components for evolution chains, type matchups, or related Pokemon will likely also need to render type badges or type-colored accents for Pokemon other than the current one — and developers will naturally reach for the same `bg-${type}` pattern with whatever type is locally available, accidentally theming a sub-section to a different type.

**How to avoid:**
Establish a clear rule before building detail page components: the page-level type (primary type of the viewed Pokemon) is the **page theme** and is stored in one place (a React context or a single state variable at the `PokemonDetails` level). Individual type badges within evolution chains or type charts use static type colors (always via the same class pattern), but the container/layout theming always reads from the page theme context, never from a locally scoped type value. Document this rule in a comment at the top of `PokemonDetails.jsx`.

**Warning signs:**
- A child component accepts both a `poke` prop and a `type` prop separately, then derives its own type string from `poke.types[0].type.name` rather than using the passed `type`
- Evolution chain or type chart components start rendering `bg-${someOtherType}` backgrounds on container elements (as opposed to badges)

**Phase to address:**
Detail page theming phase — establish the page-theme context pattern before building new section components.

---

### Pitfall 4: Stat Bar Widths Using Interpolated Arbitrary Values (Pre-existing, Will Worsen)

**What goes wrong:**
`StatGraph.jsx` currently renders stat bars using:
```jsx
className={`... w-[${((stat.base_stat / 255) * 100).toFixed(0)}%]`}
```
This constructs an arbitrary Tailwind value at runtime (e.g., `w-[47%]`). Tailwind's scanner cannot detect runtime-computed arbitrary values — only static ones written literally in source. These bars are almost certainly already broken or wrong in production builds. During the UI overhaul, if the stat bar is redesigned using the same pattern (just with new styling), the class generation problem carries forward unsolved.

**Why it happens:**
The existing `@source inline()` in `App.css` already handles percentage widths via `@source inline("w-[{1..100..1}%]")` which generates `w-[1%]` through `w-[100%]`. However, `.toFixed(0)` returns a string, and the template literal is evaluated at runtime — Tailwind's static scanner sees the literal text `w-[${...}%]`, not the final computed value. Whether the `{1..100..1}` range generator actually compensates for this depends on whether Tailwind generates all 100 classes proactively. **This needs to be verified in a production build before the overhaul begins.**

The safest resolution: replace the interpolated width with an inline `style` prop:
```jsx
style={{ width: `${((stat.base_stat / 255) * 100).toFixed(0)}%` }}
```
This is the recommended pattern for truly dynamic numeric values in Tailwind v4.

**Warning signs:**
- Stat bars render at a fixed width (usually 100% or 0%) in production but work correctly in dev
- Running `vite build && vite preview` and inspecting the stat bar elements shows the `w-[X%]` class is present in HTML but absent from the generated CSS

**Phase to address:**
Foundation / theming setup phase — fix before redesigning the stat visualization so the redesign is built on a working foundation.

---

### Pitfall 5: Redesigned Components Breaking Existing Navigation and Search State

**What goes wrong:**
`SearchBar.jsx` is the most fragile component in the codebase (192 lines, duplicated JSX for two page contexts, implicit navigation state via URL params). During the overhaul, restructuring the search bar's JSX for visual redesign frequently breaks the type filter navigation state machine — particularly the five-branch conditional that manages `active1`/`active2` type selection — because the logic is tightly coupled to the rendered JSX structure and is not tested.

**Why it happens:**
The type filter state machine (`navigate` to `/sort/${type}`, `/sort/${active1}+${type}`, etc.) works through URL parameter side effects, not through local state. Any restructuring of the component that reorders event handler attachment or changes how `active1`/`active2` are derived from `useParams` can silently break the dual-type filtering. Because there are no tests, breakage is only detected through manual testing of every type filter combination.

**How to avoid:**
Extract the navigation logic from `SearchBar.jsx` into a custom hook (`useTypeFilter`) before any visual changes. The hook owns `active1`, `active2`, and the `navigate` calls. The visual component becomes a pure presenter that calls hook methods on click. This way, visual redesign cannot accidentally mutate the navigation logic. Write the hook's behavior as a state machine in comments (or as a simple test) before extracting — so the current behavior is captured as a specification.

**Warning signs:**
- Selecting two types and then deselecting one leads to a blank page or wrong type list
- Navigating to `/sort/fire+water` and then clicking `fire` again does not reduce to `/sort/water`
- The `active1` and `active2` state does not reflect the URL after a back/forward navigation

**Phase to address:**
Component extraction / refactoring phase — extract the logic before applying visual styling. This is also a prerequisite for the detail page redesign because the SearchBar appears embedded in the details view.

---

### Pitfall 6: Dark Theme Applied Globally But Not to the Page Background Root

**What goes wrong:**
Dark background is applied to layout containers (`div.bg-gray-900`) but `index.css` sets `background-color: white` on `:root`, and `App.css` puts `max-width: 1280px; margin: 0 auto` on `#root`. This means the viewport area outside the `#root` container — and any moment before CSS loads — flashes white, creating a jarring FOUC (flash of unstyled content) against a dark UI.

**Why it happens:**
CSS overrides from a parent stylesheet (index.css `:root`) outrank component-level Tailwind classes because `:root` has higher specificity and loads first. Setting `background-color: white` in `:root` means even if every Tailwind container is dark, the document background bleeds through on wide viewports, on scroll bounce on iOS, and during page load.

**How to avoid:**
- Remove `background-color: white` from `:root` in `index.css`
- Add `background-color` to the `:root` (or `html`, `body`) rule that matches the dark theme base color
- Apply dark background to `html` and `body` elements, not just React-managed containers

**Warning signs:**
- White flash visible during page load, especially on mobile or slow connections
- On wide viewport (> 1280px), white strips appear on either side of the `#root` centered container
- iOS safari overscroll area shows white bounce background

**Phase to address:**
Dark theme foundation phase — fix `index.css` in the same commit that establishes the dark base.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Adding new dynamic class patterns without updating `@source inline()` | Faster dev iteration (works in dev mode) | Silent production styling failures; hardest to diagnose | Never — always update the registry immediately |
| Applying `dark:` variants at individual class sites instead of using semantic tokens | No refactoring required | Every new component requires manual dark auditing; easy to miss | Only for one-off overrides after token system is in place |
| Keeping duplicated SearchBar JSX branches during visual redesign | Less risk of breaking navigation logic | Means styling each branch separately; drift guaranteed | Only if component extraction is deferred to a later phase, and only if both branches are explicitly marked TODO |
| Using `text-black` inside type-colored containers | Readable against most type colors | `text-black` is invisible on dark-themed neutral sections; requires per-container override logic | Never during a dark theme overhaul — use contrast tokens |
| Deriving page theme type locally (`poke.types[0].type.name`) inside child components | Self-contained components | Page-level theme and badge-level type become indistinguishable; produces color chaos in evolution chains | Never for container/layout theming — only for badge renders |

---

## Integration Gotchas

Common mistakes when connecting to external services or the CSS build pipeline.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Tailwind v4 build | Assuming `vite dev` behavior proves production correctness for dynamic classes | Always test dynamic class coverage with `vite build && vite preview` before each phase ships |
| Tailwind v4 `@source inline()` | Using brace expansion with type values embedded in a parent pattern without testing the exact generated class names | Verify generated classes in the build output's CSS file; use DevTools to confirm the class exists in the stylesheet |
| Tailwind v4 `dark:` variant | Forgetting to declare `@custom-variant dark` in the CSS file when using class-based dark mode | Add `@custom-variant dark (&:where(.dark, .dark *))` or `data-theme` equivalent to `App.css` before any `dark:` class is used |
| PokeAPI sprite URLs | Assuming sprites will always exist for all 1,025 Pokemon — the shiny artwork path has gaps | Add `onError` fallback handlers on all `<img>` tags using the sprite CDN before the overhaul, or the redesign will surface broken image icons more visibly |
| React Router v7 params | `useParams` from `"react-router/dist/index"` (non-standard import path used in current code) — a version upgrade could break this silently | Audit and standardize the import path to `"react-router"` before refactoring any component that uses routing |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Per-card type color lookup on each render in the Results grid (1,025 cards) | Frame drops when scrolling the grid; filter causes visible repaint lag | Memoize the type-to-color mapping; avoid re-computing during scroll | Noticeable at full 1,025-card load without virtualization |
| Adding more CSS variables per type during overhaul (gradient stops, shadow colors, glow colors) | CSS bundle grows; browser spends more time resolving variable chains on large pages | Define only the variables you use; prefer computed OKLCH gradients over separate stop variables | Becomes a concern when adding 3+ new variables per type (18 types × 3 = 54 new variables) |
| Running `vite build` with a large `@source inline()` safelist that generates unused class variants | Build time increases; CSS output grows | Generate only the variants actually used; do not add `hover:`, `focus:`, `dark:` prefixes to the safelist unless those variants are used | Build time impact is minor, but CSS output can grow significantly if hover+focus+dark variants are added for all 18 types × many patterns |
| Unvirtualized 1,025-card grid with type-colored backgrounds (new cards have more DOM nodes than current design) | Scroll jank on low-end devices; first contentful paint degrades | Keep card DOM complexity low (< 5 nodes); defer artwork loading with `loading="lazy"` | Noticeable on mobile at full Pokédex load |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Type badge colors that are unreadable against the type-colored card background (e.g., Electric yellow badge on Electric yellow card) | Users cannot distinguish type from card | Use a white or dark border ring around badges, or slightly darken/lighten badge color relative to card background |
| Dark theme with pure black (`#000`) background against vibrant type colors | Harsh contrast causes eye strain; feels amateurish | Use a dark neutral (e.g., `gray-900` / `#111827`) as the base, reserving pure black for text |
| Detail page color theme shifts as users navigate between Pokemon but loading state briefly shows previous Pokemon's colors | Visual flicker; confusing if fast-navigating through evolutions | Clear or neutralize the type theme during loading, then apply when data arrives |
| Shiny artwork toggle (current tab UI) is easy to miss in redesigned layouts | Users never discover the shiny variant | Make the toggle visually prominent; consider a sparkle icon instead of plain text "Shiny" |
| Type filter buttons styled to match their type colors but those colors wash out under a dark theme | Type buttons become unreadable (e.g., dark type is nearly invisible on dark background) | Ensure type buttons always have sufficient contrast against the dark background; add a white/light border for very dark types (Dark, Ghost, Poison) |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Dynamic class coverage:** Run `vite build && vite preview` and visually check every type-colored element. Dev mode working does not mean production is working.
- [ ] **All 18 types tested:** After each new dynamic class pattern, manually navigate to a Pokemon of each type in the production preview. Electric and Normal are the easiest to overlook (light colors on dark).
- [ ] **Dark theme holes:** Run `grep -rn "bg-white\|text-black\|bg-gray-[0-9]" src/` — every match should be an intentional contrast element, not a forgotten hardcoded color.
- [ ] **`:root` and `body` background:** Confirm `index.css` no longer sets `background-color: white` and that the full viewport is dark-colored (visible on wide screens and iOS bounce scroll).
- [ ] **Type filter still works:** After any SearchBar restructuring, manually test: (1) single type filter, (2) dual type filter, (3) deselect one type from a dual filter, (4) clear all, (5) navigate back from detail page.
- [ ] **Stat bars render at correct width:** In production build preview, inspect a Pokemon's stats and confirm the bars are not all 0% or 100%.
- [ ] **Shiny artwork loads:** Confirm the shiny tab still works after any `BasicData` restructuring — the source URL path is different from the normal artwork path.
- [ ] **Evolution chain placeholder:** `PokemonDetails.jsx` has a hardcoded "Evolution data not implemented yet." — ensure the overhaul does not accidentally style this placeholder as if it were real content.

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| New dynamic classes missing from production build | LOW | Add the missing pattern to `@source inline()` in `App.css`; rebuild; verify with `vite build && vite preview` |
| Hardcoded light colors found after dark theme shipped | MEDIUM | Grep for `bg-white`, `text-black`, `bg-gray-*`; replace each with semantic token; re-check all pages |
| Type filter navigation broken by SearchBar refactor | HIGH | Revert the SearchBar changes; extract the navigation logic to a custom hook first (separately from visual changes); re-apply visual changes only to the presenter layer |
| Stat bars broken in production | LOW | Replace `w-[${...}%]` with `style={{ width: '...' }}` — no Tailwind class needed for runtime-computed numeric values |
| Detail page type theme leaking between Pokemon on navigation | MEDIUM | Ensure `PokemonDetails.jsx` clears type-derived state on unmount or on param change; add a loading state that resets to neutral theme |
| FOUC (white flash on dark page) | LOW | Set `background-color` on `html` and `body` in `index.css` to match dark base color; no framework change needed |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Dynamic class patterns not registered in `@source inline()` | Foundation / theming setup | `vite build && vite preview` smoke test for all 18 types after each pattern addition |
| Hardcoded light colors creating dark theme holes | Dark theme foundation | Grep audit for `bg-white`, `text-black`, `bg-gray-*` before closing phase |
| Per-type detail page theming with inconsistent type derivation | Detail page theming phase | Navigate to a dual-type Pokemon (e.g., Charizard, Fire/Flying); confirm page theme is Fire, not Flying |
| Stat bar widths using interpolated arbitrary values | Foundation / theming setup | Inspect stat bars in `vite preview`; confirm widths vary per stat |
| SearchBar navigation state broken by restructuring | Component extraction phase (before visual changes) | Manual type filter test: single, dual, deselect, clear, back-navigate |
| Dark base not applied to `:root`/`body` | Dark theme foundation | View at > 1280px viewport width; confirm no white side strips; check iOS bounce |

---

## Sources

- Tailwind CSS v4 official docs — Detecting classes in source files: https://tailwindcss.com/docs/detecting-classes-in-source-files
- Tailwind CSS GitHub Discussion #18137 — Fully dynamic class names from server-side data not applied at runtime: https://github.com/tailwindlabs/tailwindcss/discussions/18137
- Tailwind CSS GitHub Discussion #15291 — Safelist in V4: https://github.com/tailwindlabs/tailwindcss/discussions/15291
- Tailwind CSS GitHub Discussion #16517 — Upgrading to Tailwind v4: Missing Defaults, Broken Dark Mode, and Config Issues: https://github.com/tailwindlabs/tailwindcss/discussions/16517
- Tailwind CSS official docs — Dark mode: https://tailwindcss.com/docs/dark-mode
- Tailwind CSS official docs — Theme variables: https://tailwindcss.com/docs/theme
- Sujalvanjare — How to Safelist Classes in Tailwind CSS V4: https://www.sujalvanjare.com/blog/safelist-classes-tailwind-css-v4
- Medium / Serhat Balpetek — How I Fixed Tailwind CSS v4 Dark Mode Not Working in a Vite + React Project: https://medium.com/@balpetekserhat/how-i-fixed-tailwind-css-v4-dark-mode-not-working-in-a-vite-react-project-d7f0b3a31184
- Codebase direct inspection — `App.css`, `BasicData.jsx`, `StatGraph.jsx`, `SearchBar.jsx`, `containerSkeleton.jsx`, `index.css`

---
*Pitfalls research for: React + Tailwind CSS 4 UI overhaul with dynamic type theming (PokeAPI browser)*
*Researched: 2026-02-27*
