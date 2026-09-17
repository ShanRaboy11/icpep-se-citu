<!-- BEGIN:nextjs-agent-rules -->

# Next.js 15 & MERN Stack Agent Guide

This project is the **official website of the ICPEP.SE CIT-U Chapter**, built as a dual-service monorepo:
- **Client (`client/`)**: Next.js 15 (App Router with Turbopack), React 19, Tailwind CSS v4.
- **Server (`server/`)**: Express 4, TypeScript (ES2020), Mongoose 7, MongoDB 6.0.

Read this file before generating or modifying any code in this repository.

<!-- END:nextjs-agent-rules -->

# ICPEP.SE CIT-U: Guide for AI Agents and Developers

**Organization**: Institute of Computer Engineers of the Philippines Student Edition - Cebu Institute of Technology - University Chapter.

**Read this file first, every session.** It contains the non-negotiable operational rules, architectural constraints, and failure modes for this codebase.

---

## 🧭 Read Order & Ground Truth

1. **`AGENTS.md`** (this file): non-negotiable constraints, rules, and commands.
2. [`docs/README.md`](docs/README.md): documentation index and sitemap.
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): system topology, MERN data flow, background scheduler, and RBAC matrix.
4. [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md): accounts, environments, and secrets management.
5. [`docs/ONBOARDING.md`](docs/ONBOARDING.md): step-by-step agent-run machine setup.
6. [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md): complete REST contract for all 13 backend route modules.
7. [`docs/DATABASE_MODELS.md`](docs/DATABASE_MODELS.md): Mongoose schema specifications and relations.
8. The issue or task you were given.

---

## 🛑 Non-Negotiable Operational Guardrails

### 1. The 3-Tier Dependency Rule
- **Root Directory**: Contains orchestration scripts (`concurrently`). Never run `npm install <pkg>` in the root unless it is a repo-level orchestration tool.
- **Client (`client/`)**: Install frontend packages here (`npm --prefix client install <pkg>`).
- **Server (`server/`)**: Install backend packages here (`npm --prefix server install <pkg>`).

### 2. Networking & URL Rules
- **Backend Port**: Runs on `PORT 5000` with all routes mounted under `/api/*` (e.g. `/api/auth`, `/api/users`, `/api/announcements`).
- **Frontend Port**: Runs on `PORT 3000`.
- **Public Variables**: `NEXT_PUBLIC_API_URL=http://localhost:5000/api` and `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000`.
- **URL Normalization**: All frontend API calls must target `${API_URL}` ensuring `/api` is included. Never call `http://localhost:5000/auth/login` directly (which 404s); always call `/api/auth/login`.

### 3. Closed-Registration Reality
- **No Public Signup**: There is **no `/api/auth/register` endpoint**.
- All account creation happens through admin endpoints (`POST /api/users` or `POST /api/users/bulk-upload`) requiring an active admin Bearer token.
- On fresh or empty databases, use the seed command to create the default administrator:
  ```bash
  npm run seed:admin
  ```
  Default credentials: `ADMIN-001` / `Admin@12345` (role: `admin`).

### 4. Secrets & Environment Files
- Never commit `.env`, `.env.local`, or real production keys.
- Always preserve `.env.example` as the committed reference template.
- Cloudinary and SMTP gracefully degrade in local development with placeholders.

---

## 🤖 If You Are an AI Agent

### You May:
- Create and switch git branches.
- Commit changes using the project's commit prefix format.
- Run tests (`npm test`) and builds (`npm run build`).
- Push feature branches to your fork or origin feature branches.
- Open pull requests linking to existing GitHub issues.

### You May Never:
- Push directly to `main` or force-push.
- Merge or approve a pull request.
- Write to or drop a shared remote database.
- Commit plain-text secrets or `.env` files.
- Close GitHub issues unless explicitly instructed by the user.

---

## 🪟 Windows PowerShell BOM Warning

Windows PowerShell 5.1 commands like `Out-File`, `>`, or `Set-Content` write UTF-16 with a Byte Order Mark (BOM) by default, which corrupts JSON files, linters, and git commit hooks.
- **Never** write commit messages or code files using `>` or `Out-File` in PowerShell.
- **Use instead**: `git commit -m "..."` or native Node/Python/agent file writing tools.

---

## ⚡ Essential Commands

```bash
# 1. Install all dependencies across root, server, and client
npm run install:all

# 2. Seed default admin on clean database (ADMIN-001 / Admin@12345)
npm run seed:admin

# 3. Run all automated tests (Jest backend + Vitest frontend)
npm test

# 4. Run backend tests only (isolated in-memory MongoDB)
npm --prefix server run test

# 5. Run frontend tests only (Vitest in jsdom)
npm --prefix client run test

# 6. Verify production compilation (TypeScript tsc + Next.js build)
npm run build

# 7. Start both dev servers concurrently (Client: 3000, Server: 5000)
npm run dev
```

---

## 📝 Commit & Git Standards

Follow the repository's commit format:
```
<prefix>(<scope>): <message> - <name>
```
- **Allowed Prefixes**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`.
- **Branch Naming**: `<type>/<lastname>-<short-description>` (e.g. `feat/tabotabo-navbar`, `chore/tabotabo-dev-setup-and-fixes`).
- **Target Branch**: All PRs must target upstream `main`.

---

## 🤝 AI Assistance Disclosure

In keeping with transparent open-source engineering standards:
- Always disclose AI assistance in Pull Request bodies.
- Include the co-author attribution trailer at the end of git commits when applicable:
  ```
  Co-Authored-By: Antigravity <antigravity@google.com>
  ```
