# Onboarding: Set Up Your Machine

**This document is written for an AI agent or human developer to execute step-by-step.** A contributor opens their AI tool in the repository and says:

> *Read docs/ONBOARDING.md and set up my machine.*

The agent runs each check, verifies the output, and pauses at 🛑 whenever human intervention is required.

---

## 🤖 Rules for the AI Agent

1. **Verify Every Step**: Run each command and inspect the actual return code. A step that outputs an error is NOT complete.
2. **Never Invent Secrets**: If a step requires credentials or connection strings you don't have, 🛑 stop and ask the user.
3. **Local Defaults are Safe**: Default local values (`mongodb://localhost:27017/icpep_db`, placeholder Cloudinary/SMTP) are intended for local dev. Real cloud secrets are shared privately.
4. **Never Commit Secrets**: Ensure `.env` and `server/.env` remain untracked by Git.
5. **Report Reality**: State what actually happened, not what was expected to happen.

---

## Part 0: Pre-flight Verification

🛑 **Stop. Check these environment prerequisites first:**

### 1. Confirm Operating System & Shell
Check current environment:
```bash
# Windows PowerShell / Bash
node -v && npm -v && git --version
```
- **Expectation**: Node.js `>= 18.0.0` (tested on Node `v24.x`), npm `>= 9.x`, Git installed.
- *If Node is missing or too old, stop and prompt the user to install Node 18+.*

### 2. Confirm Repository Location
```bash
git rev-parse --show-toplevel && git remote get-url origin
```
- **Expectation**: Contains `icpep-se-citu`.

### 3. Check Git Identity
```bash
git config user.name && git config user.email
```
- **Expectation**: Both name and email must be configured so commits reflect the contributor's identity.

---

## Part 1: Automated Installation

### Step 1: Install Dependencies Across All Layers
Run the root orchestration installer:
```bash
npm run install:all
```
- **Expectation**: Exits with code 0. Root `concurrently`, `server/node_modules`, and `client/node_modules` are populated.

### Step 2: Configure Environment Files
Copy the template files if `.env` does not already exist:
```bash
# Windows PowerShell:
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
if (-not (Test-Path server/.env)) { Copy-Item .env.example server/.env }

# Linux / macOS / Git Bash:
[ ! -f .env ] && cp .env.example .env
[ ! -f server/.env ] && cp .env.example server/.env
```
- **Review**: Ensure `MONGO_URI=mongodb://localhost:27017/icpep_db`, `NEXT_PUBLIC_API_URL=http://localhost:5000/api`, and `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000`.

### Step 3: Verify MongoDB Service
Check if MongoDB is running locally or accessible:
```bash
# Windows PowerShell:
Get-Service *mongo* -ErrorAction SilentlyContinue
```
- If running native MongoDB: Ensure service is started (`net start MongoDB` or `mongod`).
- If running Dockerized MongoDB: Run `docker run -d -p 27017:27017 --name icpep-mongo mongo:6.0`.
- If using MongoDB Atlas: 🛑 Prompt user to set their `MONGO_URI` in `.env`.

### Step 4: Seed the Administrator Account
Because user registration is closed and account creation requires an active admin token, seed the default administrator:
```bash
npm run seed:admin
```
- **Expectation**: Logs `✅ Admin user created successfully!` or `ℹ️ Admin account already exists`.
- **Credentials**:
  - Student Number: `ADMIN-001`
  - Password: `Admin@12345`
  - Role: `admin`

---

## Part 2: Health Verification & Smoke Tests

### Step 5: Run Automated Tests
```bash
npm test
```
- **Expectation**: All 16 unit and integration tests pass (backend Jest with in-memory Mongo + frontend Vitest).

### Step 6: Verify Production Compilation
```bash
npm run build
```
- **Expectation**: Server TypeScript (`tsc`) and Next.js Turbopack build exit with code 0.

### Step 7: Launch Development Servers
```bash
npm run dev
```
- **Expectation**:
  - Backend running at **[http://localhost:5000](http://localhost:5000)** (Health check: `/health`).
  - Frontend running at **[http://localhost:3000](http://localhost:3000)**.
- **Verification Checklist**:
  1. Open [http://localhost:5000/health](http://localhost:5000/health) in browser $\rightarrow$ JSON `{ success: true, status: "healthy", database: "connected" }`.
  2. Open [http://localhost:3000](http://localhost:3000) $\rightarrow$ Landing page renders properly.
  3. Navigate to [http://localhost:3000/login](http://localhost:3000/login) and log in with `ADMIN-001` / `Admin@12345` $\rightarrow$ Successfully authenticated into the platform.

🎉 **Machine setup is complete and fully verified!**
