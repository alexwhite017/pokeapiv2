# Technology Stack

**Analysis Date:** 2026-02-27

## Languages

**Primary:**
- JavaScript (JSX) - React components and frontend logic
- CSS - Styling alongside Tailwind CSS

## Runtime

**Environment:**
- Node.js v22.22.0
- npm v10.9.4

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.1.1 - UI framework and component library
- React Router 7.9.1 - Client-side routing for navigation between Home, Details, and Sort pages

**Styling:**
- Tailwind CSS 4.1.13 - Utility-first CSS framework for responsive design
- @tailwindcss/vite 4.1.13 - Vite plugin for Tailwind CSS compilation

**Build/Dev:**
- Vite 7.1.6 - Frontend build tool and development server
- @vitejs/plugin-react 5.0.2 - React plugin for Vite providing JSX support

## Key Dependencies

**Critical:**
- react@19.1.1 - Core UI library for component-based rendering
- react-dom@19.1.1 - React DOM rendering target
- react-router@7.9.1 - Essential for app navigation between pages

**Infrastructure:**
- vite@7.1.6 - Build system and dev server
- @vitejs/plugin-react@5.0.2 - React JSX transform support
- tailwindcss@4.1.13 - CSS utility classes for responsive styling

## Development Tools

**Linting:**
- eslint@9.35.0 - Code quality checker
- @eslint/js@9.35.0 - ESLint core rules
- eslint-plugin-react-hooks@5.2.0 - Rules for React Hooks usage
- eslint-plugin-react-refresh@0.4.20 - Rules for React refresh compatibility

**Type Support:**
- @types/react@19.1.13 - TypeScript definitions for React
- @types/react-dom@19.1.9 - TypeScript definitions for React DOM

**Utilities:**
- globals@16.4.0 - Global variable definitions for ESLint

## Configuration

**Environment:**
- `.env` file present (listed in `.gitignore` - contains environment configuration)
- No environment variables required for basic functionality - all API calls use hardcoded URLs

**Build:**
- `vite.config.js` - Vite configuration with React and Tailwind CSS plugins
- `eslint.config.js` - ESLint configuration with React and hooks support
- `.prettierrc` - Prettier formatting config (empty, uses defaults)

**Entry Point:**
- `index.html` - HTML entry point that loads React app
- `src/main.jsx` - React DOM root initialization with React Router setup

## Platform Requirements

**Development:**
- Node.js v22.22.0 or compatible
- npm v10.9.4 or higher
- Modern browser with ES2020 JavaScript support

**Production:**
- Static file hosting (Vite builds to `dist/` directory)
- No backend server required - client-side only application
- Modern browser support (ES2020 compatible)

---

*Stack analysis: 2026-02-27*
