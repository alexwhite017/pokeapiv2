# Stack Research

**Domain:** React SPA dark theme UI overhaul with dynamic per-Pokemon type colors
**Researched:** 2026-02-27
**Confidence:** HIGH (core patterns verified via official Tailwind docs + Context7; library versions verified via npm search)

---

## Context: What This Is Not

This is **not** a new project stack decision. The core stack is locked:
- React 19.1.1 + React Router 7.9.1 + Tailwind CSS 4.1.13 + Vite 7.1.6

This research answers: **what additional patterns and libraries are needed to execute the dark-theme overhaul on the existing stack?**

---

## Recommended Stack

### Core Technologies (Existing — No Changes)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| React | 19.1.1 | UI framework | Already installed |
| React Router | 7.9.1 | Client-side routing | Already installed |
| Tailwind CSS | 4.1.13 | Utility CSS framework | Already installed |
| Vite | 7.1.6 | Build tool + dev server | Already installed |

### Supporting Libraries — Add These

| Library | Version | Purpose | Why This One |
|---------|---------|---------|-------------|
| `motion` | ^12.34.3 | Card hover animations, page transitions, stat bar fill animations | Official successor to `framer-motion`; React 19 + Strict Mode bugs fixed in v12; import from `motion/react`; 120fps via WAAPI hybrid engine |
| `clsx` | ^2.1.1 | Conditional className string construction | 239B, zero deps, handles object/array/string inputs; standard pattern for Tailwind components |
| `tailwind-merge` | ^3.5.0 | Resolve Tailwind class conflicts when merging base + override classes | v3.x explicitly drops TW3 and adds TW4 support; prevents class collision bugs in component APIs |
| `class-variance-authority` | ^0.7.1 | Type-badge and card variant definitions | Enforces consistent variant structure for the 18 Pokemon types; works with clsx + tailwind-merge |

### Development Tools (Existing — No Changes Needed)

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint 9.35.0 | Code quality | Already configured |
| Prettier | Formatting | Already configured |

---

## The Central Problem: Dynamic Type Colors in Tailwind 4

This is the most technically important decision. The codebase already uses dynamic Tailwind class names via template literals:

```javascript
className={`bg-${type} bg-${type}-secondary border-${type}`}
```

Tailwind 4 (like v3) cannot detect dynamically constructed class names from template literals — the scanner only sees static strings. The project has **already solved this correctly** using `@source inline()` brace expansion in `App.css`. This is the right approach and should be preserved and extended.

### The Three Approaches (Evaluated)

**Approach A: `@source inline()` brace expansion** ← RECOMMENDED (already in use)

```css
/* App.css — already present, extend this */
@source inline("bg-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
@source inline("bg-{normal,fire,...}-secondary");
@source inline("border-{normal,fire,...}");

/* Add for dark theme overhaul: */
@source inline("ring-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
@source inline("text-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
@source inline("from-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
@source inline("to-{normal,fire,water,electric,grass,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dragon,dark,steel,fairy}");
```

**Confidence:** HIGH — this is the official Tailwind v4.1 mechanism, verified via tailwindcss.com docs.

**Approach B: CSS variable + inline style** ← Use for truly arbitrary/runtime-only values

When the color value itself is not knowable at build time (e.g., you want to feed a hex string from an API), set it as an inline CSS variable and reference it with an arbitrary Tailwind value:

```jsx
// Component
<div
  style={{ '--type-color': typeColorMap[type] }}
  className="bg-(--type-color)"  // Tailwind 4 shorthand for var()
>
```

This is particularly useful for gradient stops or opacity variants where you want `color-mix()` behavior but with a fully dynamic input.

**Confidence:** HIGH — verified via Tailwind v4 official blog announcement (color-mix, @property, CSS variable integration).

**Approach C: Inline style only** ← Do NOT use for this project

```jsx
// Anti-pattern for this codebase
<div style={{ backgroundColor: typeColors[type] }}>
```

Bypasses Tailwind entirely, breaks dark-mode variant cascading, removes responsive modifier support, and produces unmaintainable inconsistency with the rest of the codebase which is Tailwind-first. Avoid.

