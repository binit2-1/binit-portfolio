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
  - Loads fonts (Google Sans Flex via `lib/fonts.ts`), global CSS, the navbar, and wraps tree with theme provider.
  - Single centered `max-w-2xl` column (v2 redesign, Figma "Portfolio-Design").
- `app/globals.css`
  - CSS entrypoint for Next app.
  - Imports `tailwindcss`, `tw-animate-css`, and shared tokens from `@repo/ui/styles/globals.css`.
- `app/page.tsx`
  - Home route.
- `app/works/page.tsx`
  - Works route (v1's `/work` 308-redirects here and `/about` to Home, see `next.config.ts`).
- `app/not-found.tsx`, `app/manifest.ts`, `app/sitemap.ts`, `app/robots.ts`
  - 404 page (noindex), web manifest, sitemap (must list real routes only), robots (`/api/` disallowed).
- `lib/seo.ts` + `components/json-ld.tsx`
  - `pageMetadata()` builds every page's title / description / canonical / Open Graph / Twitter;
    Person + WebSite JSON-LD with stable `@id`s (`PERSON_ID`, `WEBSITE_ID`), breadcrumbs, `<JsonLd nodes>`.
- `components/prose.tsx`
  - `PageHeader`, `InlineLink`, `Divider` shared by Home, Works, Writings and the 404 page.
- `app/writings/page.tsx`
  - Writings index route.
- `app/writings/[slug]/page.tsx`
  - Dynamic writing route.
  - Uses `generateStaticParams` and `generateMetadata`.
  - Reads post data via `@/lib/writings`.
  - Typography is scoped to posts via `.writing-type` (Instrument Sans + JetBrains Mono, see `lib/fonts.ts`).
  - Navigation: `writing-scroll-indicator.tsx` (tick marks, xl+) and `writing-mobile-toc.tsx` (bottom bar, below xl),
    both adapted from ui.nexvyn.dev and driven by `use-active-section.ts`.
  - Don't animate to `height: "auto"` in components that re-render while scrolling: framer-motion restores
    `window.scrollTo(0, y)` after measuring, which cancels in-flight smooth scrolls.
- `components/code-block.tsx` / `components/code-block-command.tsx`
  - Post code blocks: Shiki (github light/dark, server-rendered) with a copy button; shell blocks get a `$` prompt.
  - Single-line `npm`/`npx` commands render as `CodeBlockCommand` (pnpm/yarn/npm/bun tabs, choice saved in
    localStorage); conversion lives in `lib/package-managers.ts`.
- `components/navbar.tsx`
  - Inline top navigation (Home / Works / Writings) with dotted-underline active state.
  - Holds the theme toggle (`AnimatedThemeToggler`) next to search, so it's on every page.
  - Client component (needs `usePathname`).
- `components/app-icon.tsx`
  - Glossy app-style icon tile (`tone` prop: blue, purple, green, orange, red, black). Each tone tints its soft drop shadow.
- Site logo / favicon: `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, `public/images/logo/logo.png`
  (rendered from the "b." logo SVG, cropped to the tile).
- `components/unlumen-ui/github-graph.tsx`
  - Vendored GitHub contribution graph (shadcn `@unlumen-ui/github-graph`), imports `framer-motion`.
  - `compactMonths`: shown instead of `months` when the full range doesn't fit (Home: 12 months, 6 on phones).
- `lib/projects.ts`
  - All projects (Work page) with links, logo or Phosphor glyph, preview media; `featured` ones show on Home.
- `lib/previews.ts`
  - Server-side hover-preview media: video, then image, then the live site's og:image (cached 1 day), then the site OG.
- `components/hover-preview.tsx`
  - Client wrapper; rows with `data-preview-id` show media in the left gutter (xl+, real pointer only).
- `components/list-rows.tsx`
  - `ProjectRow`, `WritingRow`, `SectionHeader` shared by Home and Work.
- `lib/search.ts` + `app/api/search/route.ts`
  - Static search index (pages, projects, writings split by heading) fetched by the palette on first open.
- `components/search/site-search.tsx`
  - Navbar search: `⌘K`/`Ctrl+K` or `/`; every query word must match; magnifying glass on mobile.
- `components/footer.tsx`
  - Site footer: Email / LinkedIn / X / GitHub. The layout column is `min-h-svh flex-col` with `main.flex-1`,
    so on short pages the footer rests at the bottom of the viewport.
- `components/hire-me.tsx` + `lib/hire.ts` + `app/api/hire/route.ts`
  - `HireMeDialog` (mounted once in the root layout) is the freelance enquiry form; the route emails it via Resend.
  - Open it with `HireMeButton` or `openHireDialog()`: used by `components/hire-me-note.tsx` (hand-drawn
    Excalidraw note pointing at the name on Home; wiggle lives in globals.css).
    Colour: `--hire` (#0015ff light, off-white #e5e5e5 dark).
  - Env: `RESEND_API_KEY` (required), `HIRE_FROM_EMAIL` (verified sender), `HIRE_TO_EMAIL` (defaults to `CONTACT_EMAIL` in `lib/social-links.ts`).
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
- No pure white / black: `#fbfbfa` and `#111113` are the theme's white and black (tokens in
  `packages/ui/src/styles/globals.css`), and Tailwind's `white` / `black` are remapped to them in `app/globals.css`.

## Rendering and SEO

- Prefer **Server Components** by default (`app/*` routes and most of `components/*` with **no** `"use client"`).
- Ship **server-rendered HTML** for page content, headings, and navigation chrome whenever possible so crawlers and social previews see real text and structure without waiting on JavaScript.
- Add `"use client"` only when the component truly needs the browser (state, effects, browser APIs, event handlers, or libraries that require the client such as `next-themes`, Framer Motion, or route hooks like `usePathname`).
- When interactivity is required, split work: keep a **server** parent for layout and SEO-critical copy, and colocate a **small client** child for the interactive island.
- Every page exports metadata via `pageMetadata()` (lib/seo.ts): titles under 60 chars containing "Binit Gupta",
  descriptions 120-160 chars, canonical = og:url. One `<h1>` per page, no skipped heading levels.
- New pages: add them to `app/sitemap.ts`, the navbar if top-level, and `lib/search.ts` pages.
- Off-site setup lives outside the repo: Google Search Console (set `GOOGLE_SITE_VERIFICATION`), submit
  `/sitemap.xml`, and link binitt.dev from the GitHub / LinkedIn / X / Peerlist profiles.

## Navigation and Route Conventions

- Navbar items should match real pages to avoid dead links.
- Current top-level routes:
  - `/`
  - `/works`
  - `/writings` (+ `/writings/[slug]`)
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
