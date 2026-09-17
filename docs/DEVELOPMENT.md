# Development Guide

This guide covers developer tooling, environments, accounts, third-party service handling, and the daily development workflow for the **ICPEP.SE CIT-U Chapter Official Website**.

---

## 🔑 Accounts & Services

| Service | Purpose | Mode in Dev | Credentials Source |
| :--- | :--- | :--- | :--- |
| **GitHub** (`ShanRaboy11/icpep-se-citu`) | Code repository, issues, and PR reviews | Active | Personal GitHub Account |
| **MongoDB** | Database storage (users, events, announcements) | Local Mongo or Atlas | Local port 27017 or Chapter Discord |
| **Cloudinary** | Image CDN for announcement & merch photos | Mock placeholder mode | Chapter Discord (optional in local dev) |
| **SMTP (Office365)** | Password reset emails | Optional / Logged | Chapter Discord (optional in local dev) |
| **Vercel** | Frontend production & preview deployments | Production / Staging | Chapter maintainers |

---

## 🌐 Environments Matrix

| Environment | Frontend URL | Backend API URL | Database |
| :--- | :--- | :--- | :--- |
| **Local Native** (Recommended) | `http://localhost:3000` | `http://localhost:5000/api` | Local MongoDB (`mongodb://localhost:27017/icpep_db`) |
| **Docker Compose** | `http://localhost:3000` | `http://localhost:5000/api` | Containerized Mongo 6.0 (`mongo-data` volume) |
| **Production** | `https://icpep-se-citu.vercel.app` | Custom Backend Host | MongoDB Atlas Cloud Cluster |

---

## 🔒 Secrets & Fallback Mocks

`.env.example` lists every supported environment variable and is committed to source control. Your machine-specific `.env` files must remain untracked.

### Graceful Fallbacks in Local Development:
- **Cloudinary Image Uploads**:
  If `CLOUDINARY_CLOUD_NAME` is left as `placeholder` or missing, the backend does **not** crash. The utility (`server/src/utils/cloudinary.ts`) intercepts uploads and returns a valid placeholder image URL (`https://via.placeholder.com/1200x630.png?text=No+Image`), enabling complete UI testing without third-party API accounts.
- **Email / Password Resets**:
  If SMTP credentials are not configured, core login and registration functionality continues to work. Forgot-password requests will attempt SMTP and gracefully log failures to the server console.

---

## 🔄 The Daily Development Loop

Follow this loop for every feature, bug fix, or chore:

### 1. Catch Up with Main
```bash
git checkout main
git pull origin main
```

### 2. Create a Feature Branch
```bash
git checkout -b <type>/<lastname>-<short-description>
```
*Examples:* `feature/tabotabo-notification-badge`, `fix/tabotabo-modal-close`.

### 3. Launch the Local Dev Servers
```bash
npm run dev
```
Both the Next.js frontend (with Turbopack hot module replacement) and Express backend (with `ts-node-dev` auto-restart) run concurrently.

### 4. Run Automated Tests Frequently
```bash
npm test
```
- Backend tests use an isolated in-memory database and run in ~4 seconds.
- Frontend Vitest tests run in ~1 second.

### 5. Commit with Format Compliance
```bash
git add .
git commit -m "<prefix>(<scope>): <message> - <name>"
```
*Example:* `git commit -m "feat(events): add attendee count badge - Tabotabo"`

### 6. Push to Your Fork / Branch & Open PR
```bash
git push -u origin <branch-name>
```
Open a Pull Request on GitHub targeting `main`, link the relevant issue, and request review.
