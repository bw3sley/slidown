import type { SlideLayoutKey } from "@/constants/slide-layouts";

const SLIDE_SEPARATOR = /\n-{3,}\n/g;
const FRONTMATTER_RE = /^\+\+\+\n([\s\S]*?)\n\+\+\+\n?/;
const FRONTMATTER_LINE_RE = /^\s*([a-zA-Z_]+)\s*:\s*(.+?)\s*$/;
const IMAGE_LINE_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

export type SlideMetaValue = string | boolean;

export interface SlideMeta {
	layout?: string;
	header?: string;
	footer?: string;
	date?: SlideMetaValue;
	[key: string]: SlideMetaValue | undefined;
}

export interface DeckImage {
	alt: string;
	src: string;
}

export interface ParsedSlide {
	index: number;
	meta: SlideMeta;
	source: string;
	raw: string;
	bodyMarkdown: string;
	images: DeckImage[];
	line: number;
}

export interface SlideChunk {
	text: string;
	start: number;
}

export function splitSlides(markdown: string): SlideChunk[] {
	const src = (markdown || "").replace(/\r\n/g, "\n");
	const out: SlideChunk[] = [];
	let lastIndex = 0;
	SLIDE_SEPARATOR.lastIndex = 0;
	for (
		let match = SLIDE_SEPARATOR.exec(src);
		match !== null;
		match = SLIDE_SEPARATOR.exec(src)
	) {
		out.push({ text: src.slice(lastIndex, match.index), start: lastIndex });
		lastIndex = SLIDE_SEPARATOR.lastIndex;
	}
	out.push({ text: src.slice(lastIndex), start: lastIndex });
	return out;
}

export function parseFrontmatter(body: string): { meta: SlideMeta; rest: string } {
	const meta: SlideMeta = {};
	const fm = body.match(FRONTMATTER_RE);
	if (!fm) return { meta, rest: body };
	for (const line of fm[1].split("\n")) {
		const kv = line.match(FRONTMATTER_LINE_RE);
		if (!kv) continue;
		let value: SlideMetaValue = kv[2].trim().replace(/^["']|["']$/g, "");
		if (value === "true") value = true;
		else if (value === "false") value = false;
		meta[kv[1].trim()] = value;
	}
	return { meta, rest: body.slice(fm[0].length) };
}

export function extractSlideImages(body: string): {
	images: DeckImage[];
	bodyMarkdown: string;
} {
	const images: DeckImage[] = [];
	const kept: string[] = [];
	for (const line of body.split("\n")) {
		const match = line.trim().match(IMAGE_LINE_RE);
		if (match) {
			images.push({ alt: match[1], src: match[2] });
			continue;
		}
		kept.push(line);
	}
	return { images, bodyMarkdown: kept.join("\n") };
}

export function parseDeck(markdown: string): ParsedSlide[] {
	return splitSlides(markdown).map((chunk, i) => {
		const body = chunk.text.trim();
		const { meta, rest } = parseFrontmatter(body);
		const trimmedRest = rest.trim();
		const { images, bodyMarkdown } = extractSlideImages(trimmedRest);
		const lineOffset = markdown.slice(0, chunk.start).split("\n").length;
		return {
			index: i,
			meta,
			source: body,
			raw: trimmedRest,
			bodyMarkdown,
			images,
			line: lineOffset,
		};
	});
}

export function joinSlides(rawTexts: string[]): string {
	return rawTexts.map((t) => t.trim()).join("\n---\n");
}

export function setSlideLayout(
	sourceText: string,
	layoutKey: SlideLayoutKey,
): string {
	const body = (sourceText || "").trim();
	const fm = body.match(FRONTMATTER_RE);
	const meta: Record<string, string> = {};
	const order: string[] = [];
	let rest = body;
	if (fm) {
		for (const line of fm[1].split("\n")) {
			const kv = line.match(FRONTMATTER_LINE_RE);
			if (!kv) continue;
			meta[kv[1].trim()] = kv[2].trim();
			order.push(kv[1].trim());
		}
		rest = body.slice(fm[0].length);
	}
	if (layoutKey && layoutKey !== "stack") meta.layout = layoutKey;
	else delete meta.layout;
	if (!order.includes("layout") && meta.layout) order.unshift("layout");
	const keys = order.filter((k) => k in meta);
	if (!keys.length) return rest.trim();
	const fmBlock = `+++\n${keys.map((k) => `${k}: ${meta[k]}`).join("\n")}\n+++`;
	return `${fmBlock}\n${rest.trim()}`;
}

export function excerptFor(raw: string): string {
	const firstLine =
		raw
			.split("\n")
			.find((line) => line.trim().length > 0)
			?.replace(/^#+\s*/, "")
			.replace(/^>\s*/, "")
			.replace(/^[-*]\s*/, "")
			.trim() ?? "Empty slide";
	return firstLine.slice(0, 42);
}
