# Architecture

## System overview

```
┌─────────────────────┐        HTTPS/JSON         ┌──────────────────────┐
│  client (Next.js)   │ ─────────────────────────▶ │  server (Express)    │
│  App Router, TS,    │ ◀───────────────────────── │  TypeScript, Mongoose│
│  Tailwind v4         │                            │                      │
└─────────────────────┘                            └──────────┬───────────┘
                                                                │
                                                                ▼
                                                        ┌───────────────┐
                                                        │   MongoDB     │
                                                        └───────────────┘
```

The client never talks to MongoDB directly — every read and write goes through the Express API (`client/src/app/services/*.ts`, one file per resource, wrapping a shared `axios` instance in `services/api-client.ts`). Image uploads go to Cloudinary via the server (`server/src/utils/cloudinary.ts`), not directly from the browser.

## Client (`client/`)

Next.js App Router. Route folders under `src/app/` map directly to URLs.

- **Server components** (no `"use client"`): `layout.tsx` files. These hold `metadata` exports (per-page `<title>`, Open Graph, JSON-LD structured data) and, for the handful of dynamic routes (`events/[id]`, `announcements/[id]`, `officers/[slug]`), `generateMetadata()` that fetches the specific record server-side so the page's social preview and `<title>` reflect real content instead of a generic fallback.
- **Client components**: almost everything else, including every `page.tsx`. They fetch their own data client-side via the `services/*.ts` layer, using `localStorage` (`userRole`, `userName`, `userId`) only to draw the UI (the login itself is an httpOnly cookie).
- **Root layout** (`src/app/layout.tsx`): sets the font variables, site-wide `metadata` (with a `pageMetadata()` helper in `utils/site.ts` that every page layout calls — see the comment there for why openGraph/twitter fields must be fully repeated per page rather than just overridden), the sitewide Organization JSON-LD, and mounts `<MaintenanceGate>` around `{children}`.
- **`utils/site.ts`**: `SITE_URL`, `SITE_NAME`, `DEFAULT_OG_IMAGE`, `pageMetadata()`. Single source of truth for anything SEO/social-preview related.
- **`sitemap.ts` / `robots.ts`**: Next's file-convention routes. The sitemap fetches published events and announcements from the live API at request time (best-effort — falls back to just the static routes if the API is unreachable) plus every officer department slug from `officers/utils/officers.ts`.

### Auth on the client

The login is an httpOnly cookie (`authToken`) set by `POST /api/auth/login`, so page scripts can't read it. The axios client in `services/api-client.ts` sends it with `withCredentials` and adds an `X-Requested-With` header to every request; the server refuses a cookie-authenticated change without that header (`middleware/csrf.middleware.ts`), which is what stops another site from riding the cookie. `utils/session.ts` keeps `userRole`, `userName` and `userId` in `localStorage` purely so the header, menu and route guards can render; `RequireRole` (`components/layout/require-role.tsx`) reads that and redirects if the role doesn't match. **This is a UX convenience only** — the real enforcement is server-side, since a client check can trivially be bypassed by calling the API directly. A stale flag (cookie expired or revoked) is cleared on the first `401`/`403` token error. `RequireOfficer` is `RequireRole` pre-configured for `council-officer` + `admin`. Cookie behaviour comes from `COOKIE_SAMESITE` (`lax` by default; use `none` when the client and server are on different domains), `COOKIE_SECURE` (defaults to on in production; always on for `none`) and an optional `COOKIE_DOMAIN`. Scripts can still send `Authorization: Bearer <token>`, which skips the CSRF header check.

## Server (`server/`)

Express app, entry point `src/index.ts`. Middleware order matters:

1. Body parsers (1mb default; `/api/users` gets 10mb for the bulk roster upload)
2. Cookie parser
3. CORS (allowlist + `*.vercel.app` + optional `ALLOW_ALL_ORIGINS`)
4. Dev-only request logging
5. `enforceMaintenanceMode` — see below
6. Routes

Each resource has a matching `routes/*.ts` (wires HTTP verbs + middleware to controller functions), `controllers/*.ts` (request handling, validation, response shaping) and `models/*.ts` (Mongoose schema). `GET` endpoints for public content (events, announcements, officers, etc.) require no auth; anything that creates/edits/deletes goes through `authenticateToken` and usually `authorizeRoles('council-officer')`.

### Auth on the server

