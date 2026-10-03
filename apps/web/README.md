# binitt.dev

Portfolio and writing of Binit Gupta: Next.js (App Router) + Tailwind CSS v4, in a pnpm + Turborepo workspace.

## Develop

From the repository root:

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build
pnpm lint
```

## Content

- Projects: `lib/projects.ts`
- Writings: Markdown in `content/writings/*.mdx` (frontmatter: title, subtitle, summary, date, thumbnail, label)

## Environment

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Sends "Hire me" enquiries (`app/api/hire/route.ts`). Required for the form. |
| `HIRE_FROM_EMAIL` | Sender on a domain verified in Resend. |
| `HIRE_TO_EMAIL` | Inbox for enquiries (defaults to the contact email). |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console HTML-tag token. |
| `NEXT_PUBLIC_SITE_URL` | Site origin (defaults to https://binitt.dev). |

See `AGENTS.md` for how the code is organised.
