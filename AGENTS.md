# AGENTS.md

## Package Manager

**Always use `npm`.** Never use `pnpm` or `yarn`.

```bash
npm install           # install deps
npm run dev           # start Vite dev server
npm run build         # type-check (tsc -b) + production build
npm run preview       # preview production build
npm run lint          # lint via oxlint
npm run og            # regenerate public/og-image.png and apple-touch-icon.png
```

## Stack

- **Framework** - React 19, client-side SPA (no SSR, no router)
- **Build** - Vite 8
- **Styling** - Tailwind CSS v4 + CSS variable theme tokens
- **UI primitives** - local components in `src/components/ui/` built with Radix UI where needed
- **State** - Zustand (with Immer) in `src/stores/`
- **Forms** - React Hook Form + Zod
- **Editor / rendering** - Monaco editor, react-markdown
- **Icons** - Lucide React
- **Notifications** - Sonner
- **Linting** - oxlint
- **Language** - TypeScript 6
- **Deploy** - Docker: Node build stage, nginx serves `dist/` with SPA fallback

## Project Structure

```
scripts/
  og/                 # OG image template + generator (npm run og)
public/               # static assets served from `/` (favicon, og-image, robots, manifest)
src/
  main.tsx            # entry point
  app.tsx             # app shell
  index.css           # global styles and theme tokens
  components/
    AGENTS.md         # source of truth for UI component rules
    ui/               # local reusable UI primitives
  constants/          # themes, fonts, layouts, AI providers, starter deck
  hooks/              # shared hooks
  http/               # AI provider clients (Claude, Gemini, OpenAI) and errors
  lib/                # utilities like `cn()`, slide parser/layout, AI client
  prompts/            # AI prompt templates
  skills/             # bundled skill files
  stores/             # Zustand stores
dist/                 # build output
README.md             # project overview
DESIGN.md             # product design system and layout guidance
CLAUDE.md             # points agents back to this file
```

## Path Aliases

`@/*` maps to `./src/*` (set in `tsconfig.app.json` and `vite.config.ts`).

## Design Reference

For UI, layout, styling, and visual refinement work, read and follow `@DESIGN.md` before making changes.

## SEO / Social Metadata

- All meta tags (description, Open Graph, Twitter card, theme-color, canonical) live statically in `index.html`; the app has no SSR or head manager.
- Production domain is `https://slidown.dev`. `og:image`, `twitter:image` and `canonical` use absolute URLs on it.
- `public/og-image.png` (1200x630) is generated from `scripts/og/template.html` by `npm run og`. The PNG is committed. Rerun the script and commit it whenever branding, tagline or theme colors change.
- `public/favicon.svg` is a copy of `src/assets/favicon.svg`. Keep them in sync, then rerun `npm run og` to refresh `apple-touch-icon.png`.
- nginx caches `.png` for a year (immutable). If the OG image changes, rename the file or append a version query to the URLs in `index.html` so social platforms and browsers refetch it.
- `npm run og` needs a browser for Playwright: `npx playwright install chromium`, or it falls back to installed Edge/Chrome.

## Key Conventions

- Reusable UI belongs in `src/components/ui/`.
- Component rules for `src/components/ui/` live in `src/components/AGENTS.md` and must be followed.
- Use `cn()` from `src/lib/utils.ts` for class merging.
- Use semantic Tailwind tokens like `bg-background`, `text-foreground`, `border-border`, and `ring-ring` instead of hardcoded colors in components.
- Prefer Radix primitives for accessibility-sensitive controls such as menus, popovers, and selects.
- Use named exports only. No default exports in shared components.
- Write functions as `function fn() {}` declarations, not `const fn = () => {}`. Applies to
  components, hooks, and standalone utilities. Inline one-off callbacks
  (e.g. `array.map((x) => ...)`, `onClick={() => ...}`) are unaffected — this rule targets named
  function definitions, not throwaway callback expressions.
- oxlint is the linter. Do not add ESLint, Biome or Prettier config.

## Documentation Rules

- Keep `DESIGN.md` updated when product visual language, layout rules, or token strategy changes.
- Keep this file updated when stack, scripts, or folder structure changes.
- Keep `CLAUDE.md` as a pointer file only.
