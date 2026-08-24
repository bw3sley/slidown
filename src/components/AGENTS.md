# UI Component Library — Agent Guide

This document is the authoritative reference for creating and extending components in `src/components/ui/`. Any agent or developer adding new components **must** follow the patterns described here.

---

## Core Rules

| Rule | Detail |
|---|---|
| **File names** | `kebab-case.tsx` — e.g. `scroll-area.tsx`, `combo-box.tsx` |
| **Exports** | Only **named exports**. No default exports. |
| **Function style** | Components and helpers use `function Name() {}` declarations, never `const Name = () => {}`. Variant configs (`tv({...})`) and other non-function values still use `const`. |
| **Styling** | Use `tailwind-variants` (`tv`) + the `cn` utility. Never write ad-hoc inline class concatenation. |
| **Variants & Sizes** | Every component **must** expose at minimum `variant` and `size` props via `tailwind-variants`. |
| **Types** | Extend native HTML props (`HTMLAttributes`, `ButtonHTMLAttributes`, etc.) or Radix `ComponentPropsWithoutRef<typeof Primitive.X>`. Never create props from scratch if a standard type already models the element. |
| **Composition** | If a component is more than one DOM element working together, use the **composition pattern** (see below). Simple leaf elements like `Button` or `Badge` do **not** need it. |
| **Radix UI** | When a component requires accessibility primitives (focus traps, ARIA, portals), always prefer a Radix UI primitive as the underlying layer. |
| **`cn` usage** | Always call `cn(variantResult, className)` in that order. This ensures consumer overrides win without fighting specificity. |

---

## Imports Reference

```ts
// Variants engine
import { tv, type VariantProps } from "tailwind-variants";

// Class merger
import { cn } from "#/lib/utils";

// Radix primitives (example — pick the right one per component)
import * as ProgressPrimitive from "@radix-ui/react-progress";
import type { ComponentPropsWithoutRef } from "react";
```

---

## Pattern 1 — Simple Component (no composition)

Use this for single-element, self-contained components.

**Examples:** `Button`, `Badge`, `Textarea`

```tsx
// badge.tsx
import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "#/lib/utils";

const badgeVariants = tv({
  base: ["inline-flex items-center gap-1 font-medium rounded-sm border"],
  variants: {
    variant: {
      default:  "border-transparent bg-primary text-primary-foreground",
      outline:  "border-border bg-transparent text-foreground",
      success:  "border-transparent bg-success/15 text-success",
    },
    size: {
      sm: "px-1.5 py-0.5 text-[10px]",
      md: "px-2   py-0.5 text-xs",
      lg: "px-2.5 py-1   text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    BadgeVariants {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { badgeVariants };
```

**Checklist:**
- [ ] `tv()` defines `base`, `variants.variant`, `variants.size`, `defaultVariants`
- [ ] `VariantProps<typeof xVariants>` is re-exported as a named type
- [ ] Interface extends the matching HTML prop type + `VariantProps`
- [ ] `cn(variants({ variant, size }), className)` in the render
- [ ] `xVariants` exported so consumers can re-use it (e.g., for `asChild` patterns)

---

## Pattern 2 — Composition Component

Use this when a component is composed of multiple related parts that must be assembled by the consumer. Each sub-component is a named export with the **ComponentName + PartName** convention.

**Examples:** `Input` (`InputRoot`, `InputControl`, `InputDescription`, `InputError`, paired with the standalone `Label`), `Select`, `Dialog`

### Naming Convention

```
InputRoot          ← wrapper / context provider
InputControl       ← the interactive element (carries variants/sizes)
InputDescription   ← helper text
InputError         ← validation error message
```

Labeling uses the standalone `Label` component (`#/components/ui/label`) rather than an `Input`-scoped part — it's shared across `Input`, `Select`, and other fields.

### Usage by the consumer

```tsx
import {
  InputRoot,
  InputControl,
  InputDescription,
  InputError,
} from "#/components/ui/input";
import { Label } from "#/components/ui/label";

<InputRoot>
  <Label htmlFor="email">Email</Label>
  <InputControl id="email" type="email" placeholder="you@example.com" />
  <InputDescription>We'll never share your email.</InputDescription>
  <InputError>Invalid email address.</InputError>
</InputRoot>
```

### Implementation skeleton

