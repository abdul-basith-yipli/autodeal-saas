# AutoDeal SaaS — Project Management Guide

## Overview

This project uses GitHub Issues + Projects for task tracking, and Pull Requests for all code changes. Every change goes through: Issue → Branch → PR → Merge.

---

## Workflow

```
Issue (Backlog) → Ready → In progress → PR (In review) → Merged → Issue closes (Done)
```

### Step-by-step

1. **Issue is picked** from the project board (Ready → In progress)
2. **Branch created** from `main`: `issue-<number>-<kebab-title>`
   ```bash
   git checkout -b issue-6-brand-model-year
   ```
3. **Changes implemented** with atomic commits
4. **Pull Request created** to `main` with:
   - Title referencing the issue: `Closes #6 — brand/model/year endpoints`
   - Body with checklist from the issue
   - Labels matching the issue
5. **PR reviewed and merged** (squash merge recommended)
6. **Issue auto-closes** via the `Closes #N` keyword in the PR **body** (not title)

   > Note: For squash merges, include `Closes #N` in the PR body. GitHub detects it there and closes the issue automatically.

---

## Branch Naming

```
issue-<number>-<short-description>
```

Examples: `issue-6-brand-model-year`, `issue-10-customer-enquiry`

---

## Commit Messages

```
Closes #N: short description

- bullet points of changes
```

The `Closes #N` keyword auto-closes the issue when merged to `main`.

---

## Pull Request Template

```markdown
## Closes #<issue-number>

### Changes

- ...

### Checklist

- [ ] Tests pass
- [ ] Lint passes
- [ ] Manual testing done
```

---

## Project Board Fields

| Field | Values |
|---|---|
| Status | Backlog → Ready → In progress → In review → Done |
| Priority | P0 (core), P1 (important), P2 (nice-to-have) |
| Size | XS, S, M, L, XL |
| Start date | When work begins |
| Target date | Planned completion |

## Labels

| Category | Labels |
|---|---|
| Phase | `phase:v0.2` through `phase:v1.0` |
| Layer | `backend`, `frontend`, `devops` |
| Type | `enhancement`, `bug` |
| Priority | `priority:P0`, `priority:P1`, `priority:P2` |

## Milestones

Each version phase has a milestone with a due date. Issues are assigned to the milestone of their phase.
