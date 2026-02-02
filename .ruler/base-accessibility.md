# Accessibility Standards

## Requirements

All UI components must meet WCAG 2.1 AA standards.

## Core Rules

**Semantic HTML:**

```tsx
// ✅ Correct
<button onClick={handleClick}>Submit</button>

// ❌ Incorrect
<div onClick={handleClick}>Submit</div>
```

**ARIA Labels:**

```tsx
// ✅ Correct
<button aria-label="Close dialog">×</button>

// ✅ Correct with visible label
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

**Focus Management:**

- All interactive elements must be keyboard accessible
- Visible focus indicators (no `outline: none` without replacement)
- Focus trap in modals/dialogs

**Color Contrast:**

- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18pt+)
- Minimum 3:1 for UI components

**Images:**

```tsx
// ✅ Decorative
<img src="icon.svg" alt="" />

// ✅ Informative
<img src="chart.png" alt="Price chart showing 24h trend" />
```

## Testing

Use axe-core or similar for automated accessibility testing.
