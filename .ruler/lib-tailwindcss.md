# Tailwind CSS v4

## Usage

```ts
import { cn } from "@x7/css"
const className = cn("base-classes", isActive && "active-classes")
```

## Class Order

Layout → Sizing → Spacing → Visual → Typography → Interactive

## Variants (cva)

```ts
import { cva, type VariantProps } from "class-variance-authority"
const buttonVariants = cva("inline-flex items-center justify-center rounded-md", {
  variants: {
    variant: { default: "bg-primary text-primary-foreground", secondary: "bg-secondary" },
    size: { default: "h-9 px-4 py-2", sm: "h-8 px-3" },
  },
})
```

Design tokens via CSS variables in `@x7/css` (`--color-primary`, `--radius-lg`, etc.).
