# Binit Portfolio Agent Context

This document is the source of truth for agents working in `apps/web`.
It explains how the project is organized, what each folder does, and how to make safe changes.

## Project Snapshot

- Monorepo toolchain: `pnpm` workspaces + `turbo`.
- Main app: `apps/web` (Next.js App Router, Tailwind v4, Turbopack).
- Shared package: `packages/ui` (design tokens + utility helpers).
- TypeScript setup is shared through `@repo/config-typescript`.

## Repository Layout

- `package.json` (repo root)
  - Orchestrates workspace scripts: `dev`, `build`, `lint`, `type-check`.
  - Must keep `packageManager` present for Turbo workspace resolution.
- `pnpm-workspace.yaml`
  - Defines workspace roots: `apps/*` and `packages/*`.
- `turbo.json`
  - Pipeline for `build`, `dev`, `lint`, `type-check`.
  - `dev` is persistent and uncached.

### App: `apps/web`

- `app/layout.tsx`
  - Global shell for every route.
  - Loads fonts, global CSS, the navbar, and wraps tree with theme provider.
- `app/globals.css`
  - CSS entrypoint for Next app.
  - Imports `tailwindcss`, `tw-animate-css`, and shared tokens from `@repo/ui/styles/globals.css`.
- `app/page.tsx`
  - Home route.
- `app/about/page.tsx`
  - About route.
- `app/work/page.tsx`
  - Work route.
- `app/writings/page.tsx`
  - Writings index route.
- `app/writings/[slug]/page.tsx`
  - Dynamic writing route.
  - Uses `generateStaticParams` and `generateMetadata`.
  - Reads post data via `@/lib/writings`.
- `components/navbar.tsx`
  - Top navigation with active route highlighting.
  - Client component; uses Skiper `ThemeToggleButton` from `packages/ui` (see `skiper-ui/skiper26.tsx`).
- `components/theme-provider.tsx`
  - Thin client wrapper around `next-themes` provider.
- `lib/writings.ts`
  - In-memory data helpers for writings (`getAllWritings`, `getWritingBySlug`).
  - Current state is placeholder content until real MD/MDX file loading is added.
- `tsconfig.json`
  - Path aliases:
    - `@/*` -> app-local imports
    - `@repo/ui/*` -> direct source imports from shared UI package
- `postcss.config.mjs`
  - Tailwind v4 PostCSS plugin setup.
- `package.json`
  - Next app dependencies and scripts.

### Shared Package: `packages/ui`

- `src/styles/globals.css`
  - Theme tokens and semantic CSS variables (`--background`, `--foreground`, etc.).
  - Includes `@custom-variant dark` and Tailwind `@theme inline` mappings.
- `src/lib/utils.ts`
  - Utility exports such as `cn`.
- `package.json`
  - Exposes `./styles/*` path used by web app (`@repo/ui/styles/globals.css`).

## Styling and Theme Rules

- Tailwind v4 import order in `app/globals.css` must remain:
  1. `@import "tailwindcss";`
  2. `@import "tw-animate-css";`
  3. `@import "@repo/ui/styles/globals.css";`
- If a CSS import is referenced in `apps/web`, dependency must exist in `apps/web/package.json` too.
- Dark mode is class-based (`next-themes` + `attribute="class"`).

## Rendering and SEO

- Prefer **Server Components** by default (`app/*` routes and most of `components/*` with **no** `"use client"`).
- Ship **server-rendered HTML** for page content, headings, and navigation chrome whenever possible so crawlers and social previews see real text and structure without waiting on JavaScript.
- Add `"use client"` only when the component truly needs the browser (state, effects, browser APIs, event handlers, or libraries that require the client such as `next-themes`, Framer Motion, or route hooks like `usePathname`).
- When interactivity is required, split work: keep a **server** parent for layout and SEO-critical copy, and colocate a **small client** child for the interactive island.

## Navigation and Route Conventions

- Navbar items should match real pages to avoid dead links.
- Current top-level routes:
  - `/`
  - `/about`
  - `/work`
  - `/writings`
- Add route-level metadata with:
  - `import type { Metadata } from "next";`
  - `export const metadata: Metadata = { ... }`

## Commands and Validation

From repo root:

- `pnpm dev` -> runs `turbo dev`.
- `pnpm build` -> production build for workspaces.
- `pnpm lint` -> lint web app via Turbo pipeline.
- `pnpm type-check` -> type-check pipeline (currently minimal).

When changing UI/layout/theme, always run:

1. `pnpm build`
2. `pnpm lint`

## Known Operational Gotchas

- Duplicate dev server can happen when an old Next process remains alive.
  - Symptom: `Another next dev server is already running`.
  - Fix: kill the PID shown by Next, then rerun `pnpm dev`.
- Missing import modules in app code often come from workspace-local dependency ownership.
  - If `apps/web` imports a package directly, add it to `apps/web/package.json`.

## Change Discipline for Agents

- Keep changes scoped and reversible.
- Prefer editing files in `apps/web` unless shared behavior belongs in `packages/ui`.
- Do not remove existing route metadata unless replacing with better metadata.
- **Default to server-rendered components** for new UI; reserve the client boundary for interactivity or third-party constraints (see **Rendering and SEO** above).
- For new client components that depend on browser APIs, always include `"use client"`.
- Preserve accessibility:
  - icon-only buttons must include `aria-label`.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
