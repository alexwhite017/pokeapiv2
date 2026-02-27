# Feature Research

**Domain:** Pokédex / Pokémon data browser UI — dark-themed, type-color-driven redesign
**Researched:** 2026-02-27
**Confidence:** HIGH (codebase analysis) / MEDIUM (UI pattern research via web)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist in any polished Pokédex app. Missing these makes the product feel broken or unfinished.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Dark global background | Every modern enthusiast app ships dark by default; a white background in a type-color-driven Pokédex feels like a prototype | LOW | Base `bg-gray-900` or `bg-zinc-900` body, off-white text. Avoid pure #000000 — increases halation and makes text harsh. Use charcoal #121212–#1e1e1e. |
| Type-colored card backgrounds | The canonical "Saepul Nahwan" Dribbble design made this the genre convention — every major Pokédex redesign uses it. Users arriving from any reference app expect it. | LOW | Already partially implemented (class `bg-${type}`). Needs to be the full card background, not just a badge. |
| Official artwork as card hero | Every premium Pokédex shows the official-artwork sprite prominently, not the 96×96 pixel sprite. | LOW | `sprites/pokemon/other/official-artwork/{id}.png` already fetched on details page. Grid cards currently use pixel sprite — needs upgrading. |
| Type badges on card | Users expect to scan type from the grid without clicking. Badge = pill-shaped colored element with type name. | LOW | Already rendered on detail page. Not on grid cards. |
| Dex number visible on card | Standard convention — shown as `#001` format, often as a secondary element (top-left or bottom-right). | LOW | Already extracted via URL. Needs consistent `#NNN` format with zero-padding. |
| Pokémon name in readable type on card | Readable name with proper capitalization is expected on every card. | LOW | Already present but needs capital-first, hyphen-handled formatting (e.g., "Charizard" not "charizard"). |
| Stat bars with stat labels and numeric values | PokemonDB has established this as the standard — labeled horizontal bars, stat names left-aligned, numbers right-aligned. | LOW | StatGraph.jsx already does bars but the implementation is crude. Polish needed: rounded corners, consistent height, readable label area. |
| Color-coded stat bars by stat quality | PokemonDB convention: bars shift color based on stat value (red = weak, orange = mediocre, yellow = average, green = good, teal/blue = exceptional). This is expected by anyone who has used pokemondb.net. | LOW | Currently uses per-stat flat colors (HP=green, ATK=yellow, etc.). Should change to quality-based coloring. Thresholds: <30 red, 30-59 orange, 60-89 yellow, 90-119 lime, 120-149 green, 150+ teal. |
| Move table columns: Level/TM#, Name, Type, Category, Power, Accuracy, PP | Every major Pokédex app uses exactly these 7 columns. The convention is locked in. | LOW | Already implemented. Needs visual polish (dark rows, sticky header, type badges in cells). |
| Type badge styling as pill (fully rounded) | The pill shape is the genre convention for type labels — not a square, not a rectangle with mild radius. | LOW | Current badges use `rounded` (mild radius). Should use `rounded-full` or `px-2 py-0.5 rounded-full` pill. |
| Hover state on grid cards | Users expect visual feedback that a card is interactive. Scale + shadow shift is the standard. | LOW | Not present in current grid cards. `hover:scale-102 hover:shadow-xl transition-transform duration-200` is the pattern. |
| Loading states that don't show blank content | Users expect skeleton shapes or a spinner, not just "Loading..." text. | MEDIUM | Current implementation shows plain text. Skeleton card shapes (matching card proportions) are the premium pattern. |
| Readable contrast on type-colored surfaces | Type colors like Electric (#F7D02C, bright yellow) require dark text; dark types like Ghost (#735797) allow white text. Unreadable text is a show-stopper. | MEDIUM | Requires per-type text color decisions. Most vibrant types need dark text. Needs audit of all 18 types. |

---

### Differentiators (Competitive Advantage)

These are patterns that separate a polished enthusiast Pokédex from a generic one. Not expected, but noticed and valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Type color bleeds into full detail page | Detail page background, section headers, and accent elements all derive from the Pokémon's primary type — the entire page feels "owned" by that type. Most reference apps only tint the sidebar. Making the whole page breathe the type identity is the differentiator. | MEDIUM | Requires propagating `type` down to page root, using opacity variants for large backgrounds (`bg-fire/10`), and full-saturation accents for UI elements. |
| Large Pokédex number as decorative watermark on card | Displaying `#001` in very large, low-opacity text behind or overlaid on the card creates visual depth. Common in high-polish Pokédex Dribbble designs. Adds premium feeling at near-zero cost. | LOW | CSS: absolute-positioned, large font, low opacity (5–15%), overflow hidden on card container. |
| Artwork bleeds or floats above card bounds | The artwork image slightly overlaps the top of the card or extends past the bottom (clipped by container overflow). Creates a sense of depth and energy that "flat within the card box" doesn't achieve. | MEDIUM | Requires negative margin or absolute positioning on the artwork div. Overflow visible on card but clipped at grid level. Risk: layout complexity at small breakpoints. |
| Section headers inherit type color as accent | Move table headers, stat section headers, and info section headers use the type color as a left border accent or background tint — not a generic blue or gray. | LOW | Use `border-l-4 border-${type}` with a subtle `bg-${type}/10` background on section headers. |
| Shiny artwork toggle with visual distinction | Showing the shiny variant with a star or sparkle indicator, not just a tab label. Indicates "this is special." | LOW | Shiny tab already implemented. Add a star icon (`✦`) or sparkle badge to the toggle button. Low effort, high craft signal. |
| Smooth skeleton-to-content transition | Cards appear with a shimmer placeholder that cross-fades to real content when images load. Creates a sense of performance and polish without actual speed gains. | MEDIUM | Requires tracking per-card image load state. `onLoad` handler to trigger opacity transition from 0→1. |
| Type filter buttons visually match type color system | Filter buttons in the SearchBar already use type colors but with a hard ring outline on active state. A more polished approach: active type gets a slight inset shadow and brightness boost, not just a black ring. | LOW | Replace `ring-2 ring-black` with `ring-2 ring-white/50 brightness-110 shadow-inner`. |
| Prev/Next Pokémon navigation on detail page | Navigating between adjacent Pokémon without returning to the grid. PokemonDB uses left/right arrows. Most Dribbble reference designs include this as a signature gesture. | MEDIUM | Requires knowing adjacent Pokémon IDs. Currently the app fetches all 1025 names on details page for search — this data is already available to derive prev/next IDs. |
| Stat total with quality indicator | Showing the base stat total with a color or label indicating whether it's low/average/high for the franchise (e.g., below 400 = red, 400–500 = yellow, 500+ = green). | LOW | Simple threshold comparison, one additional line in StatGraph.jsx. |
| Move type badge colors match type system | Already implemented. The differentiator is ensuring move type badges in tables use identical styling to type badges on cards — not a slightly different shade or radius. | LOW | Design consistency, not new functionality. Audit both badge implementations for class parity. |
| Category badge icons (physical/special/status) | Using category icons (sword for physical, swirl for special, circle for status) rather than text labels. PokemonDB uses icons from their custom sprite sheet. Community convention is the orange/blue/gray color system (physical=#EB5529, special=#375AB2, status=#828282). | MEDIUM | Category icon images are not currently in the project. Text-only category badges are acceptable table stakes; icon badges are a differentiator. SVG icons can be inlined. |

---

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem valuable but would actively harm the design or scope.

| Anti-Feature | Why Requested | Why Problematic | Alternative |
|--------------|---------------|-----------------|-------------|
| Pure black (#000000) background | Feels maximally "dark" | Increases halation — white text on pure black creates a glow effect that strains eyes. Also makes type color cards look harsh rather than rich. | Use #111827 (gray-900) or #18181b (zinc-900) — dark enough to feel immersive, soft enough to preserve color vibrancy. |
| Overcrowded card information | Users ask for more data per card (abilities, stats preview, type effectiveness) | Defeats the grid's purpose as a fast-scan interface. Stat previews in particular add visual noise without enabling action. Users click through to see stats. | One artwork, one name, one dex number, two type badges maximum. Everything else lives on the detail page. |
| Animation-heavy hover effects (rotation, flip, 3D tilt) | Holographic card effects exist (simeydotme/pokemon-cards-css) and look impressive in demos | Performance cost on 1025-item grid is significant. 3D tilt requires JS per card. Creates visual fatigue at scale. | Stick to CSS-only scale + shadow transitions. `hover:scale-[1.03] transition-all duration-200` — imperceptible on a single card, smooth at grid scale. |
| Infinity scroll / pagination for the grid | Common in generic data browsers | The Pokédex has a fixed, known universe of 1025 Pokémon. Pagination fragments the browsing experience. Users come to Pokédex apps to scan the whole collection. | Keep all 1025 loaded. The performance is acceptable (all data loaded in one API call already). Skeleton loading handles the initial perceived wait. |
| Light/dark theme toggle | Users often request theme toggles | Adds complexity to the type-color system: every type color has to work in both light and dark contexts. The PROJECT.md explicitly chose dark as the design direction. | Dark only. The type-color-as-hero works best on dark surfaces. Diluting this with a light toggle dilutes the core value proposition. |
| Pokéball decorative animation on the SearchBar | The current SearchBar has a Pokéball-themed header (blue circle, colored dots) but it reads as decorative noise rather than useful UI | The Pokéball metaphor works for card catch-state mechanics (see outsidethebocz.com), not for a search input. It makes the search area feel like a toy. | Clean search bar on dark surface. Type filter buttons ARE the Pokémon-branded element in the search area — they don't need a Pokéball wrapper. |
| Wikipedia/encyclopedia layout for detail page | Dense tables and maximum data density for power users | Fights the visual hierarchy goal. Dense table-on-table layouts with no visual breathing room is the current problem, not a solution. | Clear section separation with generous padding (py-6 or py-8 between sections), section titles with visual weight, collapsible sections if needed. |
| Displaying all move learn methods (egg moves, tutor moves, etc.) at once | Comprehensive Pokédex data | The current UI already has a complex gen-select dropdown per table. Adding egg moves and tutor move tables would create 4 competing tables. Scope explosion for a UI redesign. | Keep level-up and TM as the two move tables. The redesign doesn't add data, it improves presentation of existing data. |

---

## Feature Dependencies

```
Dark global background
    └──enables──> Type color cards feel premium (colors only pop on dark, not white)
                      └──enables──> Full-page type theming on detail page
                                       └──enables──> Section headers with type accent colors

Official artwork on grid cards
    └──requires──> Consistent card height (artwork is portrait-oriented and needs a fixed container)
                       └──requires──> CSS aspect-ratio or fixed height container on card

Type badges (pill shape)
    └──enhances──> Move type badges in tables (same component, same styling)
    └──enhances──> Type filter buttons in SearchBar (same color system)

Color-coded stat bars (quality-based)
    └──conflicts with──> Per-stat flat colors (current statColors.js) — must choose one approach
                         (Quality-based coloring is more universally useful and aligns with pokemondb convention)

Skeleton loading
    └──requires──> Stable card dimensions before content loads (if cards change size on load, skeleton is misleading)
                       └──requires──> Fixed card height/aspect-ratio

Prev/Next navigation
    └──requires──> allPokemonData array accessible in PokemonDetails component (already fetched — just unused for this purpose)
```

### Dependency Notes

- **Dark background enables type colors:** Type colors like Fire (#EE8130) and Grass (#7AC74C) feel muted on white but vivid and premium on `bg-zinc-900`. The entire color strategy depends on this foundation being in place first.
- **Card height consistency required for artwork:** The official artwork sprites are portrait-oriented (475×475 to 475×475). Without a fixed container height, cards in a flex grid will have different heights, breaking the grid's visual alignment.
- **Stat bar approach is mutually exclusive:** The current `statColors.js` assigns a fixed color per stat (HP=green, ATK=yellow, DEF=orange). Quality-based coloring (low=red, high=teal) is incompatible — a new implementation replaces the old. Choosing quality-based wins on UX (it's more informative) and aligns with the industry standard.
- **Type badge consistency across contexts:** The same type badge component should be used on cards, on the detail page, and in move tables. Currently the badge is rendered inline in multiple places with slight class variations. A shared `TypeBadge` component eliminates drift.

---

## MVP Definition

This is a redesign, not a greenfield project. "MVP" here means: the minimum visual overhaul that achieves the stated goal (immersive dark-themed, type-color-driven Pokédex).

### Launch With (v1 — Core Visual Overhaul)

These are the changes that transform the app from generic to premium. Without all of them, the redesign is incomplete.

- [ ] **Dark global background** — The entire app background shifts to `bg-zinc-900` or equivalent. Header, page backgrounds, container backgrounds all dark. This is the foundation everything else builds on.
- [ ] **Type-colored card backgrounds with official artwork** — Grid cards get `bg-${type}` full background, official artwork (not pixel sprite) as the visual hero, name, dex number, and type badges.
- [ ] **Pill-shaped type badges** — Replace `rounded` with `rounded-full` on all type badge instances. Consistent sizing and padding across card, detail page, and move tables.
- [ ] **Detail page full-type-color theming** — The entire detail page background and section containers reflect the Pokémon's primary type. Not just the sidebar — the whole page.
- [ ] **Polished stat bars** — Quality-based coloring (threshold system), consistent height (h-2 or h-3), rounded corners, stat name and number in a consistent label area, adequate row spacing.
- [ ] **Move table dark styling** — Tables adopt the dark theme: dark header background with type accent, alternating dark/darker row stripes instead of gray-100/gray-200, readable text.
- [ ] **Hover state on grid cards** — `hover:scale-[1.03] hover:shadow-2xl transition-all duration-200` on card containers.

### Add After Core Is Done (v1.x — Polish Pass)

- [ ] **Large dex number watermark on cards** — Decorative, low-effort, high impact on premium feel.
- [ ] **Section header type-accent borders** — Left border on each section title using `border-l-4 border-${type}`.
- [ ] **Skeleton loading for grid cards** — Shimmer placeholder matching card proportions during initial load.
- [ ] **Prev/Next Pokémon navigation** — Left/right arrows on detail page using existing `allPokemonData`.
- [ ] **Type filter active state refinement** — Replace `ring-black` with `ring-white/70` for active type buttons.

### Future Consideration (v2+)

- [ ] **Category icons in move tables** — SVG icons for Physical/Special/Status. Needs custom icon assets.
- [ ] **Artwork float/bleed effect** — Artwork overlapping card edge for depth. Layout complexity risk at mobile.
- [ ] **Smooth skeleton-to-content crossfade** — Per-card `onLoad` state tracking. More complex than it appears.

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Dark global background | HIGH | LOW | P1 |
| Type-colored card backgrounds | HIGH | LOW | P1 |
| Official artwork on grid cards | HIGH | LOW | P1 |
| Pill-shaped type badges | HIGH | LOW | P1 |
| Detail page type theming | HIGH | MEDIUM | P1 |
| Polished stat bars (quality colors) | HIGH | LOW | P1 |
| Move table dark styling | HIGH | LOW | P1 |
| Card hover state | MEDIUM | LOW | P1 |
| Large dex number watermark | MEDIUM | LOW | P2 |
| Section accent borders | MEDIUM | LOW | P2 |
| Skeleton loading | MEDIUM | MEDIUM | P2 |
| Prev/Next navigation | MEDIUM | MEDIUM | P2 |
| Category icons in move tables | LOW | MEDIUM | P3 |
| Artwork bleed/float | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Required for the redesign to achieve its stated goals
- P2: Adds meaningful polish, implement after P1 is stable
- P3: Nice to have, only if scope allows

---

## Competitor / Reference Analysis

| Feature | pokemondb.net | Saepul Nahwan Dribbble design | Our Approach |
|---------|---------------|-------------------------------|--------------|
| Background | Light white/gray | Light with type-color gradient | Dark (`bg-zinc-900`) |
| Card background | White card with type-colored name strip | Full type-color card background | Full type-color card background |
| Artwork on card | Small thumbnail | Large, prominent, slightly overflowing | Large, contained within card, official artwork |
| Type badges | Pill-shaped, linked to type page | Pill-shaped, inside card | Pill-shaped, same component everywhere |
| Stat bars | Horizontal, quality-based color thresholds (6-step) | Horizontal, type-colored | Horizontal, quality-based (pokemondb convention) |
| Stat labels | Short abbreviations (HP, Atk, Def, SpA, SpD, Spe) | Not shown | Short abbreviations with numeric value right-aligned |
| Move table | 7 columns, sticky header, alternating rows | Not shown in design | 7 columns, dark alternating rows, sticky header with type color |
| Detail layout | Single-column, dense | Split: artwork left, data right | Split: artwork/info sidebar left, sections right on desktop |
| Dex number treatment | Small, secondary | Large decorative watermark | Large decorative watermark on card |

**Reference apps worth studying:**

- **pokemondb.net** — The industry-standard data reference. Stat bar color thresholds are the convention that Pokémon players expect. Move table column structure is canonical.
- **Saepul Nahwan's Dribbble Pokédex design** (dribbble.com/shots/6545819-Pokedex-App) — The most widely copied Pokédex UI design. Established type-color-as-card-background as the convention. Light theme but the card layout DNA is what makes it work.
- **simeydotme/pokemon-cards-css** (github.com/simeydotme/pokemon-cards-css) — Shows what holographic effects are possible but also demonstrates the over-engineering trap to avoid for a 1025-item grid.
- **outsidethebocz.com/pokedex.html** — Strong example of rounded card + hover interaction pattern on a dark background.

---

## Sources

- pokemondb.net stat bar color threshold system: [What do the colors mean for the stat bars on Pokebase?](https://pokemondb.net/pokebase/meta/76184/what-do-the-colors-mean-for-the-stat-bars-on-pokebase)
- Pokémon type hex color values: [pokemon-type-colours.js gist](https://gist.github.com/apaleslimghost/0d25ec801ca4fc43317bcff298af43c3)
- Saepul Nahwan Pokédex Dribbble design: [Pokedex App by Saepul Nahwan](https://dribbble.com/shots/6545819-Pokedex-App)
- Dark UI design principles: [The Principles of Dark UI Design (Toptal)](https://www.toptal.com/designers/ui/dark-ui-design)
- Card grid spacing patterns: [Spacing & Alignment in UI: Creating Visual Rhythm and Breathing Room](https://www.designsystemscollective.com/spacing-alignment-in-ui-creating-visual-rhythm-and-breathing-room-2c382b112272)
- Badge/pill component patterns: [Badges vs. Pills vs. Chips vs. Tags](https://smart-interface-design-patterns.com/articles/badges-chips-tags-pills/)
- CSS card hover effects: [10 Card UI Design Examples That Actually Work in 2025](https://bricxlabs.com/blogs/card-ui-design-examples)
- Responsive grid: [A Deep Dive Into CSS Grid minmax()](https://ishadeed.com/article/css-grid-minmax/)
- Skeleton loading: [Skeleton loading screen design](https://blog.logrocket.com/ux-design/skeleton-loading-screen-design/)
- CSS grid responsive patterns: [Fastest way to make a responsive card grid with CSS](https://zoaibkhan.com/blog/fastest-way-to-make-a-responsive-card-grid-with-css/)
- pokemondb.net Bulbasaur page (direct analysis): [pokemondb.net/pokedex/bulbasaur](https://pokemondb.net/pokedex/bulbasaur)
- outsidethebocz.com Pokédex design reference: [Pokedex | Outside the Bocz Portfolio](https://outsidethebocz.com/pokedex.html)
- Dark mode 2025 UX tips: [Dark Mode UX 2025](https://www.influencers-time.com/dark-mode-ux-in-2025-design-tips-for-comfort-and-control/)
- Codebase analysis: `/Users/alex/Documents/Programming/Personal/pokeapi-r2/src/` (direct source read)

---
*Feature research for: Pokédex/Pokémon browser UI — dark theme + type color redesign*
*Researched: 2026-02-27*
