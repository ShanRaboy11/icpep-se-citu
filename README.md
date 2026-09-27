# 🔵 ICPEP.SE CIT-U CHAPTER OFFICIAL WEBSITE  

This project is the **official website of the ICPEP.SE CIT-U Chapter**, developed using the **MERN stack** (MongoDB, Express, React/Next.js, Node.js). 

> **Working with an AI coding agent (Claude Code, Cursor, etc.)?** Start with [AGENTS.md](AGENTS.md) — it links to the fuller [`docs/`](docs/) suite covering architecture, conventions and the full API surface.

---

## 📑 Table of Contents
- [Prerequisites](#-prerequisites)  
- [Setup Instructions](#-setup-instructions)  
- [Environment Variables](#-environment-variables)  
- [Tests & Checks](#-tests--checks)  
- [Updating After Pulling New Code](#-updating-after-pulling-new-code)  
- [Verify Setup](#-verify-setup)  
- [Development Notes](#-development-notes)  
- [Common Issues](#-common-issues)  
- [Development Workflow](#-development-workflow)  
  - [Branching Strategy](#branching-strategy)  
  - [Commit Guidelines](#commit-guidelines)  
- [Contributing](#-contributing--git-workflow)  

---

## 📦 Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)  
- Install [Git](https://git-scm.com/)  
- VSCode Extensions: **Docker** & **MongoDB for VSCode**  

---

## ⚙️ Setup Instructions  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/ShanRaboy11/icpep-se-citu.git
   cd icpep-se-citu
2. **Create `.env` files**
```
   * One in the project root
   * One inside server/

   Copy from `.env.example` and update values as needed.
```
3. **Run the project with Docker**

   ```bash
   docker compose up --build
   ```

   * Backend (Express) → **[http://localhost:5000](http://localhost:5000)**
   * Frontend (Next.js) → **[http://localhost:3000](http://localhost:3000)**
   * MongoDB runs inside a container

4. **Stop containers**

   ```bash
   docker compose down
   ```

---

## 🔐 Environment Variables

Copy `.env.example` and fill in real values. The ones that change behavior:

| Variable | Purpose |
| -------- | ------- |
| `JWT_SECRET` | **Required.** The server refuses to start without it (at least 16 characters, use a long random string). |
| `DEFAULT_PASSWORD` | Password given to new accounts when none is supplied; users must change it at first login. **Required in production** (the server won't start without it); falls back to `123456` in development. |
| `JWT_EXPIRES_IN` | How long a login stays valid, e.g. `12h` or `3d`. Defaults to `7d`. Resetting a password signs out all of that account's sessions. |
| `NEXT_PUBLIC_SITE_URL` | The deployed site's public URL, used for the sitemap, canonical links and structured data. Defaults to the production domain. |
| `TRUST_PROXY` | Number of reverse proxies in front of the server (e.g. `1` on Render) so rate limits see the real client IP. Leave unset when the server is exposed directly. |
| `SMTP_TLS_REJECT_UNAUTHORIZED` | Certificates are verified by default. Set to `false` only for a local mail catcher with a self-signed certificate. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_EMAIL`, `SMTP_PASSWORD`, `FROM_EMAIL`, `FROM_NAME`, `REPORT_EMAIL` | Outgoing email (reset codes, event reports). |

Login, forgot-password, verify-code and reset-password are rate limited per IP and per account (in memory, reset on restart).

---

## 🧪 Tests & Checks

```bash
npm --prefix server test          # role, ownership, whitelist, token and rate-limit rules
npm --prefix server run typecheck
npm --prefix server run lint
npm --prefix client test          # name, department and academic-year helpers
(cd client && npx tsc --noEmit)
npm --prefix client run lint
npm run check:mirrors             # client/server copies of shared utils must match
```

The same checks run on every push through GitHub Actions (`.github/workflows/ci.yml`).

---

## 🔄 Updating After Pulling New Code

```bash
git pull origin main
docker compose up --build
```

* Use `--build` if dependencies changed.
* Use just `docker compose up` if no new dependencies.

---

## ✅ Verify Setup

* Open **[http://localhost:3000](http://localhost:3000)** → frontend should load.
* Open **[http://localhost:5000](http://localhost:5000)** → should display a JSON API index (`"message": "ICPEP CITU API Server"`).
* Docker logs should show:

  ```
  🚀 Server running on http://localhost:5000
  ✅ MongoDB connected successfully
  ```

---

## 🛠 Development Notes

* **Backend (server/)** → Express + MongoDB, auto-restarts with `nodemon`.
* **Frontend (client/)** → Next.js + TailwindCSS, supports hot reload.
* **Database** → MongoDB 6.0 with Docker volume (`mongo-data`) for persistence.
* **Public assets** (`client/public/`) → organized into subfolders: `brand/`, `icons/{social,ui,illustrations,decorative}/`, `team/`, `content/`, `placeholders/`, `documents/`. Add new files to the matching folder rather than the root.
* **Maintenance mode** → an `admin`-only toggle at `/create/maintenance` suspends the site for everyone else (a maintenance screen on the client, a `503` on the API). See [docs/architecture.md](docs/architecture.md#maintenance-mode).
* **Dashboard** → one URL (`/dashboard`) shows a different view per role (admin / officer / student) rather than separate role-named routes.

---

## 📝 Common Issues

* **`nodemon: not found`** → rebuild without cache:

  ```bash
  docker compose build --no-cache
  ```
* **MongoDB auth error** → check `.env` credentials.
* **Port already in use** → stop old containers/apps on ports `3000` or `5000`.
* **Reset DB** → remove volumes:

  ```bash
  docker compose down -v
  ```

---

## 🔄 Development Workflow

We follow a **lightweight Gitflow-inspired workflow** for teamwork, accountability, and clean code.

1. **Issues** → Every task/feature/bug should have a GitHub Issue.
2. **Branches** → Branch from `develop`, keep changes focused.
3. **Pull Requests (PRs)** → Open into `develop`. Require at least 1 peer review.
4. **Integration** → Test locally, then merge into `develop`.
5. **Release** → Only merge `develop` → `main` when stable.

---

### 🌱 Branching Strategy

* **main** → production-ready, stable code
* **develop** → active development branch
* **feature/** → new features (`feature/raboy-landing-page`)
* **fix/** → bug fixes (`fix/mactual-navbar-bug`)
* **chore/** → configs, setup, maintenance

```bash
git checkout -b feature/<lastname>-<short-description>
```

**Examples:**

* `feature/raboy-landing-page`
* `fix/mactual-navbar-bug`

**Rules:**

* Use **lowercase** (except names).
* Keep names short and descriptive.
* Use **hyphens (-)**, not spaces.

---

### 📝 Commit Guidelines

Format:

```bash
<prefix>(<scope>): <message> - <name>
```

**Examples:**

* `feat(auth): implement login with JWT - Raboy`
* `fix(ui): resolve navbar bug - Lim`
* `docs(readme): update setup instructions - Mactual`

**Rules:**

* Prefix must follow the table below.
* Use **lowercase** (except names).
* Keep messages concise.
* Scope is optional, but recommended.

#### 📌 Commit Prefixes

| Prefix        | Meaning                                          |
| ------------- | ------------------------------------------------ |
| **feat:**     | A new feature                                    |
| **fix:**      | A bug fix                                        |
| **docs:**     | Documentation only changes                       |
| **style:**    | Code style changes (formatting, no logic change) |
| **refactor:** | Refactoring code (not a fix or feature)          |
| **test:**     | Adding or fixing tests                           |
| **chore:**    | Maintenance tasks (build, deps, configs, etc.)   |

---

## 🤝 Contributing & Git Workflow

1. Pull the latest code

   ```bash
   git pull origin main
   ```
2. Create a new branch

   ```bash
   git checkout -b feature/<lastname>-<short-description>
   ```
3. Commit changes using the [Commit Guidelines](#-commit-guidelines).
4. Push your branch

   ```bash
   git push origin feature/<lastname>-<short-description>
   ```
5. Open a Pull Request → target `develop`.