---

## Dark Mode Implementation

### Chosen Strategy: Class-based with `@custom-variant`

The project needs a manual dark mode toggle (dark is the default, not an OS preference). The Tailwind v4 approach is CSS-only — no JS config:

```css
/* App.css — add this */
@custom-variant dark (&:where(.dark, .dark *));
```

Then toggle the `dark` class on `<html>` from JS:

```javascript
// Add to root layout
document.documentElement.classList.add('dark'); // default: always dark
```

Since this app is always dark-themed (per PROJECT.md: "Dark-themed global design"), start with the class always present. A future toggle would flip it.

**Why class-based over system `prefers-color-scheme`:** The design brief says "dark-themed global design" — this implies a fixed dark aesthetic, not a system-responsive one. Class-based is the correct foundation even if a toggle is added later.

**Confidence:** HIGH — exact directive verified via tailwindcss.com/docs/dark-mode.

### Dark Theme Color Palette in `@theme`

Extend the existing `@theme` block in `App.css` with semantic dark-surface tokens:

```css
@theme {
  /* Existing type colors stay as-is */

  /* Add global dark theme tokens */
  --color-surface-base: #0f1117;       /* Page background */
  --color-surface-card: #1a1d27;       /* Card backgrounds */
  --color-surface-elevated: #242736;   /* Modals, dropdowns */
  --color-surface-muted: #2d3045;      /* Subtle dividers */
  --color-text-primary: #f1f5f9;       /* Main text */
  --color-text-secondary: #94a3b8;     /* Subdued text */
  --color-text-muted: #64748b;         /* Very subdued */
}
```

These become Tailwind utilities automatically (`bg-surface-base`, `text-text-primary`, etc.).

---

## The `cn` Utility Pattern

Every component should use a local `cn` helper to compose classes safely:

```javascript
// src/lib/cn.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

Usage:

```jsx
// Allows callers to override without class conflicts
const Card = ({ type, className }) => (
  <div className={cn('rounded-xl p-4', `bg-${type}`, className)} />
);
```

**Why both clsx AND tailwind-merge:** clsx handles conditional logic; tailwind-merge resolves which Tailwind class "wins" when the same property appears twice. Without tailwind-merge, `cn('p-4', 'p-6')` would produce `p-4 p-6` and the result would be unpredictable. With it, you get `p-6`.

---

## Animation Strategy with Motion

**Package:** `motion` (not `framer-motion` — that's the legacy package)
**Import:** `import { motion } from 'motion/react'`
**React 19 status:** Fully compatible as of v12; Strict Mode bugs fixed.

### What to animate

| Element | Animation | Motion primitive |
|---------|-----------|-----------------|
| Pokemon grid cards | `whileHover={{ scale: 1.03, y: -4 }}` | `motion.div` |
| Card entrance | `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` with stagger | `motion.div` + `transition.delay` |
| Stat bars | Width from 0 to value on mount | `motion.div` with `animate={{ width }}` |
| Page transitions | Fade between list and detail | `AnimatePresence` + `motion.div` |
| Type badge | Subtle pulse on hover | `whileHover={{ scale: 1.1 }}` |

### What NOT to animate

Do not animate every micro-interaction — this is a data browser, not a game. Excessive animation degrades perceived performance when rendering 1,025 cards. Use `initial={false}` on the grid wrapper to suppress entrance animations after the first render.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Animation | `motion` ^12 | `react-spring` | Motion has better layout animation support, more intuitive API for card hover effects; react-spring's physics model is overkill for this use case |
| Animation | `motion` ^12 | CSS transitions only | CSS alone can't do staggered entrance animations or AnimatePresence exit animations cleanly in React |
| Class construction | `clsx` + `tailwind-merge` | `classnames` | clsx is 60% smaller; classnames has no tailwind-merge equivalent |
| Component variants | `cva` | Manual conditionals | At 18 type variants + dark/light modifiers, manual ternaries become unmaintainable; cva provides a type-safe variant schema |
| Dynamic colors | `@source inline()` brace expansion | `safelist` in JS config | Tailwind v4 removed JS config safelist; `@source inline()` is the official v4 replacement |
| Dark mode library | `@custom-variant dark` (native Tailwind 4) | `next-themes` | This is not a Next.js project; next-themes adds unnecessary overhead to a plain Vite SPA |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `framer-motion` (old package) | Rebranded to `motion`; framer-motion is in maintenance mode for backward compat | `motion` ^12 |
| `next-themes` | Next.js-specific theme management; does not work correctly in a Vite+React Router SPA | Tailwind `@custom-variant dark` + vanilla JS `localStorage` |
| Styled-components / Emotion | Runtime CSS-in-JS; conflicts with Tailwind's utility model; adds ~15kb and a serialization cost per render | Stay Tailwind-only |
| Shadcn/UI | Component framework that imposes its own design system — would require rewriting all existing components and imposing Radix UI primitives | Build bespoke components directly in Tailwind |
| Tailwind `safelist` (v3 JS config) | Removed in v4; does not exist in tailwind.config.js in this project | `@source inline()` directive in CSS |
| Arbitrary inline hex colors | `style={{ backgroundColor: '#e62729' }}` breaks dark mode cascade, defeats Tailwind, unmaintainable | CSS variables in `@theme` + Tailwind utility classes |

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `motion@^12.34.3` | React ^18.2 / 19.x | Confirmed React 19 Strict Mode fixes in v12 |
| `tailwind-merge@^3.x` | tailwindcss ^4.x | v3 explicitly drops TW3 support; use v2 only with TW3 |
| `tailwind-merge@^3.x` | tailwindcss ^4.0–4.2 | Per npm release notes |
| `clsx@^2.1.1` | Any | No framework dependency |
| `class-variance-authority@^0.7.1` | Any | Works with JS (no TypeScript required); last stable release |

---

## Installation

```bash
# Animation
npm install motion

