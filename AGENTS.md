# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor, Copilot, Codex, etc.) working in this repo. Human contributors: see [README.md](README.md) for setup and workflow; this file is about how the codebase is put together and how to change it safely.

For deeper detail, see the `docs/` suite:
- [docs/architecture.md](docs/architecture.md) — how the client, server and database fit together, auth, roles, maintenance mode
- [docs/conventions.md](docs/conventions.md) — code style, testing, commit conventions, patterns to follow
- [docs/api-reference.md](docs/api-reference.md) — every server route, its method, auth requirement and what it does

## What this is

The official website of ICpEP.SE CIT-U Chapter (Institute of Computer Engineers of the Philippines — Student Edition, CIT-U chapter): a public marketing site (home, about, events, officers, announcements, merch, membership, contact) plus an admin/officer tool (`/create/*`, `/users`, `/dashboard`) for the people running the org.

MERN stack: MongoDB, Express, React (Next.js App Router), Node.js.

```
client/   Next.js 15 (App Router), TypeScript, Tailwind v4
server/   Express, TypeScript, Mongoose
```

## Before you start

1. Read [docs/architecture.md](docs/architecture.md) if you haven't touched this repo before — the auth model, role list and maintenance-mode enforcement aren't obvious from file names alone.
2. Run the checks in [docs/conventions.md](docs/conventions.md#checks-to-run) before considering a change done. CI (`.github/workflows/ci.yml`) runs the same checks.
3. `client/src/app/officers/utils/format-name.ts` and `client/src/app/utils/academic-year.ts` each have a byte-for-byte mirror in `server/src/utils/`. If you touch either file, update both — `npm run check:mirrors` fails the build otherwise.
4. Don't add `console.log`/`console.error` calls. Errors already surface through `ApiErrorNotice` on the client and JSON error responses on the server; extra logging was deliberately stripped out.

## Where things live

- **Public pages**: `client/src/app/{home,about,events,officers,announcements,merch,membership,contact}/` — server-component `layout.tsx` per route holds `metadata`; the `page.tsx` underneath is a client component.
- **Admin/officer tool**: `client/src/app/create/*` (content management, one folder per resource) and `client/src/app/users/` (user management). Both are gated by `RequireOfficer` (`council-officer` + `admin`). `client/src/app/create/maintenance/` is gated tighter, to `admin` only.
- **Dashboard**: `client/src/app/dashboard/page.tsx` picks a variant based on role — `OfficerDashboard` (`variant="officer"` or `variant="admin"`) or `StudentDashboard` — all at the single `/dashboard` URL, not a role-named sub-route.
- **Shared UI**: `client/src/app/components/` — `header.tsx`, `footer.tsx`, `button.tsx` (variant-based), `loading.tsx` (`LoadingScreen` for full-page, `LoadingIndicator` for inline), `require-role.tsx` / `require-officer.tsx` (client-side route guards), `maintenance-gate.tsx`.
- **Server routes/controllers/models**: `server/src/{routes,controllers,models}/`, one file per resource, same base name across all three.
- **Server middleware**: `server/src/middleware/` — `auth.middleware.ts` (JWT verify + role checks), `auth-limits.ts` (login/reset rate limits), `maintenance.middleware.ts` (site-suspend enforcement), `upload.middleware.ts` (multer, memory storage → Cloudinary).
- **Public assets**: `client/public/` is organized into subfolders — `brand/`, `icons/{social,ui,illustrations,decorative}/`, `team/`, `content/`, `placeholders/`, `documents/`. Put new assets in the matching folder, not the root.

## Conventions worth internalizing

- **Roles**: `student`, `council-officer`, `committee-officer`, `faculty`, `admin`. `admin` bypasses every role check server-side (`authorizeRole` in `auth.middleware.ts`). See [docs/architecture.md](docs/architecture.md#roles--permissions).
- **Singleton settings pattern**: `MembershipSettings` and `SiteSettings` are both "there is only ever one document" models — `findOne()` with a lazy self-healing create if it doesn't exist yet. Follow this pattern for any new sitewide toggle rather than inventing a new one.
- **Public GET, guarded mutation**: most resources follow `GET /` and `GET /:id` public, `POST`/`PUT`/`PATCH`/`DELETE` behind `authenticateToken` + `authorizeRoles('council-officer')`. Check `docs/api-reference.md` before assuming a route needs auth.
- **Env-driven config lives in `server/src/config/env.ts`**, not scattered `process.env` reads — `getJwtSecret()`, `getJwtExpiresIn()`, `getDefaultPassword()`. Add new required/validated env vars there.
- **Tests**: server uses Vitest (`server/src/tests/`), client uses Vitest for pure-function unit tests only (`client/src/tests/`) — not component/UI tests. Mock at the module boundary (`vi.mock`), not with a real database or a real Next.js render.
- **No browser automation**: this repo is developed without Puppeteer/Playwright by convention — don't reintroduce headless-browser testing or screenshotting without being asked.

## Commit style seen in recent history

Two styles coexist in git history. Prefer the newer one for new work:
- Newer commits: lowercase, present-tense, `type: what changed`, no author suffix, no `Co-Authored-By` trailer unless the human explicitly asks for one.
- Older commits (pre-redesign): `type(scope): message - Name`, per the formal guide in [README.md](README.md#-commit-guidelines).

Split unrelated changes into separate commits rather than one large commit, and only commit when asked to.
