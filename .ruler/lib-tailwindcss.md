# Tailwind CSS v4 Standards

## Configuration

Tailwind v4 uses CSS-based configuration in `packages/css/src/index.ts`:

```typescript
import { cn } from "@x7/css"

// Use cn() for conditional classes
const className = cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-classes"
)
```

## Class Ordering

1. Layout (display, position, flex/grid)
2. Sizing (width, height)
3. Spacing (margin, padding)
4. Visual (background, border, shadow)
5. Typography (font, text)
6. Interactive (hover, focus, disabled)

## Component Patterns

**Base + Variants with cva:**

```typescript
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3"
      }
    }
  }
)
```

## Design Tokens

Use CSS variables defined in `@x7/css`:

- `--color-primary`
- `--color-secondary`
- `--radius-lg`
- etc.
