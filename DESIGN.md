# Slidown Design System & Layout Guidelines

## Overview

This document captures Slidown's current visual system, shared UI language, and layout rules. Slidown is a clean presentation-building workspace with a calm neutral base, elevated card surfaces, and a cool indigo brand accent. The interface should feel focused, precise, and modern rather than playful or ornamental.

The system is built around semantic theme tokens defined in `src/index.css`. Reusable components should consume those tokens through Tailwind utilities rather than hardcoded color values. The result should be a UI that can evolve without each component carrying its own visual logic.

Slidown currently supports two surface modes:
1. **Light Mode** - soft gray canvas with white cards and indigo actions.
2. **Dark Mode** - deep charcoal workspace with cool blue highlights and low-glare panels.

**Key Characteristics:**
- Calm neutral workspace background.
- Card-based surfaces with subtle borders instead of heavy chrome.
- Indigo primary accent for action and focus.
- Crisp typography with strong headline contrast.
- Semantic token-driven styling through `src/index.css`.

## Colors

### Brand & Accent
- **Primary Indigo** (`{colors.primary}`): Main action color for buttons, links, active states, and focus language.
- **Primary Foreground** (`{colors.primary-foreground}`): Text/icon color on primary fills.
- **Ring** (`{colors.ring}`): Focus outline color.

### Surface
- **Background** (`{colors.background}`): Main app canvas.
- **Card** (`{colors.card}`): Primary raised surface for sections and panels.
- **Popover** (`{colors.popover}`): Floating overlay surface.
- **Secondary** (`{colors.secondary}`): Soft filled surfaces and lower-emphasis controls.
- **Muted** (`{colors.muted}`): Quiet background for low-priority areas.
- **Border** (`{colors.border}`): Structural dividers and field outlines.
- **Input** (`{colors.input}`): Form field background.

### Text
- **Foreground** (`{colors.foreground}`): Primary text and headings.
- **Muted Foreground** (`{colors.muted-foreground}`): Supporting copy, helper text, captions.
- **Accent Foreground** (`{colors.accent-foreground}`): Text on accent surfaces.

### Semantic
- **Success** (`{colors.success}`): Positive outcomes and confirmatory UI.
- **Destructive** (`{colors.destructive}`): Dangerous actions, errors, invalid states.

## Typography

### Font Family
Slidown uses **Plus Jakarta Sans** as primary UI type, with **Inter** as fallback before system sans-serif fonts. Typography should feel sharp, compact, and editorial without becoming decorative.

- Base Font: `"Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, sans-serif`
- Monospace Font: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`

### Hierarchy
- **`text-5xl` / `text-4xl`**: Major landing and hero headlines.
- **`text-2xl` / `text-xl`**: Section headers and strong card titles.
- **`text-base`**: Standard body copy and form controls.
- **`text-sm`**: Secondary copy, metadata, navigation labels.
- **`text-xs`**: Small helper text and supporting annotations.

### Principles
- Use semibold weight for key headings and actionable labels.
- Keep body text readable and restrained.
- Favor tight, confident headings over long decorative copy.

## Layout

### Spacing System
Slidown follows Tailwind's standard spacing scale. Most layout rhythm should center on `4`, `6`, `8`, `10`, `12`, and `16`.

- Tight control spacing: `gap-2` to `gap-3`
- Standard section spacing: `gap-6` to `gap-8`
- Page spacing: `px-6 py-16` minimum on desktop surfaces

### Page Structure
Current pages use a centered content layout with large vertical rhythm and card-grouped sections.

- **Page canvas:** full-height background using `bg-background`
- **Main container:** centered, width-constrained content column
- **Sections:** grouped as bordered cards with internal padding
- **Catalog/demo pages:** grid or stacked sections depending on content density

### Component Layout Rules
- Prefer rounded cards and grouped panels over full-bleed separators.
- Use border-defined structure before adding shadows.
- Keep maximum line width comfortable for marketing and documentation copy.
- Reusable primitives should be composable enough to support future editor, slide, and settings screens.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | Background only | app canvas |
| Structured | `border border-border` | most panels and controls |
| Raised | `shadow-sm`/`shadow-xs` plus border | buttons, inputs, textareas, select triggers |
| Floating | `shadow-xl` plus border | dropdown menu, popover, and select content — these need to visibly separate from the page |

Controls stay subtle. Floating surfaces are the one place Slidown uses real elevation, since they're detached overlays rather than in-page panels.

## Motion

Floating surfaces (dropdown menu, popover, select content) animate in with the `animate-pop-in` utility defined in `src/index.css` (translateY 6px + scale 0.98 → resting position, 130ms ease-out) via `data-[state=open]:animate-pop-in`. They close instantly — no exit animation is defined, matching how they open.

Controls (buttons, inputs, menu/select items) rely on Tailwind's default 150ms color transition for hover and focus states — no custom duration or easing needed.

## Shapes

### Radius Scale
Radius is chosen by role, not by component type:
- **`rounded-md`**: small inline elements — badges, menu/select item highlights
- **`rounded-lg`**: controls — buttons, inputs, textareas, select triggers
- **`rounded-xl`**: floating surfaces — dropdown menu, popover, and select content panels
- **`rounded-2xl`**: hero or large showcase surfaces

Rounded geometry should feel soft and modern, but still structured. All floating surfaces (dropdown, popover, select content) share the same `rounded-xl` tier so they read as one consistent family of overlay, even though they're built from different Radix primitives.

## Components

### UI Primitive Direction
Reusable components live in `src/components/ui/`. They should be generic, semantic primitives rather than Slidown-specific business components.

Current primitive families include:
- Buttons and badges for actions and metadata
- Inputs, textarea, and select for forms
- Separator for structure
- Popover and dropdown menu for floating interaction surfaces

### Component Principles
- Use semantic token classes, not hardcoded hex values.
- Expose `variant` and `size` consistently.
- Prefer Radix UI for overlays and accessibility-sensitive controls.
- Keep primitives generic so feature-level components can compose them later.

### Empty State
When the deck is blank, or the active slide has no body and no image, the preview shows an empty state inside the themed slide stage instead of slide content. It takes its colors from the deck theme (`currentColor`), not the app tokens. The slide layout picker is hidden while it shows, because there is nothing to lay out. First-time visitors never see it: a new board is seeded with the starter deck.

## Do's and Don'ts

### Do
- Use token-backed utilities from `src/index.css`.
- Preserve strong contrast between canvas, cards, and text.
- Keep interactions crisp, compact, and clean.
- Build reusable primitives before app-specific abstractions.

### Don't
- Don't introduce one-off color values inside components.
- Don't rely on heavy shadows or glossy effects outside floating surfaces — see Elevation & Depth.
- Don't make primitives carry Slidown-specific business meaning.
- Don't mix multiple competing accent colors into core UI.

## Responsive Behavior
- **Mobile (< 768px):** stack sections vertically, preserve readable spacing, avoid cramped multi-column layouts.
- **Tablet (768px-1024px):** allow 2-column content grids where cards still breathe.
- **Desktop (> 1024px):** use wider containers, stronger section rhythm, and multi-column catalogs when useful.

## Iteration Guide
1. Start from semantic tokens in `src/index.css`.
2. Reuse existing primitives before creating new visual patterns.
3. Add Slidown-specific composed components above primitive layer, not inside it.
4. Update this file when visual rules or layout direction materially change.
