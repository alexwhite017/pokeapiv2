# Architecture Research

**Domain:** Dark-themed design system on existing React + Tailwind CSS 4 SPA
**Researched:** 2026-02-27
**Confidence:** HIGH — all recommendations verified against official Tailwind CSS v4 docs and current Tailwind v4.1 release notes

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Design Token Layer (CSS)                     │
│  @theme { --color-type-fire, --color-type-water, ...           │
│           --color-surface, --color-surface-raised, ...          │
│           --space-*, --text-*, --radius-* }                     │
│                           ↓ generates                           │
│            Tailwind utility classes (bg-*, text-*, etc.)         │
├─────────────────────────────────────────────────────────────────┤
│                    Shared Component Library                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  TypeBadge   │  │  PokemonCard │  │  StatBar     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  SectionCard │  │  NavBar      │  │  SearchBar   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
├─────────────────────────────────────────────────────────────────┤
│                       Page Components                            │
│  ┌──────────────────────┐   ┌──────────────────────────────┐   │
│  │   Results (list)     │   │   PokemonDetails (detail)    │   │
│  │  - type prop drives  │   │  - primaryType drives page   │   │
│  │    filter highlight  │   │    background + accent color │   │
│  └──────────────────────┘   └──────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                  Data / Constants Layer                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  src/data/typeColors.js — type → CSS var mapping         │  │
│  │  src/data/typeNames.js — 18 type name strings            │  │
│  │  src/data/statNames.js, statColors.js, etc.              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Shared vs Page-Specific |
|-----------|----------------|------------------------|
| `NavBar` | Fixed header; dark global surface; home link | Shared — used on all routes |
| `SearchBar` | Pokédex-styled search widget + type filter buttons | Shared — used on list + detail |
| `PokemonCard` | Type-colored card: artwork, name, dex number, type badges | Shared — rendered by Results |
| `TypeBadge` | Single type pill (colored background, white label) | Shared — used in card + detail sidebar |
| `SectionCard` | Dark surface wrapper with optional type-accent header | Shared — replaces `containerSkeleton` |
| `StatBar` | Visual stat bar with semantic color per stat | Page-specific to detail (PokemonDetailsComponents/) |
| `BasicData` | Detail sidebar: image, types, abilities, species info | Page-specific to detail |
| `DexEntries` | Pokédex flavor text by generation | Page-specific to detail |
| `LearnSet` | Move tables (level-up, TM) | Page-specific to detail |
| `Results` | Page: fetches list, renders grid of PokemonCards | Page component |
| `PokemonDetails` | Page: fetches pokemon data, composes detail layout | Page component |

---

## Theme Token Strategy

**Recommendation: Tailwind CSS v4 `@theme` as the single source of truth for all design tokens, with CSS custom properties for dynamic (runtime) type theming.**

### Why This Approach

