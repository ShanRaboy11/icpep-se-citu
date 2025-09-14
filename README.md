# 🔵  ICPEP.SE CIT-U CHAPTER OFFICIAL WEBSITE

This project uses the **MERN stack** (MongoDB, Express, React/Next.js, Node.js) with **Docker Compose** for easy setup and consistency across all devices.

---

## 📦 Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Install [Git](https://git-scm.com/)
- Install Extensions [Docker & MongoDB for VSCode]


## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShanRaboy11/icpep-se-citu.git
   cd icpep.se-cit-u
````

2. **Create `.env` file in the project root**
   Add your MongoDB connection string:

   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db-name>?retryWrites=true&w=majority
   PORT=5000

````

3. Run the project with Docker**

   ```bash
   docker compose up --build
   ````

   * Backend (Express) → **[http://localhost:5000](http://localhost:5000)**
   * Frontend (Next.js) → **[http://localhost:3000](http://localhost:3000)**
   * MongoDB → runs inside Docker container

4. **Stop containers**

   ```bash
   docker compose down
   ```

---

## 🔄 Updating After Pulling New Code

When you pull the latest changes from GitHub:

```bash
git pull origin main
docker compose up --build
```

* `--build` ensures images are rebuilt with new code & dependencies.
* Use just `docker compose up` if nothing has changed.

---

## ✅ Verify Setup

* Open **[http://localhost:3000](http://localhost:3000)** → Next.js frontend.
* Open **[http://localhost:5000](http://localhost:5000)** → Backend should return: `API is running...`.
* Docker logs should show:

  ```
  🚀 Server running on http://localhost:5000
  ✅ MongoDB connected successfully
  ```

---

## 🛠 Development Notes

* **Backend (server/)** → Express + MongoDB, auto-restarts with `nodemon`.
* **Frontend (client/)** → Next.js + TailwindCSS, supports hot reload.
* **Database** → MongoDB 6.0, stored in a Docker volume (`mongo-data`) so data persists across restarts.

---

## 📝 Common Issues

* **`nodemon: not found`** → rebuild without cache:

  ```bash
  docker compose build --no-cache
  ```
* **MongoDB auth error** → check `.env` credentials.
* **Port already in use** → stop old containers or apps using `3000`/`5000`.
* **Fresh DB reset** → remove volumes:

  ```bash
  docker compose down -v
  ```

---

Perfect 👍 I’ll merge your **Contributing section** with the **Branch & Commit Naming Conventions** into a single clean section so your groupmates don’t have to jump back and forth.

Here’s the integrated version you can drop into your README:

---

## 🤝 Contributing & Git Workflow

### 1. Pull the latest code

```bash
git pull origin main
```

### 2. Create a new branch

Follow the branch naming convention:

```bash
git checkout -b feature/<lastname>-<short-description>
```

**Examples:**

* `feature/raboy-landing-page`
* `fix/mactual-navbar-bug`

**Rules:**

* Always use **lowercase** (except for names).
* Keep branch names short and descriptive.
* Use **hyphens (-)** instead of spaces.

---

### 3. Commit your changes

Follow the commit message format:

```bash
<prefix>(<scope>): <message> - <name>
```

**Examples:**

* `feat(landing page): add initial layout - Mactual`
* `fix(navbar): resolve mobile responsiveness issue - Raboy`
* `docs(readme): update setup instructions - Lim`

**Rules:**

* Prefix must follow the table below.
* Use **lowercase** (except for names).
* Keep messages concise and clear.
* Scope is optional, but recommended.

---

### 4. Push your branch

```bash
git push origin feature/<lastname>-<short-description>
```

---

## 📌 Commit Prefixes

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
