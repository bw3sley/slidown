// Business-logic helper: markdown deck parsing + tiny markdown renderer.
const SEP = /\n-{3,}\n/g;

export function splitSlides(md) {
  const src = (md || '').replace(/\r\n/g, '\n');
  const out = [];
  let lastIndex = 0;
  let m;
  SEP.lastIndex = 0;
  while ((m = SEP.exec(src))) {
    out.push({ text: src.slice(lastIndex, m.index), start: lastIndex });
    lastIndex = SEP.lastIndex;
  }
  out.push({ text: src.slice(lastIndex), start: lastIndex });
  return out;
}

function parseFrontmatter(body) {
  const meta = {};
  const fm = body.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+\n?/);
  if (!fm) return { meta, rest: body };
  fm[1].split('\n').forEach((line) => {
    const kv = line.match(/^\s*([a-zA-Z_]+)\s*:\s*(.+?)\s*$/);
    if (!kv) return;
    let val = kv[2].trim().replace(/^["']|["']$/g, '');
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    meta[kv[1].trim()] = val;
  });
  return { meta, rest: body.slice(fm[0].length) };
}

function inlineFmt(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

export function renderMarkdown(src) {
  const lines = src.split('\n');
  let html = '';
  let inList = false;
  let image = null;
  lines.forEach((line) => {
    const t = line.trim();
    if (!t) { if (inList) { html += '</ul>'; inList = false; } return; }
    const img = t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) { image = { alt: img[1], src: img[2] }; return; }
    if (/^#{1,3}\s/.test(t)) {
      if (inList) { html += '</ul>'; inList = false; }
      const level = t.match(/^#+/)[0].length;
      html += `<h${level}>${inlineFmt(t.replace(/^#+\s*/, ''))}</h${level}>`;
      return;
    }
    if (/^>\s?/.test(t)) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<blockquote>${inlineFmt(t.replace(/^>\s?/, ''))}</blockquote>`;
      return;
    }
    if (/^[-*]\s/.test(t)) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inlineFmt(t.replace(/^[-*]\s/, ''))}</li>`;
      return;
    }
    if (inList) { html += '</ul>'; inList = false; }
    html += `<p>${inlineFmt(t)}</p>`;
  });
  if (inList) html += '</ul>';
  return { html, image };
}

export function parseDeck(md) {
  return splitSlides(md).map((chunk, i) => {
    const body = chunk.text.trim();
    const { meta, rest } = parseFrontmatter(body);
    const rendered = renderMarkdown(rest.trim());
    const lineOffset = md.slice(0, chunk.start).split('\n').length;
    return { index: i, meta, source: body, raw: rest.trim(), html: rendered.html, image: rendered.image, line: lineOffset };
  });
}

export function joinSlides(rawTexts) {
  return rawTexts.map((t) => t.trim()).join('\n---\n');
}

// Rewrites (or inserts) the layout key in a slide's +++ front-matter block,
// preserving any other keys already set.
export function setSlideLayout(sourceText, layoutKey) {
  const body = (sourceText || '').trim();
  const fm = body.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+\n?/);
  const meta = {};
  const order = [];
  let rest = body;
  if (fm) {
    fm[1].split('\n').forEach((line) => {
      const kv = line.match(/^\s*([a-zA-Z_]+)\s*:\s*(.+?)\s*$/);
      if (!kv) return;
      meta[kv[1].trim()] = kv[2].trim();
      order.push(kv[1].trim());
    });
    rest = body.slice(fm[0].length);
  }
  if (layoutKey && layoutKey !== 'stack') meta.layout = layoutKey;
  else delete meta.layout;
  if (!order.includes('layout') && meta.layout) order.unshift('layout');
  const keys = order.filter((k) => k in meta);
  if (!keys.length) return rest.trim();
  const fmBlock = '+++\n' + keys.map((k) => `${k}: ${meta[k]}`).join('\n') + '\n+++';
  return fmBlock + '\n' + rest.trim();
}
