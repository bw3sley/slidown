---
name: verify
description: Run slidown in a browser, load a deck, and measure the slide preview layouts to verify layout or preview changes.
---

# Verify slidown preview changes

## Launch

- `npx vite --port 5199 --strictPort` in the background, with a long timeout. The default background limit kills the server after 30 min.
  - Don't use `npm run dev -- --port …` from PowerShell: npm swallows `--` and Vite gets `5173` as its root dir.
  - 5173 and 5174 are usually taken by other local projects. AGENTS.md's "port 3000" is stale.
- Open `http://localhost:5199/` with claude-in-chrome. Vite also serves repo-root files, e.g. `/example.md`.

## Load a deck

The deck persists in `localStorage["slidown-v2:deck:%2F"]` (key is `slidown-v2:deck:<encoded board path>`) as `{"state":{"markdown": "..."},"version":0}`. The old `slidown-v1:default` key is only a read-once fallback and is ignored once the v2 key exists. Other keys (`deckThemeId`, `deckFontId`, ...) fall back to defaults when omitted. Open the app once first so the v2 key exists, then edit it:

```js
const md = (await import('/src/constants/starter-deck.ts')).DEFAULT_MD.replace(/\r\n/g, '\n');
const key = 'slidown-v2:deck:%2F';
const cur = JSON.parse(localStorage.getItem(key));
cur.state.markdown = md;
localStorage.setItem(key, JSON.stringify(cur));
location.reload();
```

- Use real photos for image slides, e.g. `![Photo](https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80)`, and check `stage.querySelectorAll('img')` is non-empty.
- Test a light slide (heading plus one line) and a text-heavy one.
- Starter deck: `(await import('/src/constants/starter-deck.ts')).DEFAULT_MD`.
- Font probe: set `state.deckFontId` to `'mono'`. It's the widest font and the harshest fit test.

## Drive and measure

- Slide thumbnails: `[...document.querySelectorAll('footer [role=button]')].filter(t => /^\s*\d+/.test(t.innerText))`.
  - Use `.click()`, then wait on a few `queueMicrotask` ticks. React 19 flushes click updates in microtasks.
- Stage: `document.querySelector('.aspect-video > div.absolute.inset-0')`. It is sized with container units, so divide rects by `stage.width / 1280` to get design coordinates on the 1280x720 canvas.
- Useful checks per slide:
  - every element stays inside the stage padding box (76/92px, or 64px for full-bleed)
  - the body satisfies `scrollHeight <= clientHeight` and `scrollWidth <= clientWidth`; a wider scroll means content went into hidden multicol columns
  - each `li` rect falls within the body rect
  - columns: every `li` top is below the h2 bottom, and `getClientRects().length === 1`
  - title: equal space above the content and above the footer
- Pane size probes: set `flex:none; width; height` on the `.aspect-video` parent and check a 16:9 stage that fits and is capped at 1280px. Restore the style afterwards.

## Gotchas

- The Chrome window must be visible. When it's minimized or covered, `visibilityState` is `hidden`: screenshots and `requestAnimationFrame` hang, and timers are throttled. Synchronous JS still works.
- Reload between manual DOM style experiments. React does not reset style props it didn't change.
- After probes, restore the user's deck. Keep a copy in `sessionStorage` before overwriting.
