# Project Conventions

## PRDs

Location: `prds/YYYY-MM-DD-feature-name.md`. Required for all user-facing features.

Structure: Overview → Goals → Non-Goals → Technical Design → Open Questions → Timeline.

## Scripts

Location: `scripts/{infra,testing,codegen,utils}/`. Always TypeScript with `#!/usr/bin/env bun`.

Run with `bun run --elide-lines=0`. Exit non-zero on failure.