```tsx
// input.tsx

// Root — layout wrapper only
export function InputRoot({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

// Control — the only part that needs variants
const inputControlVariants = tv({ ... });

export interface InputControlProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    InputControlVariants {}

export function InputControl({ className, variant, size, ...props }: InputControlProps) {
  return (
    <input
      className={cn(inputControlVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

**Checklist:**
- [ ] Root component provides layout only (e.g. `flex flex-col gap-1.5`)
- [ ] Only the *interactive* sub-part carries `variant`/`size` variants
- [ ] Supporting parts (Label, Description, Error) extend the appropriate native HTML type
- [ ] If `size` conflicts with an HTML attribute (e.g. `<input size>`), use `Omit<InputHTMLAttributes<...>, "size">`

---

## Pattern 3 — Radix-backed Component with Slots

Use this when a component has multiple DOM nodes that must share variant styling (e.g. the track + indicator in `Progress`, or the thumb in `Slider`).

`tailwind-variants` **slots** let you define co-dependent class sets in a single `tv()` call.

**Examples:** `Progress`, `Tabs`, `ScrollArea`

```tsx
// progress.tsx
const progressVariants = tv({
  slots: {
    root: "relative w-full overflow-hidden rounded-full bg-secondary",
    indicator: "h-full w-full flex-1 transition-all duration-500 rounded-full",
  },
  variants: {
    variant: {
      default:     { indicator: "bg-primary" },
      success:     { indicator: "bg-success" },
      destructive: { indicator: "bg-destructive" },
    },
    size: {
      sm: { root: "h-1"   },
      md: { root: "h-1.5" },
      lg: { root: "h-2.5" },
      xl: { root: "h-4"   },
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

export function Progress({ className, value, variant, size, ...props }: ProgressProps) {
  const { root, indicator } = progressVariants({ variant, size });
  return (
    <ProgressPrimitive.Root className={cn(root(), className)} {...props}>
      <ProgressPrimitive.Indicator
        className={indicator()}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
```

**Checklist:**
- [ ] Destructure slots: `const { root, indicator } = progressVariants({ ... })`
- [ ] Call each slot as a function: `root()`, `indicator()`
- [ ] Apply `cn(root(), className)` only on the outermost element — inner slots usually don't need `className` override
- [ ] Export `progressVariants` for consumers who need to extend

---

## Design Tokens Reference

All components must use CSS variable–backed Tailwind tokens, **not** hardcoded hex values.

| Token | CSS Variable | Usage |
|---|---|---|
| `bg-background` | `--background` | Main content surfaces |
| `bg-secondary` / `bg-muted` | `--secondary` / `--muted` | Subtle backgrounds, sidebars |
| `bg-primary` | `--primary` | Primary action buttons, active states |
| `text-primary-foreground` | `--primary-foreground` | Text on primary surfaces |
| `bg-success` | `--success` | Progress bars, "Start Learning" actions |
| `bg-destructive` | `--destructive` | Errors, destructive actions |
| `border-border` / `border-input` | `--border` / `--input` | All structural dividers and inputs |
| `text-muted-foreground` | `--muted-foreground` | Secondary text, captions |
| `ring-ring` | `--ring` | Focus indicators |
| `rounded-sm` | 4px | Small badges, inline elements |
| `rounded-md` | 6px (default) | Buttons, inputs |
| `rounded-lg` | 8px | Cards, containers |
| `rounded-xl` | 12px | Large feature cards |

---

## Variant Conventions

Always include these two variant axes at minimum:

### `variant` — semantic meaning

| Name | Purpose |
|---|---|
| `default` | Primary branded action |
| `secondary` | Lower emphasis |
| `outline` | Border-only, transparent fill |
| `ghost` | No border, no fill |
| `destructive` | Error or removal action |
| `success` | Positive or progression action |
| `muted` | De-emphasised, disabled-feeling |
| `link` | Inline text-like action (buttons only) |

### `size` — spatial scale

| Name | Height / Padding |
|---|---|
| `sm` | `h-8`, compact padding |
| `md` | `h-9`, default padding (always the default) |
| `lg` | `h-10`, spacious padding |
| `xl` | Extra large — use sparingly |

---

## Focus & Accessibility

- Always include `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1` (or `ring-offset-2` for elements on dark/colored backgrounds).
- For components wrapping Radix primitives, Radix handles ARIA automatically — do **not** manually add `role`, `aria-*`, or keyboard handlers unless you have a strong reason.
- Disabled state: always add `disabled:pointer-events-none disabled:opacity-50`.

---

## File Structure Summary

```
src/components/ui/
├── badge.tsx          # Simple pattern
├── button.tsx         # Simple pattern
├── input.tsx          # Composition pattern
├── label.tsx          # Radix-backed, simple
├── progress.tsx       # Radix-backed, slots pattern
├── separator.tsx      # Radix-backed, simple
├── textarea.tsx       # Simple pattern (with code variant)
└── AGENT.md           # ← you are here
```

---

## Test Hooks

Interactive elements exercised by Playwright E2E tests (`e2e/` at the repo root) must carry a
`data-testid` prop, in `kebab-case`, describing the element's role — e.g. `add-slide-button`,
`ai-provider-anthropic`, `download-skill-link`. Since components already spread native HTML
attributes (`{...props}`), `data-testid` passes through with no extra plumbing — just add the
prop at the call site, no new component API needed. Only add it to elements a test actually
targets; don't blanket-apply it to every element.

## Testing

Use **Vitest** + **Testing Library**. Every test file lives next to its component: `badge.spec.tsx` beside `badge.tsx`.

### Rules

- Always wrap cases in `describe('<ComponentName>')`.
- Every test uses `it()`, **not** `test()`.
- Test name **must** start with `"should be able to"` — frames assertions as user abilities.
- Import from `@testing-library/react` and `@testing-library/jest-dom`.

### Example

```tsx
// badge.spec.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("should be able to render with default variant", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("should be able to apply a custom className", () => {
    render(<Badge className="extra">New</Badge>);
    expect(screen.getByText("New")).toHaveClass("extra");
  });

  it("should be able to render with the success variant", () => {
    render(<Badge variant="success">Done</Badge>);
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
});
```

### Checklist

- [ ] File named `<component>.spec.tsx`, co-located with the component
- [ ] One `describe` block per component
- [ ] All cases use `it("should be able to ...")`
- [ ] No `test()` calls
- [ ] Assertions use `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveClass`, etc.)

---

## Quick Template

Copy-paste template for a **new simple component**:

```tsx
// my-component.tsx
import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "#/lib/utils";

const myComponentVariants = tv({
  base: [
    // shared base classes
  ],
  variants: {
    variant: {
      default: "",
      secondary: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export type MyComponentVariants = VariantProps<typeof myComponentVariants>;

export interface MyComponentProps
  extends HTMLAttributes<HTMLDivElement>,
    MyComponentVariants {}

export function MyComponent({ className, variant, size, ...props }: MyComponentProps) {
  return (
    <div
      className={cn(myComponentVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { myComponentVariants };
```
