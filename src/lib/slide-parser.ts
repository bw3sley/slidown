import type { Root, Yaml } from "mdast";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { SlideLayoutKey } from "@/constants/slide-layouts";

const SLIDE_SEPARATOR = /\n-{3,}\n/g;
const FRONTMATTER_LINE_RE = /^\s*([a-zA-Z_]+)\s*:\s*(.+?)\s*$/;

const processor = unified()
	.use(remarkParse)
	.use(remarkFrontmatter, [{ type: "yaml", fence: "+++" }]);

function parse(src: string): Root {
	return processor.parse(src) as Root;
}

function readFrontmatter(body: string): { entries: [string, string][]; rest: string } {
	const first = parse(body).children[0];
	if (first?.type !== "yaml") {return { entries: [], rest: body };}
	const entries: [string, string][] = [];
	for (const line of (first as Yaml).value.split("\n")) {
		const kv = line.match(FRONTMATTER_LINE_RE);
		if (kv) {
			entries.push([kv[1], kv[2]]);
		}
	}
	return { entries, rest: body.slice(first.position?.end.offset) };
}

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
	const codeRanges: [number, number][] = [];
	visit(parse(src), "code", (node) => {
		codeRanges.push([node.position?.start.offset ?? 0, node.position?.end.offset ?? 0]);
	});
	SLIDE_SEPARATOR.lastIndex = 0;
	for (
		let match = SLIDE_SEPARATOR.exec(src);
		match !== null;
		match = SLIDE_SEPARATOR.exec(src)
	) {
		const at = match.index + 1;
		if (codeRanges.some(([start, end]) => at > start && at < end)) {
			continue;
		}
		out.push({ text: src.slice(lastIndex, match.index), start: lastIndex });
		lastIndex = SLIDE_SEPARATOR.lastIndex;
	}
	out.push({ text: src.slice(lastIndex), start: lastIndex });
	return out;
}

export function parseFrontmatter(body: string): { meta: SlideMeta; rest: string } {
	const meta: SlideMeta = {};
	const { entries, rest } = readFrontmatter(body);
	for (const [key, raw] of entries) {
		const value = raw.trim().replace(/^["']|["']$/g, "");
		meta[key] = value === "true" ? true : value === "false" ? false : value;
	}
	return { meta, rest };
}

export function extractSlideImages(body: string): {
	images: DeckImage[];
	bodyMarkdown: string;
} {
	const lines = body.split("\n");
	const images: DeckImage[] = [];
	const imageLines = new Set<number>();
	visit(parse(body), "image", (node) => {
		const { start, end } = node.position ?? {};
		if (!start || !end || start.line !== end.line) {
			return;
		}
		const line = lines[start.line - 1].trim();
		if (line !== body.slice(start.offset, end.offset)) {
			return;
		}
		images.push({ alt: node.alt ?? "", src: node.url });
		imageLines.add(start.line - 1);
	});
	return {
		images,
		bodyMarkdown: lines.filter((_, i) => !imageLines.has(i)).join("\n"),
	};
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
	const { entries, rest } = readFrontmatter(body);
	const others = entries.filter(([key]) => key !== "layout");
	const layoutAt = entries.findIndex(([key]) => key === "layout");
	const next: [string, string][] =
		!layoutKey || layoutKey === "stack"
			? others
			: layoutAt === -1
				? [["layout", layoutKey], ...others]
				: entries.map(([key, value]) => (key === "layout" ? [key, layoutKey] : [key, value]));
	if (!next.length) {
		return rest.trim();
	}
	return `+++\n${next.map(([key, value]) => `${key}: ${value}`).join("\n")}\n+++\n${rest.trim()}`;
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
