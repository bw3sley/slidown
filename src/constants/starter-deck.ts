export const DEFAULT_MD = `+++
layout: title
footer: slidown
date: true
+++

# Welcome to slidown

Write your slides in plain markdown — no menus required.

---

## The basics
- Separate slides with a line of \`---\`
- Use \`#\` and \`##\` for titles
- Use \`-\` for bullet lists
- **Bold** and *italic* work as you'd expect

---

## Quotes

> Simplicity is the ultimate sophistication.

Start a line with \`>\` to add a quote.

---

+++
layout: split
+++

## Split layout

Text on the left, image on the right.

![A mountain lake at sunrise](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=60)

---

+++
layout: full-bleed
+++

## Full bleed

The image fills the slide, text sits on top.

![Forest road from above](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=60)

---

+++
header: Getting fancy
footer: slidown · Product deck
date: true
+++

## Per-slide extras

Start a slide with a \`+++\` block to set:
- \`layout\` — \`title\`, \`split\`, \`full-bleed\` or \`stack\`
- \`header\` — a small label above the slide
- \`footer\` — text pinned to the bottom
- \`date\` — show today's date

---

## Make it yours

- Pick a theme, accent and font from the header ↑
- Ask AI to draft or critique your deck, bottom right →
- Share a link or export to PDF / PPTX when you're done`;