# Class construction utilities
npm install clsx tailwind-merge class-variance-authority
```

No dev dependencies needed — all are runtime.

---

## Patterns by Scenario

**If a type color must be used as a Tailwind utility class (most cases):**
- Declare the class pattern in `@source inline()` in `App.css`
- Use template literal: `className={`bg-${type}`}`

**If a type color must be used for a CSS property with no Tailwind utility (e.g., box-shadow color, SVG fill):**
- Use CSS variable shorthand: `className="shadow-(--type-primary)"` after setting `style={{ '--type-primary': typeColorMap[type] }}`
- Or write a custom utility in `@layer utilities` in `App.css`

**If building a reusable component that accepts className overrides:**
- Use the `cn()` helper: `cn('base-classes', `type-${type}`, className)`

**If the dark theme baseline requires the `dark` class always applied:**
- Set it once in `src/main.jsx` or `index.html`: `document.documentElement.classList.add('dark')`
- A future toggle just removes/adds the class, no React state required

---

## Sources

- https://tailwindcss.com/docs/dark-mode — @custom-variant dark directive (HIGH confidence)
- https://tailwindcss.com/blog/tailwindcss-v4 — @theme, CSS variables, @property, color-mix() (HIGH confidence)
- https://blakejones.dev/blog/how-to-make-a-safelist-in-tailwind-v4.1+/ — @source inline brace expansion syntax (MEDIUM confidence; matches official docs)
- https://github.com/tailwindlabs/tailwindcss/discussions/15291 — Safelist in v4 community discussion (MEDIUM confidence)
- https://motion.dev/docs/react-upgrade-guide — motion package name, React 19 compat (HIGH confidence)
- npm registry search — motion@12.34.3, tailwind-merge@3.5.0, clsx@2.1.1, class-variance-authority@0.7.1 (HIGH confidence)
- https://cva.style/docs — CVA variant API (MEDIUM confidence; stable API, version is 0.7.1 as of 2026-02-27)

---

*Stack research for: PokeAPI Browser UI Overhaul — dark theme + type-colored dynamic theming*
*Researched: 2026-02-27*
