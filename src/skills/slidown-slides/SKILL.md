---
name: slidown-slides
description: Author markdown slide decks for the slidown app, which renders plain markdown into presentation slides using a custom lightweight dialect. Use whenever the user wants slides, a presentation, a pitch deck or a talk outline turned into markdown for slidown, or wants an existing slidown deck edited, even if they never name the format. Covers the slide-separator syntax, per-slide +++ frontmatter, the eight layouts, and the markdown subset the renderer supports.
---

# slidown Slides — authoring skill

Write presentations as plain markdown that slidown renders as slides.
Paste this file into Claude, ChatGPT or Gemini as a project instruction or
knowledge file, then ask it for a deck and paste the result into slidown.

## Output contract

Return ONLY markdown. No commentary, no code fences around the whole deck.
If you can write files, save the deck as a `.md` file instead.

## Supported syntax

This is the whole list. The renderer keeps only these elements and removes
everything else, children included, so unsupported content does not degrade
gracefully, it vanishes.

| Works | Notes |
| --- | --- |
| `#`, `##`, `###` headings | `#` big title, `##` normal slide heading, `###` sparingly |
| paragraphs | |
| `-` bullet lists | nesting works, but flat lists read better on a slide |
| `>` blockquote | accent rule and italics |
| `**bold**`, `*italic*`, `` `code` `` | inline only |
| `![alt](url)` | only as a line of its own, see Gotchas |

Not supported, so do not write it: numbered lists, links, tables, fenced code
blocks, strikethrough and `####`–`######` headings. Numbered lists, links,
code blocks and level 4–6 headings disappear along with their text. Tables and
`~~strikethrough~~` show up as raw characters. Express the same idea with
bullets, bold and short sentences (for steps, write "First…", "Then…" bullets).

## Gotchas

- Only `layout`, `header`, `footer` and `date` frontmatter keys have any
  effect. Other keys parse without error but are silently ignored.
- Theme, accent color, font and dark/light mode are **not** configurable
  from markdown. They are app-level settings the reader picks in the
  slidown UI, so do not emit keys like `theme:` or `font:`.
- An image only counts when the whole line is `![alt](url)`. Put it on its
  own line, with no title string and no surrounding text. An image written
  inside a sentence is removed, alt text included.
- Only `bento` renders more than one image: up to four `![]()` lines next
  to text, or up to five when the slide has no text, in order. Every other
  layout shows only the first image and discards the rest.
- Layouts that need an image (`split`, `full-bleed`, `media-top`, `frame`,
  `bento`) quietly fall back to a plain text slide when there is none, so a
  missing image gives you a slide that does not match its layout.
- An unknown `layout` value falls back to `stack`.
- The separator is three or more dashes alone on a line, with no trailing
  spaces. A `---` at the very top or bottom of the deck makes an empty slide.
- Frontmatter must be the first thing in the slide and opened by a line that
  is exactly `+++`. Key names are letters and underscores only.
- Any `date` value other than `false` prints today's date. Write `date: true`.

## Slide separator

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

Default to `stack`. Open with `title`, and reach for another layout only when
the slide has a reason for it.

- **title** — opening slide, section breaks, a single closing statement.
  Content is centred and set larger. Keep it to one heading plus one line.
- **split** — text on the left, image on the right. Needs an image.
  Best for a claim plus supporting visual. Max 4 bullets.
- **full-bleed** — image fills the slide, text sits on a dark scrim at the
  bottom. Needs an image. Use for emotional beats and chapter openers.
  Keep text to a heading and at most one line, so it stays legible.
- **stack** — default. Heading, then body, image below if present.
- **bento** — two to four related images as rounded tiles in a grid beside
  the text. With no text, the images fill the slide: the first one large on
  the left, the rest (up to five in total) on the right. Needs at least one
  image. Good for a feature showcase or a set of screenshots. For text next
  to a single image, use **split** instead.
- **media-top** — image spans the top like a card header, text below.
  Needs an image. Good for blog-style or article slides.
- **columns** — body text flows into two columns. No image needed. Use for
  dense text that would run too long as a single column.
- **frame** — a single image shown small and bordered like a framed photo,
  centred text below. Needs an image. Use for a quiet, editorial beat.

## Rules that keep decks readable

Slides get read from the back of a room in a few seconds, which is the reason
for each limit below.

1. **One idea per slide.** If a slide needs two headings, it is two slides.
2. **Six lines maximum**, counting bullets. Prefer three or four.
3. **Ten words per bullet maximum.** Cut articles before cutting meaning.
4. **Write bullets as statements, not labels.** "Churn fell 12% in Q3", not
   "Churn".
5. **No filler slides.** No "Agenda" unless the deck is over ten slides, no
   "Thank you" slide with nothing on it, no restating the title.
6. **Vary the rhythm.** Open with `title`, break sections with `title` or
   `full-bleed`, keep the body on `stack` and `split`. Never run more than
   three identical layouts back to back.
7. **Images must earn their place.** Use one when it carries meaning, not for
   decoration, and always write real alt text.
8. **Set `footer` and `date` once** on the opening slide and on any slide
   that may be screenshotted alone, not on every slide.
9. **Numbers need context.** "$1.2M ARR, up 40% YoY" beats "$1.2M".

## Images

Pick photos from this list. Every ID was checked and loads. Do not invent
Unsplash IDs: a made-up ID renders as a broken image, and you cannot tell it
is wrong. If no photo fits, leave the image out and use a text layout.

`https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=1200&q=60`

Use `w=1600` for `full-bleed`, `w=1200` for everything else.

| id | shows | good for |
| --- | --- | --- |
| `1551434678-e076c223a692` | two colleagues at laptops | team, engineering |
| `1522071820081-009f0129c71c` | team around a table with laptops | workshops, planning |
| `1519389950473-47ba0277781c` | laptops and coffee on a desk, from above | remote work, workflow |
| `1460925895917-afdab827c52f` | laptop showing an analytics dashboard | metrics, results |
| `1531297484001-80022131f5a1` | laptop glowing in the dark | product, launch |
| `1497366216548-37526070297c` | empty modern office corridor | company, culture |
| `1504384308090-c894fdcc538d` | open-plan office with many desks | scale, hiring |
| `1556761175-5973dc0f32e7` | presenter at a screen in a loft office | training, all-hands |
| `1486406146926-c627a92ad1ab` | skyscrapers seen from below | enterprise, finance |
| `1506905925346-21bda4d32df4` | sunrise over mountains and clouds | vision, chapter openers |
| `1470071459604-3b5ec3a7fe05` | green cliffs under low cloud | journey, challenge |
| `1507525428034-b723cf961d3e` | beach at sunrise | closing, wellbeing |

## Before you answer

Check the draft once, and fix anything that fails:

- every layout that needs an image has one, on its own line
- no numbered lists, links, tables, code fences or `####` headings
- no slide over six lines, no bullet over ten words
- no more than three identical layouts in a row
- no `---` at the start or end of the deck

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

![Two colleagues reviewing a product on their laptops](https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=60)
---
+++
layout: full-bleed
+++
## Next: make week two as good as day one

![Sunrise over a mountain range](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=60)
```
