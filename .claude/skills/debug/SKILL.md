---
name: debug
description: Debug slidown preview, layout or parser problems: compare before/after against the original code, isolate parser vs layout, and avoid known pitfalls in slide-layout.ts and the browser tooling.
---

# Debug slidown preview problems

Use `verify` to launch the app and load a deck. Use this skill when something renders wrong or a refactor must not change the output.

## Parser or layout?

- `src/lib/slide-parser.ts` (remark) produces `ParsedSlide`: `meta`, `images`, `bodyMarkdown`, `line`. `src/lib/slide-layout.ts` only turns that into classes. Check the parsed slide first; if `images` is empty, the layout is not at fault.
- Run `npm run build` and `npm run lint`, then use `verify` to check representative parser and layout cases in the browser. There are no parser or layout test files yet.
- Image syntax follows CommonMark: a URL with a space needs `<my image.png>` or `%20`. The old regex parser accepted spaces.

## Before/after comparison

1. In the browser, dump per element for every slide: tag, left, top, width, height (divide rects by `stage.width / 1280`), fontSize, display, opacity, color, radius, textAlign, fontWeight. Include `img` elements, or images are not compared. Save the dump in `localStorage`.
2. Change the code, reload, dump again, diff row by row.
3. For the original code: `git worktree add --detach ../slidown-old HEAD`, junction `node_modules` into it (`mklink /J`), run Vite on another port. Clean up by removing the junction with `rmdir` first, then `git worktree remove`. Never `rm -rf` a worktree that has the junction.

## Known pitfalls

- Layout classes in `slide-layout.ts` must be written out literally. Interpolated names like `rounded-${n}` are never emitted by Tailwind's scanner.
- `tailwind-merge` drops an earlier `leading-*` when a `text-[length:...]` class follows. Use `[line-height:...]`.
- Design pixels come from `--spacing: calc(100cqw / 1280)` on the stage, so `gap-18` is 18 design px. Elements outside the stage do not get it.
- With heavy text, title and stack layouts leave the image 0px tall. This is the original behavior, not a regression.
- A hidden Chrome window throttles `setTimeout`, so long awaits time out with a CDP error. Wait with `await Promise.resolve()` loops, and check `document.visibilityState`.
- Overwriting the deck in `localStorage` replaces the user's deck. Copy it to `sessionStorage` first.
