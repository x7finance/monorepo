---
allowed-tools: Bash(bun checks:*), Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*)
description: Run bun checks and create a conventional commit
---

## Context

- Current branch: !`git branch --show-current`
- Git status: !`git status --short`
- Staged changes: !`git diff --cached --stat`
- Unstaged changes: !`git diff --stat`
- Recent commits for style reference: !`git log --oneline -5`

## Your task

### Step 1: Run bun checks

**CRITICAL: This step is mandatory and must complete successfully before committing.**

1. Run `bun checks` to validate the codebase
2. If any checks fail:
   - **STOP immediately** - do NOT proceed to commit
   - Report the failures clearly to the user
   - Ask if they want to fix the issues or proceed anyway (requires explicit confirmation)
3. Only proceed to Step 2 if all checks pass OR user explicitly confirms to proceed despite failures

### Step 2: Analyze changes and create commit

1. Review all staged and unstaged changes using the context above
2. Analyze the nature of the changes to determine the appropriate conventional commit type:
   - `feat:` - New feature or functionality
   - `fix:` - Bug fix
   - `refactor:` - Code restructuring without behavior change
   - `docs:` - Documentation changes
   - `test:` - Adding or updating tests
   - `chore:` - Build process, dependencies, tooling
   - `style:` - Code formatting (not CSS)
   - `perf:` - Performance improvements

3. Stage any relevant unstaged changes using `git add`

4. Create a commit with a message that:
   - Starts with the conventional commit type prefix
   - Has a concise subject (50 chars or less)
   - Focuses on the "why" rather than the "what"
   - Follows the style of recent commits in this repo
   - Ends with: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

5. Use a heredoc for proper formatting:
   ```bash
   git commit -m "$(cat <<'EOF'
   type: concise subject line

   Optional body explaining the why.

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   EOF
   )"
   ```

6. Run `git status` after committing to verify success

### Important Notes

- **NEVER skip `bun checks`** - this is a hard requirement per CLAUDE.md
- **Do NOT commit if checks fail** unless user explicitly overrides
- **Do NOT push** - this command only commits locally
- **Do NOT create branches** - commit to current branch only
- If there are no changes to commit, inform the user and exit gracefully
