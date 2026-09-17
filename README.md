# 🔵 ICPEP.SE CIT-U Chapter Official Website

![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Express](https://img.shields.io/badge/Express-4-black?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=flat&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat&logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-3-yellow?style=flat&logo=vitest)
![Jest](https://img.shields.io/badge/Jest-29-red?style=flat&logo=jest)

The official web platform for the **Institute of Computer Engineers of the Philippines Student Edition - Cebu Institute of Technology - University Chapter (ICPEP.SE CIT-U)**. Built as a full-featured MERN-stack application powering member directories, council officer listings, meeting schedules, official announcements, merchandise showcases, and event registrations.

---

## 📑 Table of Contents
- [Prerequisites](#-prerequisites)
- [Quickstart: Local Native Setup (Recommended)](#-quickstart-local-native-setup-recommended)
- [Quickstart: Docker Compose Setup](#-quickstart-docker-compose-setup)
- [Default Seed Credentials](#-default-seed-credentials)
- [NPM Scripts Reference](#-npm-scripts-reference)
- [Automated Testing](#-automated-testing)
- [Contributing & Development Workflow](#-contributing--development-workflow)
- [Documentation Index](#-documentation-index)

---

## 📦 Prerequisites
- **Node.js**: `v18.0.0` or later (tested and verified on Node `v24.x`).
- **npm**: `v9.0.0` or later.
- **Git**: Installed and configured.
- **MongoDB**: Either a local MongoDB Community server, Dockerized MongoDB, or MongoDB Atlas connection URI.
- *(Optional)* **Docker Desktop**: If developing using containerized services.

---

## ⚡ Quickstart: Local Native Setup (Recommended)

Fast, lightweight local development with full hot-reloading (Next.js Turbopack + `ts-node-dev`).

### 1. Clone the repository
```bash
git clone https://github.com/ShanRaboy11/icpep-se-citu.git
cd icpep-se-citu
```

### 2. Install all dependencies
```bash
npm run install:all
```
*(Installs dependencies across root, `client/`, and `server/` in one command)*

### 3. Configure environment variables
Copy `.env.example` to `.env` in the root (and `server/.env`):
```bash
# Windows PowerShell:
Copy-Item .env.example .env
Copy-Item .env.example server/.env

# Linux / macOS / Git Bash:
cp .env.example .env
cp .env.example server/.env
```
Ensure `MONGO_URI` points to your MongoDB instance (default: `mongodb://localhost:27017/icpep_db`).

### 4. Seed initial admin account
Because user registration is closed, seed the default administrator account on your database:
```bash
npm run seed:admin
```

### 5. Start development servers
```bash
npm run dev
```
- **Frontend (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **Backend API (Express)**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 🐳 Quickstart: Docker Compose Setup

Run the entire application (Express backend, Next.js frontend, and MongoDB 6.0) inside Docker containers.

```bash
docker compose up --build
```
- Frontend runs on **[http://localhost:3000](http://localhost:3000)**
- Backend runs on **[http://localhost:5000](http://localhost:5000)**
- MongoDB runs on port `27017` with persistent named volume `mongo-data`

To stop containers:
```bash
docker compose down
```

---

## 🔑 Default Seed Credentials

When starting with a clean database and running `npm run seed:admin`, the following administrator account is provisioned:

| Field | Value |
| :--- | :--- |
| **Student Number** | `ADMIN-001` |
| **Password** | `Admin@12345` |
| **Role** | `admin` |
| **Access Level** | Full system administration, officer management, CMS |

Log in at [http://localhost:3000/login](http://localhost:3000/login).

---

## 📜 NPM Scripts Reference

All commands can be run directly from the repository root:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs backend and frontend concurrently with hot-reloading |
| `npm run install:all` | Installs root, `server/`, and `client/` dependencies |
| `npm run seed:admin` | Seeds default administrator into the database |
| `npm test` | Runs both backend Jest and frontend Vitest test suites |
| `npm run build` | Compiles server TypeScript and creates Next.js production build |
| `npm --prefix server run dev` | Runs backend Express server only |
| `npm --prefix client run dev` | Runs frontend Next.js server only |

---

## 🧪 Automated Testing

The repository includes end-to-end automated test suites:
- **Backend Tests (Jest + Supertest)**: Runs against an isolated, zero-side-effect in-memory database (`mongodb-memory-server`).
- **Frontend Tests (Vitest + JSDOM)**: Tests UI validation logic and API service utilities.

Run all tests from the root:
```bash
npm test
```

---

## 🤝 Contributing & Development Workflow

We welcome contributions from chapter members and developers!
1. **GitHub Issues**: Check [existing issues](https://github.com/ShanRaboy11/icpep-se-citu/issues) or open a new issue before starting work.
2. **Branching**: Branch from `main` using `<type>/<lastname>-<short-description>`.
3. **Commit Standard**: Follow `<prefix>(<scope>): <message> - <name>`.
4. **Pull Requests**: Submit PRs targeting `main` with local verification evidence.

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📚 Documentation Index

Explore the comprehensive documentation suite in [`docs/`](docs/):

- 🤖 [**`AGENTS.md`**](AGENTS.md): Operational guide, capabilities, and guardrails for AI coding assistants.
- 🤝 [**`CONTRIBUTING.md`**](CONTRIBUTING.md): Gitflow workflow, branch formats, and commit standards.
- 🗺️ [**`docs/README.md`**](docs/README.md): Documentation sitemap and navigation index.
- 🚀 [**`docs/ONBOARDING.md`**](docs/ONBOARDING.md): Agent-executable step-by-step developer machine setup.
- 💻 [**`docs/DEVELOPMENT.md`**](docs/DEVELOPMENT.md): Environments, shared credentials, and daily dev loop.
- 🏛️ [**`docs/ARCHITECTURE.md`**](docs/ARCHITECTURE.md): System topology, Next.js routing, Express middleware, and RBAC matrix.
- 🔌 [**`docs/API_REFERENCE.md`**](docs/API_REFERENCE.md): Full REST API contract for all 13 route modules.
- 🗄️ [**`docs/DATABASE_MODELS.md`**](docs/DATABASE_MODELS.md): Mongoose schema dictionary and data relationships.
