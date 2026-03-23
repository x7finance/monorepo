# Coding Standards

## TypeScript

- `interface` for objects, `type` for unions/intersections
- No `any` — use `unknown` with type guards
- Explicit return types on exports
- `??` not `||` for defaults; optional chaining: `data?.user?.id`

## Package Structure

```json
{
  "name": "@x7/package-name",
  "type": "module",
  "exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } },
  "files": ["dist", "src"],
  "scripts": { "build": "tsgo", "typecheck": "tsgo --noEmit", "lint": "oxlint src/" }
}
```

Extend `@x7/tsconfig/build.json`. Use `workspace:*` for internal deps.

## Accessibility (WCAG 2.1 AA)

- Semantic HTML (`<button>` not `<div onClick>`)
- ARIA labels on icon-only controls
- Keyboard accessible, visible focus indicators, focus trap in modals
- Contrast: 4.5:1 normal text, 3:1 large text / UI components
- Meaningful `alt` text (or `alt=""` for decorative)
