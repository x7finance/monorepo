---
description: Upgrade all dependencies (minor/patch and major) using taze, handling bun workspace catalogs
allowed-tools: Bash(*), Read, Write, Edit, Glob, Grep
---

Upgrade all dependencies to latest versions (project)

## Your Task

You are upgrading all dependencies in this bun monorepo, including both minor/patch AND major version upgrades. Taze doesn't fully support bun workspace catalogs, so you need to handle catalog dependencies manually.

## Step 1: Run taze to detect ALL available upgrades

Run taze in list mode first to see all available upgrades (including major):

```bash
bunx taze major -r -l
```

This will show all upgrades available (major, minor, and patch).

## Step 2: Apply taze upgrades where possible

Run taze with write mode including major upgrades to update package.json files in workspace packages:

```bash
bunx taze major -r -w
```

Note: This will update individual package.json files but will NOT update:

- The main `package.json` catalog entries
- The main `package.json` catalogs entries (named catalogs)
- Dependencies using `catalog:` references

## Step 3: Update catalog dependencies manually

Read the root `package.json` and look at these sections:

- `workspaces.catalog` - default catalog
- `workspaces.catalogs` - named catalogs (next, prisma, react19, tailwindcss, tanstack)

For each package in the catalogs that has an available upgrade (from the taze output), update the version in the appropriate catalog section.

Example catalog structure:

```json
{
  "workspaces": {
    "catalog": {
      "@faker-js/faker": "^10.2.0"
    },
    "catalogs": {
      "next": {
        "next": "^16.1.1-canary.12"
      },
      "prisma": {
        "@prisma/client": "^7.2.0"
      }
    }
  }
}
```

When updating catalogs:

1. Match package names from taze output to catalog entries
2. Update the version string to the new version
3. Keep the `^` prefix for semver ranges

## Step 4: Update overrides if needed

Also check the `overrides` section in the root package.json. Some packages there may need version updates too.

## Step 5: Install dependencies

After all updates are made:

```bash
bun i
```

This ensures the lockfile is regenerated with the new versions.

## Step 6: Verify

Run a quick check to make sure nothing is broken:

```bash
bun run typecheck
```

## Important Notes

- All upgrades (major, minor, patch) are applied by default
- Report all packages that were upgraded with their old and new versions
- If any packages fail to upgrade or have peer dependency issues, report them

## Summary Output

At the end, provide a summary table showing:

- Package name
- Old version
- New version
- Type (major/minor/patch)
- Location (catalog/workspace package)