`middleware/auth.middleware.ts`:
- `authenticateToken` — verifies the JWT (`getJwtSecret()`, refuses to start the whole server if unset or too short), then **re-fetches the account from the database** on every request to check `isActive` and `tokenVersion` against the token's `tv` claim. A deactivated account or a token issued before the account's last password reset is rejected even if the JWT signature is still valid. The role attached to `req.user` is the *current* database role, not whatever role was in the token — a demotion takes effect on the very next request, not just the next login.
- `authorizeRole(...roles)` — `admin` always passes; everyone else needs their role in the allowed list.
- `authorizeSelfOrRoles(...roles)` — lets a user act on their own record (`req.params.id === req.user.id`) regardless of role, for routes shared between self-service and admin management (e.g. `PUT /users/:id`).
- Login tokens are signed with `{ id, role, tv: tokenVersion }` and expire per `getJwtExpiresIn()` (default `1d`). Signing out calls `POST /api/auth/logout`, which also bumps `tokenVersion` so the token stops working server-side. Until an account has set its own password (`firstLogin`), `authenticateToken` only lets its token reach `first-login-password`, `change-password`, `me` and `logout` — the rest of the API answers 403, so a first-login code can't be used to skip choosing a password. There is no shared default password: every new account (add-user form, bulk upload, Excel sync) gets its own random `XXXX-XXXX` code, stored only as the account's bcrypt-hashed initial password and emailed to `firstname.lastname@cit.edu` (`utils/school-email.ts`; spaces, accents and punctuation are dropped, the middle name is never used) through a slow in-memory queue (`utils/first-login-mail.ts`). `firstLoginCodeStatus` (`pending`/`sent`/`failed`/`no-email`) and `firstLoginCodeExpires` live on the account until the person sets their own password; an expired code is refused at login, and officers re-issue codes from the Users page. Reset codes are stored as an HMAC, capped at 5 wrong guesses, and thrown away after that. Sensitive actions (user create/delete/role change/activate/deactivate, roster syncs, password resets, the developer self-heal on login) are written to the `AuditLog` collection, readable by admins at `GET /api/audit`. The server sends `helmet` security headers, hides `X-Powered-By`, and rate-limits the whole API as well as login and reset. `*.vercel.app` preview origins are off by default; set `ALLOW_VERCEL_SUBDOMAINS=true` to allow them. `User.tokenVersion` increments on every password change *except* a user changing their own password while logged in (`$locals.keepSessions`), so a password reset revokes every other existing session without logging the person out of the session they just used to reset it.

### Roles & permissions

| Role | Can do |
| --- | --- |
| `student` | Public content, own profile, RSVP/meetings, membership registration |
| `committee-officer` | Student, plus manage their own posts (ownership-checked) |
| `council-officer` | Full content management (`/create/*`), user management (`/users`) |
| `faculty` | Same dashboard tier as officers; no elevated API access beyond a student's |
| `admin` | Everything — bypasses every `authorizeRole` check, plus admin-only routes (maintenance mode) |

`server/src/config/developers.ts` lists student numbers that self-heal to `admin` + active on every successful login, in case a roster sync or an accidental role change ever knocks a dev team account out of admin.

### Maintenance mode

Admin-only sitewide kill switch. `SiteSettings` (Mongoose singleton, same pattern as `MembershipSettings`) holds `maintenanceMode: boolean` and `maintenanceMessage: string`, exposed at `GET/PUT /api/site/settings` (`site.routes.ts`; `PUT` is `admin`-only).

Enforcement is server-side and real, not just a UI skin: `middleware/maintenance.middleware.ts` runs ahead of every `/api/*` route except `/api/auth/*` and `/api/site/*` (so a not-yet-logged-in admin can still authenticate, and the toggle itself is always reachable). While `maintenanceMode` is true, any request without a valid, active, `admin`-role token gets a `503`. The lookup fails *open* (lets the request through) if the settings read itself errors, so a database hiccup doesn't accidentally lock everyone out.

The client mirrors this in `components/maintenance-gate.tsx`: polls `GET /api/site/settings` every 30s, caches the last known state in `sessionStorage` so a reload during an outage shows the maintenance screen immediately instead of flashing the real page first, and re-evaluates on every route change (not just on an interval) so logging in as an admin lifts the screen right away. `/login` is exempt from the gate.

### Ownership & whitelisting

- `utils/ownership.ts` — `canManagePost(user, authorId)`: `admin`/`council-officer` can manage anything; a `committee-officer` only their own posts.
- User field whitelisting lives in `controllers/user.controller.ts` (`SELF_EDITABLE_FIELDS` vs `MANAGED_EDITABLE_FIELDS`) so a self-service profile edit can never smuggle in a role or `isActive` change, and only an `admin` can ever assign the `admin` role or edit an existing admin account.
- `utils/html.ts` (`escapeHtml`) and `utils/regex.ts` (`escapeRegExp`) — used anywhere user input is interpolated into an email/report or a MongoDB `$regex` search, to stop injection.

## Officer/department model

Officers are `User` documents with a role of `council-officer` or `committee-officer`, plus optional council/committee assignment fields (`councilPosition`, `committeeDepartment`, `committeeTitle`, etc.) — a single account can hold both a council seat and a committee seat at once, independently. `officers/utils/officers.ts` on the client holds the cosmetic per-department metadata (title, description, gradient) keyed by slug; the actual roster for a department + academic year is fetched live (`officers/[slug]/page.tsx`), either the current live roster or a specific year's frozen archive via `officerTerm`.

## Dashboard

One route (`/dashboard`), three presentations, picked by `dashboard/page.tsx` based on `localStorage.userRole`:
- `admin` → `<OfficerDashboard variant="admin" />` (adds a system-status card and a maintenance shortcut)
- `council-officer` / `committee-officer` / `faculty` → `<OfficerDashboard />`
- everyone else (`student`) → `<StudentDashboard />`

Old `/dashboard/officer` and `/dashboard/student` URLs 301-redirect to `/dashboard` (`client/next.config.ts`).