Tailwind CSS v4 eliminated `tailwind.config.js` in favor of CSS-first configuration. Variables declared in `@theme` become both CSS custom properties on `:root` and Tailwind utility classes simultaneously — no duplication needed. (Source: [Tailwind CSS v4 Theme docs](https://tailwindcss.com/docs/theme))

The existing codebase uses dynamic class string interpolation (`bg-${type}`) which requires Tailwind's SafeList in v3. In v4, `safelist` is removed. The replacement is `@source inline()` (added in v4.1), which uses brace expansion to force-generate the dynamic classes. (Source: [Tailwind CSS v4.1 release](https://tailwindcss.com/blog/tailwindcss-v4-1))

### Three Layers of Tokens

#### Layer 1: Primitive Tokens (raw values in `@theme`)

Define every raw color, spacing step, radius, and type-name color in `index.css` using `@theme`:

```css
/* src/index.css */
@import "tailwindcss";

/* Dark mode — class-based so we can force-dark this app */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* === Pokémon Type Palette (primitive) === */
  --color-type-normal:   #A8A77A;
  --color-type-fire:     #EE8130;
  --color-type-water:    #6390F0;
  --color-type-electric: #F7D02C;
  --color-type-grass:    #7AC74C;
  --color-type-ice:      #96D9D6;
  --color-type-fighting: #C22E28;
  --color-type-poison:   #A33EA1;
  --color-type-ground:   #E2BF65;
  --color-type-flying:   #A98FF3;
  --color-type-psychic:  #F95587;
  --color-type-bug:      #A6B91A;
  --color-type-rock:     #B6A136;
  --color-type-ghost:    #735797;
  --color-type-dragon:   #6F35FC;
  --color-type-dark:     #705746;
  --color-type-steel:    #B7B7CE;
  --color-type-fairy:    #D685AD;

  /* === Global Dark Surface Palette === */
  --color-surface-base:   #0f0f14;   /* page background */
  --color-surface-raised: #1a1a24;   /* card background */
  --color-surface-inset:  #111118;   /* recessed areas */
  --color-surface-border: #2a2a38;   /* subtle borders */

  /* === Text === */
  --color-text-primary:   #f0f0f5;
  --color-text-secondary: #a0a0b8;
  --color-text-muted:     #606078;

  /* === Spacing scale (extend defaults) === */
  --spacing-section: 2rem;           /* between detail page sections */

  /* === Typography === */
  --font-sans: system-ui, Avenir, Helvetica, Arial, sans-serif;
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;

  /* === Radius === */
  --radius-card: 1rem;
  --radius-badge: 0.375rem;
  --radius-section: 0.75rem;
}

/* Force-generate all type utility classes (replaces v3 safelist) */
@source inline("bg-type-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
@source inline("text-type-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
@source inline("border-type-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
```

**Why `@theme` not `:root`:** Variables in `@theme` generate utility classes (`bg-type-fire`, `text-type-fire`, `border-type-fire`) automatically. Variables in `:root` alone do not. (Source: [Tailwind CSS v4 Theme docs](https://tailwindcss.com/docs/theme))

#### Layer 2: Semantic Tokens (runtime-swappable via CSS vars)

For per-Pokémon type theming, use a semantic token layer that gets overridden at the detail page level using inline styles or a `data-type` attribute. The semantic token `--color-accent` maps to whatever type color the current Pokémon has:

```css
/* Default (no type context) */
:root {
  --color-accent: var(--color-type-normal);
  --color-accent-muted: color-mix(in oklch, var(--color-accent) 30%, transparent);
}
```

On the detail page, the page wrapper element receives `style={{ "--color-accent": "var(--color-type-fire)" }}` (set from JS using the Pokémon's primary type). Components inside consume `--color-accent` rather than a specific type token.

**Why inline styles for this:** The type is only known at runtime from PokeAPI data. CSS custom properties are the only mechanism that allows runtime theme injection without JavaScript re-renders. This is the correct tool for the job — not an anti-pattern here.

#### Layer 3: Component Tokens (scoped to component)

`SectionCard` (replacing the current `containerSkeleton`) uses only semantic tokens, never primitive type tokens directly:

```css
/* In the component, using @layer components */
@layer components {
  .section-card {
    background-color: var(--color-surface-raised);
    border: 1px solid var(--color-surface-border);
    border-radius: var(--radius-section);
  }
  .section-card-header {
    background-color: var(--color-accent-muted);
    color: var(--color-text-primary);
    border-radius: calc(var(--radius-section) - 2px) calc(var(--radius-section) - 2px) 0 0;
  }
}
```

### Summary: CSS vars vs Tailwind config vs inline styles

| Approach | When to Use | This Project |
|----------|-------------|-------------|
| `@theme` tokens | Fixed design tokens (spacing, typography, radius, type palette) | YES — all static tokens |
| Tailwind utility classes | Static structural/layout classes | YES — `flex`, `gap-4`, `rounded-card`, etc. |
| CSS custom properties (`:root`) | Semantic tokens that don't need utility classes | YES — `--color-accent` overridable per-page |
| Inline `style` prop | Runtime-variable values from API data | YES — type-specific `--color-accent` injection |
| `tailwind.config.js` / `safelist` | N/A — removed in Tailwind v4 | NO |
| Dynamic class strings (`bg-${type}`) | Only with `@source inline()` force-generating them | Migrate to type-specific color token approach |

---

## Recommended Project Structure

```
src/
├── index.css                   # @theme tokens, @source inline, @custom-variant dark
├── App.jsx                     # Router — unchanged
├── main.jsx                    # Entry — unchanged
├── components/
│   ├── shared/                 # Shared component library
│   │   ├── NavBar.jsx          # Dark header — global
│   │   ├── SearchBar.jsx       # Pokédex search widget — list + detail
│   │   ├── PokemonCard.jsx     # Type-colored grid card (extracted from Results inline JSX)
│   │   ├── TypeBadge.jsx       # Single type pill — NEW
│   │   └── SectionCard.jsx     # Dark section wrapper (replaces containerSkeleton)
│   ├── Results.jsx             # List page — uses PokemonCard
│   └── PokemonDetails/
│       ├── PokemonDetails.jsx  # Detail page — sets --color-accent via style prop
│       ├── BasicData.jsx       # Sidebar — uses shared TypeBadge, SectionCard
│       ├── StatBar.jsx         # Individual stat row (renamed/refactored from StatGraph)
│       ├── StatGraph.jsx       # Stat table using StatBar
│       ├── DexEntries.jsx      # Pokédex entries — uses SectionCard
│       └── LearnSet.jsx        # Move tables — uses SectionCard
├── data/
│   ├── typeNames.js            # 18 type name strings — unchanged
│   ├── typeColors.js           # NEW: type → CSS var name mapping (replaces dynamic string)
│   ├── statNames.js            # unchanged
│   ├── statColors.js           # Updated: maps to new semantic token names
│   ├── statBackground.js       # Can be merged into statColors.js
│   ├── evNames.js              # unchanged
│   ├── gameColors.js           # unchanged
│   └── genRanges.js            # unchanged
├── context/                    # Currently empty — NOT needed for theme
│   └── (leave empty)           # inline style injection is simpler than Context
└── functions/
    ├── fetchPokemon.jsx        # unchanged
    └── fetchMoveList.jsx       # unchanged
```

### Structure Rationale

- **`components/shared/`**: Extracts the components that appear on multiple pages into an explicit shared directory. Clear contract: if a component is shared, it lives here. If it's detail-only, it stays in `PokemonDetails/`.
- **`data/typeColors.js`**: A new file that maps type names to CSS variable references — this is the single source of truth for "how do I get the color for a type in JS?". Eliminates the current `bg-${type}` pattern everywhere.
- **`index.css`**: The design system root. All `@theme` tokens live here. This is the only file the roadmap needs to touch to change any token globally.
- **`context/`**: Left empty intentionally. Theme is driven by CSS custom properties injected via inline styles on the page root, not React Context. Context would add complexity with no benefit here since the theme doesn't need to propagate as JS values.

---

## Architectural Patterns

### Pattern 1: CSS Custom Property Injection for Per-Type Theming

**What:** The `PokemonDetails` page wrapper sets `--color-accent` as an inline style based on the Pokémon's primary type. All descendant components consume `--color-accent` (and derived tokens like `--color-accent-muted`) rather than type-specific class strings.

**When to use:** When a value is only known at runtime (from API data), and needs to cascade through an entire component subtree.

**Trade-offs:** Requires discipline — components must use `--color-accent` not `bg-type-fire` directly. But this is exactly the right model: type = data, color = presentation derived from data.

**Example:**
```jsx
// PokemonDetails.jsx
const primaryType = poke.types[0].type.name;

return (
  <div
    className="w-full mx-5 bg-surface-raised rounded-card p-6"
    style={{ "--color-accent": `var(--color-type-${primaryType})` }}
  >
    <BasicData poke={poke} species={species} />
    {/* All children inherit --color-accent from CSS cascade */}
  </div>
);
```

```jsx
// SectionCard.jsx — consumes semantic token, not type-specific class
const SectionCard = ({ title, children }) => (
  <div className="section-card mb-section">
    {title && <div className="section-card-header px-4 py-2">{title}</div>}
    <div className="p-4">{children}</div>
  </div>
);
```

### Pattern 2: `@source inline()` for Type Utility Classes

**What:** In `index.css`, use `@source inline()` with brace expansion to force-generate all type utility classes. This replaces the removed `safelist` config from Tailwind v3.

**When to use:** Any time a Tailwind class is constructed via string interpolation and therefore invisible to the content scanner.

**Trade-offs:** The class strings must be maintained in `index.css`. Acceptable because there are exactly 18 types which never change.

**Example:**
```css
/* index.css — generates bg-type-fire, bg-type-water, etc. for all 18 types */
@source inline("bg-type-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
@source inline("text-type-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
```

**In JS/JSX**, the type badge then uses the explicit class:
```jsx
// typeColors.js
export const typeBgClass = (type) => `bg-type-${type}`;   // generates a static-ish string
// OR more explicitly:
export const TYPE_COLORS = {
  fire: "#EE8130",
  water: "#6390F0",
  // ... etc
};

// TypeBadge.jsx — use the Tailwind class (generated via @source inline)
const TypeBadge = ({ type }) => (
  <span className={`bg-type-${type} text-white font-bold px-2 py-0.5 rounded-badge text-sm capitalize`}>
    {type}
  </span>
);
```

### Pattern 3: Global Dark Base via `@custom-variant`

**What:** The entire app runs in dark mode always. Set `.dark` on `<html>` once and never toggle it. Use `@custom-variant dark` so Tailwind's `dark:` variant respects the class, not system preference.

**When to use:** Apps with a forced dark theme (no light/dark toggle needed). This project's core value is "dark themed" — system preference doesn't apply.

**Trade-offs:** No light mode fallback. That's fine — it's a deliberate product decision per PROJECT.md.

**Example:**
```css
/* index.css */
@custom-variant dark (&:where(.dark, .dark *));
```

```html
<!-- index.html -->
<html class="dark">
```

```css
/* index.css — dark base applied globally */
:root {
  background-color: var(--color-surface-base);
  color: var(--color-text-primary);
}
```

### Pattern 4: Incremental Component Replacement (Brownfield Strategy)

**What:** Replace components one at a time. The design token layer (`@theme` in `index.css`) goes first. Then shared components. Then pages. Existing components continue to work during migration because the dark base styles are additive.

**When to use:** Any brownfield styling migration. Never attempt to restyle all components simultaneously.

**Build order (detailed below):** Tokens → shared atoms → list page → detail page.

---

## Data Flow

### Theme Data Flow

```
PokeAPI response
    ↓
poke.types[0].type.name  →  string (e.g., "fire")
    ↓
PokemonDetails.jsx
    ↓ style={{ "--color-accent": "var(--color-type-fire)" }}
DOM element (CSS cascade)
    ↓ var(--color-accent) resolved
SectionCard, BasicData, TypeBadge, StatBar ...
    (consume --color-accent without knowing which type it is)
```

### Type Filter Flow (unchanged)

```
User clicks type button in SearchBar
    ↓
navigate("/sort/fire")  or  navigate("/sort/fire+water")
    ↓
Results component reads useParams()
    ↓
fetchPokemon("type", typing) → filtered list
    ↓
Results renders PokemonCards (each card uses poke.types[0] for its own card bg)
```

### Key Data Flows

1. **Type-to-card-color:** Each `PokemonCard` receives the Pokémon's URL (which contains the ID). The card itself must fetch or receive the type data to apply its background. **Options:** (a) pass type from card's initial data if available in list response, or (b) use a generic dark card with type colors only on the detail page. Recommend option (b) for the list page — the list API response doesn't include type data, fetching type per card creates 1,025 extra API calls.

2. **Type-to-detail-accent:** `PokemonDetails` has full pokemon data including types. Set `--color-accent` at the page root, let CSS cascade handle all children.

---

## Build Order (Critical for Roadmap)

This is the correct sequence — each step depends on the previous:

### Step 1: Design Tokens (do this first, everything else depends on it)
- Add `@theme` block to `index.css` with full type palette + global dark surface tokens
- Add `@source inline()` for all 18 type class sets
- Add `@custom-variant dark` + add `.dark` class to `<html>`
- Set dark base styles on `:root`
- **Nothing visual changes yet** — tokens defined but not used by components

### Step 2: Shared Atom Components (TypeBadge, SectionCard, PokemonCard)
- Extract `TypeBadge` from the inline spans currently in `BasicData` and `SearchBar`
- Build `SectionCard` as the replacement for `containerSkeleton` — it uses `--color-accent-muted` for its header
- Build `PokemonCard` extracted from the inline JSX in `Results.jsx` — uses dark surface tokens, no type color on list cards (see data flow note above)
- **NavBar** restyle: dark background using `bg-surface-raised`, white text

### Step 3: List Page (Results)
- Replace inline card JSX with `PokemonCard` component
- Restyle `SearchBar` to dark theme
- Restyle grid layout spacing

### Step 4: Detail Page (PokemonDetails)
- Set `--color-accent` on page wrapper from `poke.types[0].type.name`
- Replace `containerSkeleton` usages with `SectionCard`
- Restyle `BasicData` using dark tokens + `--color-accent` for accent areas
- Restyle `StatGraph` / `StatBar` using updated stat color tokens
- Restyle `DexEntries`, `LearnSet` using `SectionCard`

---

## Anti-Patterns

### Anti-Pattern 1: Dynamic Class String Interpolation Without `@source inline()`

**What people do:** Keep `className={\`bg-${type}\`}` with the original Tailwind v3 type names (e.g., `bg-fire`) and expect it to work.

**Why it's wrong:** Tailwind v4 removed `safelist`. Without `@source inline()`, dynamically constructed class strings are invisible to the scanner and stripped from the build. The app appears to work in dev (JIT generates on demand) but breaks in production builds.

**Do this instead:** Use `@source inline()` in `index.css` to force-generate all 18 type class variants, AND rename to the namespaced form (`bg-type-fire`) to avoid conflicts with existing Tailwind color utilities.

### Anti-Pattern 2: Storing Type Colors as Tailwind Class Strings in JS

**What people do:** Keep lookup objects like `{ fire: "bg-fire-500", water: "bg-blue-400" }` mapping types to Tailwind classes.

**Why it's wrong:** This ties presentation (specific Tailwind shade) to data (type name), making consistent theming impossible. When the design changes, you touch every data file. It also breaks the cascade model — components can't use `--color-accent` if the color lives as a class string.

**Do this instead:** Store actual hex values or CSS variable names in data files. Let `@theme` generate the utility classes. Components use the generated `bg-type-*` classes or consume `--color-accent` from the cascade.

### Anti-Pattern 3: Using React Context for Theme When CSS Custom Properties Suffice

**What people do:** Create a `ThemeContext` that holds `primaryType`, passes it through the component tree, and every component reads from context to apply colors.

**Why it's wrong:** For a color theme that is purely visual and doesn't drive any behavior, CSS custom properties on a DOM ancestor are simpler, faster (no re-render on type change), and don't require wrapping every component in a context consumer.

**Do this instead:** Set `--color-accent` as an inline style on the `PokemonDetails` page wrapper. The CSS cascade delivers it to every descendant automatically with zero JavaScript overhead. Use Context only if theme drives behavior (e.g., toggling between light/dark dynamically).

### Anti-Pattern 4: Restyling All Components at Once

**What people do:** Change `index.css` to a dark background, then find that every component's hardcoded `bg-white` and `text-gray-800` now clashes — and try to fix all of them in one PR.

**Why it's wrong:** Ripple effect is uncontrollable. Difficult to test incrementally. High risk of regressions.

**Do this instead:** Follow the build order above. Tokens first. Then one component at a time. The dark base on `:root` is the only global change in Step 1 — individual components are updated in subsequent steps.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| PokeAPI | Unchanged — fetch in `src/functions/` | Type names from API drive CSS variable selection |
| GitHub Sprites CDN | Unchanged — direct `<img src>` URLs | No changes needed for design system |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `index.css` → all components | CSS cascade via `@theme` custom properties | Single direction — CSS layer is authoritative |
| `PokemonDetails` → children | `--color-accent` via inline `style` prop on page wrapper | Type color injected at page boundary |
| `data/typeColors.js` → components | Import of mapping object | Components import to get CSS var name from type string |
| `components/shared/` → pages | Props-based API | No internal state leakage; shared components are stateless presentational |

---

## Scalability Considerations

This is a client-side SPA with a fixed dataset (1,025 Pokémon, 18 types). Scaling concerns are irrelevant. The only performance concern is the 1,025 API calls on the list page, which is pre-existing and out of scope.

The design token architecture scales naturally if more types were ever added: add one line to `@theme`, one entry to the `@source inline()` list, done.

---

## Sources

- [Tailwind CSS v4 Theme Variables docs](https://tailwindcss.com/docs/theme) — HIGH confidence, official
- [Tailwind CSS v4 Dark Mode docs](https://tailwindcss.com/docs/dark-mode) — HIGH confidence, official
- [Tailwind CSS v4 Source Detection / @source inline() docs](https://tailwindcss.com/docs/detecting-classes-in-source-files) — HIGH confidence, official
- [Tailwind CSS v4.1 release notes](https://tailwindcss.com/blog/tailwindcss-v4-1) — HIGH confidence, official (confirms `@source inline()` is v4.1+)
- [Pokemon type hex colors](https://gist.github.com/apaleslimghost/0d25ec801ca4fc43317bcff298af43c3) — MEDIUM confidence (community gist, matches Bulbapedia values)
- [shadcn/ui Theming docs](https://ui.shadcn.com/docs/theming) — MEDIUM confidence, influential reference implementation for CSS-var-based theming pattern
- [CSS-first design token architecture patterns](https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/) — MEDIUM confidence, aligns with Tailwind v4 official approach

---

*Architecture research for: PokeAPI Browser — Dark Design System + Type Theming*
*Researched: 2026-02-27*
