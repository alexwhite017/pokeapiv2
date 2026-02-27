# External Integrations

**Analysis Date:** 2026-02-27

## APIs & External Services

**PokéAPI:**
- PokeAPI REST API (https://pokeapi.co/api/v2) - Primary data source for all Pokemon data
  - SDK/Client: Fetch API (native browser)
  - Auth: None (public API)
  - Usage: Complete Pokemon application relies entirely on this API

## Data Sources

**PokéAPI Endpoints Used:**
- `https://pokeapi.co/api/v2/pokemon?limit=1025` - Fetch all Pokemon list (Home page)
- `https://pokeapi.co/api/v2/pokemon/{name}` - Fetch individual Pokemon data (Details page)
- `https://pokeapi.co/api/v2/pokemon-species/{id}` - Fetch species information for dex entries
- `https://pokeapi.co/api/v2/evolution-chain/{id}` - Fetch evolution chain data
- `https://pokeapi.co/api/v2/type/{type}` - Fetch Pokemon by type for filtering
- `https://pokeapi.co/api/v2/move/{move}` - Fetch move details for learn set display

**Image Hosting:**
- Raw GitHub (https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/) - Pokemon sprite images
  - Used in `src/components/Results.jsx` for Pokemon cards
  - Standard format: `{id}.png` for regular sprites

## Data Storage

**Databases:**
- None - Client-side only, no persistent storage

**File Storage:**
- Local filesystem only - Cache sprites via browser HTTP caching
- No CDN or external file storage configured

**Caching:**
- Browser HTTP caching for sprite images
- No server-side caching configured
- No caching headers controlled by application

## Authentication & Identity

**Auth Provider:**
- None - Public API, no authentication required
- PokeAPI does not require API keys or credentials

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console logging only via browser developer tools
- No external logging service

## CI/CD & Deployment

**Hosting:**
- Not configured - Intended for static hosting (Vite SPA)
- Builds to `dist/` directory for deployment

**CI Pipeline:**
- None detected

## Environment Configuration

**Required env vars:**
- None - All API endpoints are hardcoded
- `.env` file exists but appears unused

**Secrets location:**
- No secrets in use
- `.env` file listed in `.gitignore` but contains no sensitive data references

## Webhooks & Callbacks

**Incoming:**
- None - Purely client-side application

**Outgoing:**
- None - Read-only interaction with PokeAPI

## Network Behavior

**API Calls Made:**
1. **List View (Home/Sort pages):**
   - Single fetch to `/pokemon` or `/type/{type}` endpoints
   - Filters response client-side for search functionality
   - Sprites fetched individually from GitHub via img tags

2. **Details View:**
   - Three sequential fetches:
     1. `/pokemon/{name}` - Basic stats and moves
     2. `/pokemon-species/{id}` - Species/dex data
     3. `/evolution-chain/{id}` - Evolution information
   - Move details fetched via Promise.all in parallel from `/move/{name}` endpoints
   - Machine (TM) data fetched via machine.url from moves

3. **Move Lists:**
   - Parallel fetches to `/move/{move}` for all moves in learn set
   - Additional machine data fetches for TM items
   - Sorting by generation and TM number

## Data Dependencies

**Critical Dependencies:**
- PokeAPI availability - Complete application failure if API is down
- GitHub raw content CDN availability - Sprites fail to load if GitHub is down
- Network connectivity - All functionality requires internet connection

---

*Integration audit: 2026-02-27*
