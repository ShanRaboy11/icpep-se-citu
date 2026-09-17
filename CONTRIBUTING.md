# Contributing to ICPEP.SE CIT-U Website

Thank you for your interest in contributing to the **ICPEP.SE CIT-U Chapter Official Website**! We follow a lightweight Gitflow-inspired workflow to maintain high code quality, accountability, and seamless teamwork.

---

## 📋 General Rules & Principles

1. **Issues First**: Every new feature, bug fix, or chore must correspond to a [GitHub Issue](https://github.com/ShanRaboy11/icpep-se-citu/issues). If one doesn't exist, open one before starting work.
2. **Atomic PRs**: Keep pull requests focused on a single concern. Avoid bundling unrelated fixes together.
3. **Tests Ride Along**: Always include or update tests when modifying logic. Verify that `npm test` passes before pushing.
4. **Clean Git History**: Follow the commit format and branching conventions strictly.

---

## 🌿 Branching Strategy

All development branches are branched from `main` and merged back into `main` via reviewed Pull Requests.

### Branch Naming Format:
```bash
<type>/<lastname>-<short-description>
```

| Type | Purpose | Example |
| :--- | :--- | :--- |
| `feature/` | New user-facing features or pages | `feature/raboy-landing-page` |
| `fix/` | Bug fixes or interface adjustments | `fix/mactual-navbar-bug` |
| `chore/` | Tooling, dependencies, setups, configs | `chore/tabotabo-dev-setup-and-fixes` |
| `docs/` | Documentation additions or revisions | `docs/tabotabo-api-reference` |

### Creating a Branch:
```bash
git checkout main
git pull origin main
git checkout -b <type>/<lastname>-<short-description>
```

---

## 📝 Commit Guidelines

Format:
```bash
<prefix>(<scope>): <message> - <name>
```

### Examples:
- `feat(auth): implement login with JWT - Raboy`
- `fix(ui): resolve navbar bug - Lim`
- `docs(readme): update setup instructions - Macatual`
- `chore(setup): add admin seed script - Tabotabo`

### Allowed Prefixes:
| Prefix | Meaning |
| :--- | :--- |
| **`feat:`** | A new feature |
| **`fix:`** | A bug fix |
| **`docs:`** | Documentation only changes |
| **`style:`** | Formatting, whitespace, no logic change |
| **`refactor:`** | Code change that neither fixes a bug nor adds a feature |
| **`test:`** | Adding or fixing automated tests |
| **`chore:`** | Maintenance tasks, configs, build scripts |

---

## 🚀 Pull Request Process

1. **Verify Locally**:
   Run all automated tests and build checks:
   ```bash
   npm test
   npm run build
   ```
2. **Push to Your Fork / Branch**:
   ```bash
   git push -u origin <branch-name>
   ```
3. **Open Pull Request**:
   - Target: `ShanRaboy11/icpep-se-citu:main`.
   - Link the relevant issue (e.g., `Closes #94`).
   - Describe what changed and include proof of verification.
   - Disclose if AI assistance was utilized.
4. **Peer Review**:
   - Every PR requires at least one peer review approval before merging.
   - Address any reviewer feedback promptly.

---

## 🤖 AI Tooling & Transparency Policy

We encourage the thoughtful use of modern developer tools, including AI coding assistants (e.g. Gemini, Copilot, Antigravity). However, contributors must adhere to these transparency standards:
- **Authorship Ownership**: The person opening the PR is personally responsible for understanding and verifying every line of code submitted.
- **Disclosure**: Disclose AI assistance in the PR description body.
- **Commit Trailers**: Add `Co-Authored-By: <Tool> <email>` to commits assisted by an AI agent.
