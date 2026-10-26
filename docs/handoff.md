# Handoff: what is still open

State of the project after the 7th admin update (`fix/minor-issues`). Everything in the code is merged and passing CI; this list is the work that depends on people, data or a live environment, plus a few known gaps. Pick an item, do it, then delete or tick it here.

## Waiting on input

### 1. SMTP settings (first-login emails)

New accounts get a one-time first-login code emailed to `firstname.lastname@SCHOOL_EMAIL_DOMAIN` (`cit.edu` by default). The email path has **never been tested** because the SMTP variables aren't set anywhere yet.

- Set in the server environment (see `.env.example`): `SMTP_HOST`, `SMTP_PORT`, `SMTP_EMAIL`, `SMTP_PASSWORD`, `FROM_EMAIL`, `FROM_NAME`. Leave `SMTP_TLS_REJECT_UNAUTHORIZED` at its default except for a local mail catcher.
- Test with a throwaway account first. Do **not** issue codes to real accounts until a test mail has arrived and looked right: a code is emailed the moment it is issued.
- The state of each code is on the account (`firstLoginCodeStatus`: `pending` / `sent` / `failed` / `no-email`). Officers re-issue codes from the Users page. How the codes work: `docs/architecture.md`.
- Most accounts are still inactive on purpose; they are switched on during the rollout, not before.

### 2. Updated masterlist

The member list used for the 7th admin import was missing about **34 people** (mostly freshmen) who are not in the database yet. When the new masterlist arrives:

- Add them with the Users page upload (Excel sync, `POST /api/users/sync-upsert-batch`) rather than by hand. It creates the missing accounts and updates the rest.
- Re-check afterwards that the public member count on the home page matches the list (it counts every account flagged as a member, active or not).
- Anyone who is no longer in the 7th admin must not stay flagged as a member. The flag is `membershipStatus.isMember`.

### 3. Committee seats held back

These people were left out of the 7th admin committee data because the right seat wasn't clear. Decide and enter them through Manage → Officers:

- Deo, Orejela and Patlunag: seats not decided.
- Bascon and Caños: not in the database at all (they will come in with the masterlist).

### 4. Genders

No account has a gender set, so every officer without a photo shows the neutral default avatar. Admins set it per person in the Users edit form (`male` / `female`); the photo placeholder then switches to the man or woman image. Nothing to run.

## Before and right after deploying

- **Login is now an httpOnly cookie.** Everyone is logged out once on deploy.
- If the client and the API are on **different domains** (e.g. a `vercel.app` client and a separate API host), set `COOKIE_SAMESITE=none` on the server. It forces `Secure`, so the API must be on HTTPS. Same site or subdomains: leave the default (`lax`), and optionally set `COOKIE_DOMAIN`. Details: `docs/architecture.md` (Auth on the client).
- Cookie logins need the `X-Requested-With` header on changes; the axios client in `services/api-client.ts` adds it. Anything else calling the API with the cookie must do the same (Bearer tokens skip the check).
- The cookie login and most of the recent UI work were **not tried in a browser** before merge. Smoke test below.

### Smoke test

- Log in, refresh, log out, log in again; confirm you are redirected correctly and the menu shows your name.
- As an officer: create a draft event, publish it, edit it, delete it. Same for an announcement.
- As a student: RSVP to an event and cancel; open an event that has an external RSVP link.
- Meeting announcement: add attendees by search and by uploading a `.csv` / `.xlsx` / `.txt` list; open "View full attendance" on the public page.
- Membership page: toggle the spotlight on a tier; only one tier may stay spotlighted.
- About page: all four tabs on desktop and a phone.
- Profile page: a non-member shows "Not a member".
- Maintenance mode: turn it on as admin, confirm the public site shows the maintenance screen and an admin can still get in; turn it off.

## Known gaps

- About page headings and text are hardcoded in `client/src/app/utils/about/info.tsx`; they are not editable from site content yet.
- The developers page text (`client/src/app/developers/page.tsx`) is hardcoded on purpose (6th admin credits).
- The Membership and Officers manage pages still have their own list tables; the other manage pages use `components/create/manage-list-card.tsx`.
- There is no browser or end-to-end testing, by repo convention. Server and client unit tests run in CI; UI is checked by hand.
- Unread notifications are pruned after 90 days, read ones after 30, dismissed ones after 7 (`pruneNotifications`); change the numbers in `server/src/utils/notification.ts` if the retention should differ.

## Database notes

- Collections no longer used and dropped: `officersHistory`, `meetingavailabilities`, `partners`, `officershistories` (its one record was a 2025-2026 list superseded by `officerterms`; a JSON copy was kept by whoever ran the cleanup).
- Officer history lives in `officerterms`. 2025-2026 rows are the 6th admin archive and should stay as they are.
- Roles in use: `student`, `council-officer`, `committee-officer`, `faculty`, `admin`. The developer account in `server/src/config/developers.ts` is restored to admin on every login.

## Working on this

- Read `AGENTS.md` and `docs/conventions.md` first; run the checks listed there before opening a PR (CI runs the same ones).
- Commits: lowercase, `type: what changed`, no co-author trailer unless asked, one logical change per commit.
- Don't add `console.log` / `console.error`; errors already surface through `ApiErrorNotice` and JSON responses.
