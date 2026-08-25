---
name: slidown-slides
description: Author markdown slide decks for the slidown app, which renders plain markdown into presentation slides using a custom lightweight dialect. Use when creating or editing a slide deck, presentation, or pitch deck in markdown for slidown — covers the exact slide-separator syntax, per-slide +++ frontmatter, supported layouts, and the restricted markdown feature set the parser actually understands.
metadata:
  author: slidown
---

# slidown Slides — authoring skill

Write presentations as plain markdown that slidown renders as slides.
Paste this file into Claude, ChatGPT or Gemini as a project instruction or
knowledge file, then ask it for a deck and paste the result into slidown.

## Output contract

Return ONLY markdown. No commentary, no code fences around the whole deck.

## Gotchas

- Only `layout`, `header`, `footer` and `date` frontmatter keys have any
  effect. Other keys parse without error but are silently ignored.
- Theme, accent color, font and dark/light mode are **not** configurable
  from markdown. They're app-level settings the reader picks in the
  slidown UI — don't emit frontmatter keys like `theme:` or `font:`
  expecting them to do anything.
- Only one image renders per slide. If more than one `![]()` line
  appears, the last one wins — earlier ones are silently discarded, not
  shown as text.
- The renderer only supports headings levels 1-3, single-level bullet
  lists (no numbering, no nesting), and inline `**bold**`/`*italic*`/
  `` `code` ``. There is no support for tables, links, fenced code
  blocks, strikethrough, or heading levels 4-6 — don't generate those,
  they won't render as intended.

## Slide separator

A line containing only three dashes starts a new slide:

```
# First slide
---
# Second slide
```

## Per-slide front matter

A slide may open with a `+++` block. All keys are optional.

```
+++
layout: split
header: Q3 Review
footer: Acme Inc.
date: true
+++
```

| Key | Values | Effect |
| --- | --- | --- |
| `layout` | `stack` (default), `title`, `split`, `full-bleed`, `bento`, `media-top`, `columns`, `frame` | Slide composition |
| `header` | any text | Small uppercase label above the slide |
| `footer` | any text | Text pinned to the bottom |
| `date` | `true` | Prints today's date beside the footer |

## Layouts — when to use which

- **title** — opening slide, section breaks, a single closing statement.
  Content is centred and set larger. Keep it to one heading plus one line.
- **split** — text on the left, image on the right. Requires an image.
  Best for a claim plus supporting visual. Max 4 bullets.
- **full-bleed** — image fills the slide, text sits on a dark scrim at the
  bottom. Requires an image. Use for emotional beats and chapter openers.
  Keep text to a heading and at most one line — it must stay legible.
- **stack** — default. Heading, then body, image below if present.
- **bento** — header and body render as separate rounded panels beside a
  tall image card. Requires an image. Good for a feature highlight.
- **media-top** — image spans the top like a card header, text below.
  Requires an image. Good for blog-style or article slides.
- **columns** — body text flows into two columns. No image needed. Use for
  dense text that would run too long as a single column.
- **frame** — a single image shown small and bordered like a framed photo,
  centred text below. Requires an image. Use for a quiet, editorial beat.

## Content elements

```
# Big title          (one per deck, usually the opener)
## Slide title       (the normal slide heading)
### Sub-heading      (use sparingly)

Body copy as a normal paragraph.

- Bullet
- Bullet

> A quote gets an accent rule and italics.

![Descriptive alt text](https://images.unsplash.com/photo-...)
```

Inline emphasis: `**bold**`, `*italic*` and `` `code` ``.

## Rules that keep decks readable

1. **One idea per slide.** If a slide needs two headings, it is two slides.
2. **Six lines maximum**, counting bullets. Prefer three or four.
3. **Ten words per bullet maximum.** Cut articles before cutting meaning.
4. **One image per slide.** Adding a second is a no-op — see Gotchas.
5. **Write bullets as statements, not labels.** "Churn fell 12% in Q3", not
   "Churn".
6. **No filler slides** — no "Agenda" unless the deck is over ten slides, no
   "Thank you" slide with nothing on it, no restating the title.
7. **Vary the rhythm.** Open with `title`, break sections with `title` or
   `full-bleed`, keep the body on `stack` and `split`. Never run more than
   three identical layouts back to back.
8. **Images must earn their place.** Use one when it carries meaning, not for
   decoration. Always write real alt text.
9. **Set `footer` and `date` once** on the opening slide and on any slide
   that may be screenshotted alone — not on every slide.
10. **Numbers need context.** "$1.2M ARR, up 40% YoY" beats "$1.2M".

## Image sources

Use real, working photo URLs. Unsplash direct links work well:

`https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=1600&q=60`

Use `w=1600` for `full-bleed`, `w=1200` for `split` and `stack`.

## Worked example

```
+++
layout: title
footer: Acme Inc.
date: true
+++
# Retention is our growth engine
What changed in Q3, and what we do next.
---
+++
layout: split
+++
## Churn fell 12% after onboarding v2
- Guided setup replaced the empty dashboard
- Time-to-first-value dropped from 4 days to 40 minutes
- Support tickets in week one fell by half

![A team reviewing analytics on a wall display](https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=60)
---
+++
layout: full-bleed
+++
## Next: make week two as good as day one

![Sunrise over a mountain range](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=60)
```
