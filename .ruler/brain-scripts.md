# Script Standards

## Location

Scripts live in `scripts/` at repository root.

## Categories

```text
scripts/
├── infra/          # Infrastructure (db, deploy)
├── testing/        # Test utilities
├── codegen/        # Code generation
└── utils/          # General utilities
```

## Standards

**TypeScript Scripts:**

```typescript
#!/usr/bin/env bun
import { $ } from "bun"

async function main() {
  // Script logic
}

main().catch(console.error)
```

**Package.json Scripts:**

```json
{
  "scripts": {
    "db:migrate": "bun run --elide-lines=0 scripts/infra/migrate.ts",
    "generate:types": "bun run scripts/codegen/generate-types.ts"
  }
}
```

**Execution:**

- Always use `bun run --elide-lines=0` for scripts
- Scripts should be self-documenting
- Exit with non-zero on failure
