# API reference

Base URL: `{NEXT_PUBLIC_API_URL}` (client) / server listens on `PORT` (default `5000`), all routes under `/api`. `GET /health` is unauthenticated and outside `/api`, for uptime checks.

Auth column: **public** = no token needed · **self** = the account's own record, via `authorizeSelfOrRoles` · a role name = `authenticateToken` + that role (or `admin`, which passes every check) · **admin** = admin only.

While maintenance mode is on, every route below except `/api/auth/*` and `/api/site/*` returns `503` to anyone who isn't an authenticated, active `admin` — see [architecture.md](architecture.md#maintenance-mode).

## Auth — `/api/auth`

| Method & path | Auth | Notes |
| --- | --- | --- |
| `POST /login` | public | rate-limited by IP and by account |
| `POST /logout` | public | |
| `POST /forgot-password` | public | rate-limited; emails a reset code |
| `POST /verify-code` | public | rate-limited |
| `POST /reset-password` | public | rate-limited; revokes all other sessions for the account |
| `POST /first-login-password` | self | no current password required |
| `POST /change-password` | self | requires current password; keeps the current session alive |
| `GET /me` | self | |

## Users — `/api/users`

| Method & path | Auth | Notes |
| --- | --- | --- |
| `GET /search` | `council-officer` | |
| `GET /stats` | `council-officer` | member counts for dashboards |
| `POST /bulk-upload` | `council-officer` | Excel roster import |
| `POST /sync-delete` | `council-officer` | roster sync: removes users not in the uploaded file (admins protected) |
| `POST /sync-upsert-batch` | `council-officer` | roster sync: batched upsert |
| `GET /` | any authenticated user | filtering/sorting/pagination |
| `POST /` | `council-officer` | only `admin` can assign the `admin` role |
| `GET /:id` | self or `council-officer` | |
| `PUT /:id` | self or `council-officer` | field whitelist differs by which — see `user.controller.ts` |
| `PATCH /:id/toggle-status` | `council-officer` | activate/deactivate |
| `DELETE /:id` | `council-officer` | |

## Officers — `/api/officers`

| Method & path | Auth | Notes |
| --- | --- | --- |
| `GET /public` | public | roster for the public officers pages |
| `GET /search` | `council-officer` | search non-officer users to assign a position |
| `GET /` | `council-officer` | full roster incl. private fields |
| `PUT /:id` | `council-officer` | assign/update a council or committee position |

## Officer terms (archive) — `/api/officer-terms`

| Method & path | Auth |
| --- | --- |
| `GET /years` | public |
| `GET /` | public |
| `GET /admin` | `council-officer` |
| `POST /`, `PUT /:id`, `DELETE /:id` | `council-officer` |

## Events — `/api/events`

| Method & path | Auth | Notes |
| --- | --- | --- |
| `GET /` | public | |
| `GET /tag/:tag` | public | |
| `POST /:id/report` | public | rate-limited |
| `GET /:id` | public | |
| `GET /my/events` | any authenticated user | |
| `POST /`, `PATCH /:id`, `DELETE /:id` | `council-officer` or own post (`canManagePost`) | |
| `PATCH /:id` (publish toggle) | `council-officer` or own post | |

## Announcements — `/api/announcements`

Same shape as Events: public `GET /`, `GET /type/:type`, `GET /:id`; `GET /my/announcements` for any authenticated user; create/update/delete/publish-toggle behind `council-officer` or ownership.

## Advisors, Faculty, Sponsors, Testimonials — `/api/{advisors,faculty,sponsors,testimonials}`

Same shape across all four: `GET /` public, `GET /admin` and all mutations `council-officer`-only, image upload via `multer` (`upload.single('image')`).

## Merch — `/api/merch`

`GET /` public; `POST /`, `PUT /:id`, `DELETE /:id` all `council-officer`.

## Membership — `/api/membership`

| Method & path | Auth |
| --- | --- |
| `GET /tiers` | public |
| `GET /tiers/admin` | `council-officer` |
| `POST /tiers`, `PUT /tiers/:id`, `DELETE /tiers/:id` | `council-officer` |
| `GET /settings` | public — `{ isOpen, registrationUrl }` |
| `PUT /settings` | `council-officer` |

## Meetings (Commeet) — `/api/meetings`, `/api/availability`

| Method & path | Auth |
| --- | --- |
| `GET /meetings`, `GET /meetings/:id` | any authenticated user |
| `POST /meetings`, `PATCH /meetings/:id`, `DELETE /meetings/:id` | any authenticated user (creator/invitee logic inside the controller) |
| `GET /availability/:meetingId`, `GET /availability/:meetingId/summary` | public |
| `GET/PATCH /availability/:meetingId/me` | any authenticated user |

## Notifications — `/api/notifications`

All routes expect an authenticated user and operate on that user's own notifications: `GET /`, `PUT /read-all`, `PUT /:id/read`, `DELETE /:id`.

## FAQs — `/api/faqs`

`GET /` public (feeds both the home page display and its FAQPage structured data); `GET /admin` and all mutations behind `admin` or `council-officer`.

## Site settings — `/api/site`

| Method & path | Auth | Notes |
| --- | --- | --- |
| `GET /settings` | public | `{ maintenanceMode, maintenanceMessage }` — always reachable, even during maintenance |
| `PUT /settings` | `admin` | the only route besides `/api/auth/*` reachable during maintenance |

## Health / info

| Method & path | Auth |
| --- | --- |
| `GET /health` | public — `{ status, database }`, outside `/api` |
| `GET /` | public — API index |
| `GET /api` | public — lists available route prefixes |
