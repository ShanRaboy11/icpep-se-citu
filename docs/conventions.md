# Conventions

## Checks to run

Run these before treating a change as done — CI (`.github/workflows/ci.yml`) runs the same set on every push:

```bash
npm --prefix server test          # role, ownership, whitelist, token and rate-limit rules
npm --prefix server run typecheck
npm --prefix server run lint
npm --prefix client test          # name, department and academic-year helpers
(cd client && npx tsc --noEmit)
npm --prefix client run lint
npm run check:mirrors              # client/server copies of shared utils must match
```

The client's production build (`next build`) also fails on ESLint errors — `next.config.ts` no longer sets `eslint.ignoreDuringBuilds`.

## Testing patterns

- **Server** (`server/src/tests/`, Vitest): unit-test middleware and controllers by mocking at the module boundary — `vi.mock("../models/user", () => ({ default: { findById: ... } }))` — never against a real database. `server/src/tests/helpers.ts` has `mockReq`/`mockRes` builders. See `maintenance.test.ts` or `auth.middleware.test.ts` for the shape to copy.
- **Client** (`client/src/tests/`, Vitest, `client/vitest.config.ts`): pure-function unit tests only — name formatting, department name shortening, academic-year math. Not component tests, not a DOM renderer. If a piece of client logic isn't a plain function, it generally isn't unit-tested here; the project deliberately avoids Puppeteer/Playwright/browser automation.
- **Live verification during development**: when a change needs checking against the real API (not just mocks), the pattern used in this repo is a throwaway Node script — sign a JWT locally with the same `JWT_SECRET`, seed a test user, hit the running dev server with `curl`/`fetch`, then delete the script. Don't commit these.

## Code style

- TypeScript everywhere, strict-ish (see each `tsconfig.json`). The server's `no-explicit-any` lint rule is deliberately off (Express handlers and Mongoose documents lean on `any` throughout) — don't chase that down as a lint fix.
- Tailwind v4 utility classes, no CSS modules. Shared color tokens are CSS custom properties in `client/src/app/globals.css` (`--primary1`, `--primary2`, `--primary3`, `--secondary1/2/3`, `--buttonbg1`) — use those (`text-primary1`, `bg-primary1/10`, etc.) rather than hardcoding hex values in a component, so a palette change is one edit.
- `client/src/app/components/button.tsx` is the one `<Button>` — pick a `variant` (`hero`, `heroOutline`, `primary`, `danger`, `confirm`, `cancel`, etc.) rather than building a one-off button. `tailwind-merge` (via `twMerge`) makes a passed `className` win over the variant's own classes, in size → variant → className order.
- Heading badges (the small pill above a page's `<h1>`) are one shared shape: `inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1` with `font-raleway text-sm font-semibold text-primary1` — no dot, no border, no backdrop-blur. `components/page-header.tsx` is the canonical implementation for a full page; a few standalone pages (home hero, 404) replicate it inline rather than importing `PageHeader` — if you add a new one, copy that exact class list rather than inventing a variant.
- Loading states: `components/loading.tsx` exports `LoadingScreen` (full-page, logo-based, used for page/route transitions and auth-gate loading) and `LoadingIndicator` (inline, bouncing dots, no logo, used inside cards, buttons and overlays). Don't add a new spinner — use one of these two.
- New public images go under `client/public/` in the matching subfolder (`brand/`, `icons/{social,ui,illustrations,decorative}/`, `team/`, `content/`, `placeholders/`, `documents/`), not the root. Prefer `next/image` over a bare `<img>` for anything served from `/public` or a remote host already in `next.config.ts`'s `images.remotePatterns`; a bare `<img>` is still fine for a client-side upload preview (a local `File`/blob URL, where `next/image` can't help).

## Commit messages

New commits: lowercase, present tense, `type: what changed and why if it's not obvious`, no author suffix. Types roughly follow `feat/fix/refactor/perf/chore/test/docs/add` — see recent `git log` for examples. No `Co-Authored-By` trailer unless explicitly requested. Split unrelated changes into separate commits.

Older history (pre-redesign) uses a different, more formal convention — `type(scope): message - Name` — documented in [README.md](../README.md#-commit-guidelines). Don't mix the two within one commit.

## Environment / settings pattern

- Anything that gates server startup or needs validation lives in `server/src/config/env.ts` as a `getX()` function, not a bare `process.env.X` scattered through the codebase.
- A new sitewide admin-controlled toggle (like maintenance mode or membership registration status) is a Mongoose "singleton" model: one schema, a controller that does `findOne()` and lazily creates the default document if none exists, a public `GET` and an admin-gated `PUT`. Copy `server/src/models/siteSettings.ts` + `controllers/siteSettings.controller.ts` rather than building a new pattern.

## Things not to do

- Don't add `console.log`/`console.error`/`console.warn` calls for error handling — this was deliberately removed. Client errors surface via `ApiErrorNotice`; server errors return a JSON error response.
- Don't reintroduce Puppeteer, Playwright, or any headless-browser tooling without being asked — UI changes are verified by the person, not screenshotted by an agent.
- Don't hardcode a color, a date-derived string (e.g. a copyright year), or a duplicated constant that already exists in `utils/site.ts`, `globals.css`'s custom properties, or `config/env.ts`.
