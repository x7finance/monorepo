---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git push:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(git checkout:*), Bash(git switch:*), Bash(gh pr create:*)
description: Commit, push, and open a PR
---

## Context

- Current branch: !`git branch --show-current`
- Main branch: !`git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main"`
- Git status: !`git status --short`
- Staged changes: !`git diff --cached`
- Unstaged changes: !`git diff`
- Recent commits on this branch: !`git log --oneline -5`
- Remote tracking: !`git status -sb | head -1`

## Your task

### Step 0: Check if branch creation is needed

If the current branch is the main branch (main, master, canary, develop), you MUST create a new feature branch before committing:

1. Analyze the changes to determine an appropriate branch name
2. Use this naming convention based on the type of changes:
   - New features: `feat/<short-description>` (e.g., `feat/user-auth`, `feat/dark-mode`)
   - Bug fixes: `fix/<short-description>` (e.g., `fix/login-redirect`, `fix/null-check`)
   - Refactoring: `refactor/<short-description>`
   - Documentation: `docs/<short-description>`
   - Chores/config: `chore/<short-description>`
3. Create and switch to the new branch: `git checkout -b <branch-name>`

**Branch naming rules:**

- Use kebab-case (lowercase with hyphens)
- Keep it short but descriptive (2-4 words max)
- No special characters except hyphens

### Step 1: Create a meaningful commit

- Stage any unstaged changes that should be included
- Write a concise commit message that explains the "why"
- Follow conventional commit style (feat:, fix:, refactor:, docs:, chore:)

### Step 2: Push to the remote

- Push with `-u` flag to set upstream tracking

### Step 3: Create a pull request

- Use `gh pr create` with a clear title and description
- Include a summary of changes and test plan in the PR body
- Target the main branch

If any step fails, stop and explain what went wrong.
