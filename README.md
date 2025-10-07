# 🔵 ICPEP.SE CIT-U CHAPTER OFFICIAL WEBSITE  

This project is the **official website of the ICPEP.SE CIT-U Student Organization**, developed using the **MERN stack** (MongoDB, Express, React/Next.js, Node.js). 

---

## 📑 Table of Contents
- [Prerequisites](#-prerequisites)  
- [Setup Instructions](#-setup-instructions)  
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
* Open **[http://localhost:5000](http://localhost:5000)** → should display: `API is running...`.
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
