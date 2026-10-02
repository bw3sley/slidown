import type { CSSProperties } from "react";
import { tv } from "tailwind-variants";
import {
	LAYOUT_LABELS,
	resolveLayoutKey,
	type SlideLayoutKey,
} from "@/constants/slide-layouts";
import type { DeckImage, SlideMeta } from "@/lib/slide-parser";

/**
 * Slide geometry is authored in a 1280px design space. The stage sets
 * `--spacing: STAGE_SPACING`, so every Tailwind spacing utility inside it
 * (`gap-18`, `py-76`, ...) is that many design pixels, scaled by the stage width.
 */
export const STAGE_SPACING = "calc(100cqw / 1280)";

const FS = {
	18: "text-[length:calc(var(--spacing)*18)]",
	19: "text-[length:calc(var(--spacing)*19)]",
	28: "text-[length:calc(var(--spacing)*28)]",
	32: "text-[length:calc(var(--spacing)*32)]",
	38: "text-[length:calc(var(--spacing)*38)]",
} as const;
const ROUNDED = {
	6: "rounded-[calc(var(--spacing)*6)]",
	10: "rounded-[calc(var(--spacing)*10)]",
	14: "rounded-[calc(var(--spacing)*14)]",
} as const;

export interface LayoutGeometryOptions {
	hasBody: boolean;
}

export interface SlideLayoutGeometry {
	key: SlideLayoutKey;
	label: string;
	pad: string;
	rowClass: string;
	rowStyle: CSSProperties;
	contentColClass: string;
	bodyClass: string;
	headerClass: string;
	footerClass: string;
	imageSlots: { className: string; style?: CSSProperties }[];
	showBleed: boolean;
}

export const STAGE_BLEED_CLASS = "absolute -inset-64 z-0";
export const STAGE_SCRIM_CLASS =
	"absolute -inset-64 z-1 bg-[linear-gradient(to_top,rgba(0,0,0,.72)_0%,rgba(0,0,0,.34)_44%,rgba(0,0,0,.06)_100%)]";

const slide = tv({
	slots: {
		row: "relative flex min-h-0 flex-1 flex-col items-stretch justify-start gap-22",
		contentCol:
			"relative z-2 flex min-h-0 min-w-0 flex-col gap-16 flex-initial items-stretch justify-start text-left w-auto order-0",
		body: "min-h-0 flex-auto overflow-hidden [line-height:1.42] " + FS[32],
		header:
			"shrink-0 text-(--accent) font-bold tracking-[.08em] uppercase " + FS[19],
		footer:
			"flex shrink-0 justify-between gap-24 border-t border-current pt-15 font-['Plus_Jakarta_Sans',sans-serif] opacity-60 " +
			FS[18],
	},
	variants: {
		isTitle: {
			true: {
				contentCol: "justify-center items-center text-center",
				body: "flex-initial " + FS[38],
				footer: "justify-center",
			},
		},
		isCenteredTitle: {
			true: {
				contentCol: "flex-auto",
				body: "mb-auto",
				header: "mt-auto",
			},
		},
		isSplit: {
			true: {
				row: "flex-row gap-56",
				contentCol: "flex-[1_1_0] justify-center",
				body: "flex-initial " + FS[28],
			},
		},
		isBleed: {
			true: {
				contentCol:
					"flex-auto justify-end px-72 py-60 text-white [text-shadow:0_calc(var(--spacing)*1)_calc(var(--spacing)*22)_rgba(0,0,0,.5)]",
				body: "flex-none",
				header: "text-white opacity-85",
				footer: "border-t-0",
			},
		},
		isFrame: {
			true: {
				row: "items-center justify-center",
				contentCol: "items-center text-center order-2 w-full",
				footer: "justify-center",
			},
		},
		isMediaTop: { true: { contentCol: "order-2" } },
		isColumns: { true: { body: "columns-2 gap-x-40" } },
		isBento: {
			true: {
				row: "grid gap-18",
				contentCol: "justify-center text-start",
				body: "flex-initial " + FS[28],
			},
		},
		bentoCol: {
			gallery: { contentCol: "col-[1/-1] row-1", body: "hidden" },
			text: { contentCol: "col-1 row-[1/-1]" },
		},
		hideContent: { true: { contentCol: "hidden" } },
		noHeader: { true: {} },
	},
	compoundVariants: [
		{ isCenteredTitle: true, noHeader: true, class: { body: "mt-auto" } },
	],
});

const imageSlot = tv({
	base: "relative z-2 min-h-0 overflow-hidden",
	variants: {
		kind: {
			inline: `self-stretch ${ROUNDED[10]} flex-[1.2_1_0] order-0`,
			split: `self-stretch ${ROUNDED[10]} flex-[0.8_1_0] order-1`,
			mediaTop: `min-h-180 max-h-300 ${ROUNDED[10]} flex-[1_1_0] order-1`,
			frame:
				`min-h-160 max-h-320 w-[62%] ${ROUNDED[6]} flex-[1_1_0] order-1 border-[length:calc(var(--spacing)*10)] border-[rgba(128,128,128,.09)] shadow-[0_calc(var(--spacing)*10)_calc(var(--spacing)*30)_rgba(0,0,0,.18)]`,
			bento: `${ROUNDED[14]} shadow-[0_calc(var(--spacing)*8)_calc(var(--spacing)*24)_rgba(0,0,0,.14)]`,
		},
	},
});

type GridTile = [number, number, number, number];
interface BentoGrid {
	columns: string;
	rows: number;
	tiles: GridTile[];
}

const ONE = "minmax(0,1fr)";
const WIDE_LEFT = "minmax(0,1fr) minmax(0,.5fr) minmax(0,.5fr)";
const GALLERY = "minmax(0,1.4fr) minmax(0,1fr)";

const BENTO_TEXT_GRIDS: BentoGrid[] = [
	{ columns: ONE, rows: 1, tiles: [] },
	{ columns: WIDE_LEFT, rows: 2, tiles: [[2, 4, 1, 3]] },
	{ columns: WIDE_LEFT, rows: 2, tiles: [[2, 4, 1, 2], [2, 4, 2, 3]] },
	{ columns: WIDE_LEFT, rows: 2, tiles: [[2, 3, 1, 2], [3, 4, 1, 2], [2, 4, 2, 3]] },
	{
		columns: WIDE_LEFT,
		rows: 2,
		tiles: [[2, 3, 1, 2], [3, 4, 1, 2], [2, 3, 2, 3], [3, 4, 2, 3]],
	},
];

const BENTO_GALLERY_GRIDS: BentoGrid[] = [
	{ columns: ONE, rows: 1, tiles: [] },
	{ columns: ONE, rows: 1, tiles: [[1, 2, 1, 2]] },
	{ columns: GALLERY, rows: 1, tiles: [[1, 2, 1, 2], [2, 3, 1, 2]] },
	{ columns: GALLERY, rows: 2, tiles: [[1, 2, 1, 3], [2, 3, 1, 2], [2, 3, 2, 3]] },
	{
		columns: GALLERY,
		rows: 3,
		tiles: [[1, 2, 1, 4], [2, 3, 1, 2], [2, 3, 2, 3], [2, 3, 3, 4]],
	},
	{
		columns: WIDE_LEFT,
		rows: 2,
		tiles: [[1, 2, 1, 3], [2, 3, 1, 2], [3, 4, 1, 2], [2, 3, 2, 3], [3, 4, 2, 3]],
	},
];

function bentoGridFor(imageCount: number, hasBody: boolean): BentoGrid {
	const grids = hasBody || imageCount === 0 ? BENTO_TEXT_GRIDS : BENTO_GALLERY_GRIDS;
	return grids[Math.min(imageCount, grids.length - 1)];
}

export interface LayoutPreviewTheme {
	bg: string;
	ink: string;
	accent: string;
}

type PreviewTone = "bg" | "ink" | "accent" | (string & {});
type PreviewRect = [x: number, y: number, w: number, h: number, tone: PreviewTone, opacity?: number];

type PreviewShape = PreviewRect | CSSProperties;

const T = "accent" as const;
const I = "ink" as const;
function textLines(x: number, ys: number[], widths: number[]): PreviewRect[] {
	return ys.map((y, i) => [x, y, widths[i], 3, I, 0.5]);
}

const LAYOUT_PREVIEW_RECTS: Record<SlideLayoutKey, PreviewShape[]> = {
	title: [[15, 13, 30, 6, T], [19, 23, 22, 3, I, 0.45]],
	split: [...textLines(6, [9, 15, 21], [20, 20, 15]), [34, 6, 24, 30, T]],
	"full-bleed": [[0, 0, 64, 42, T], { position: "absolute", left: 0, right: 0, bottom: 0, height: 16, background: "rgba(0,0,0,.55)" }, [6, 30, 26, 3, "#fff", 0.9]],
	stack: [[6, 6, 14, 3, T], [6, 12, 30, 5, I, 0.8], ...textLines(6, [20, 26, 32], [36, 30, 22])],
	bento: [
		...textLines(6, [13, 19, 25], [22, 22, 16]),
		[33, 6, 12, 14, T],
		[47, 6, 12, 14, T],
		[33, 22, 26, 14, T],
	],
	"media-top": [[4, 4, 56, 19, T], ...textLines(6, [27, 33], [34, 26])],
	columns: [
		...textLines(6, [8, 14, 20, 26], [20, 20, 16, 18]),
		...textLines(34, [8, 14, 20, 26], [20, 20, 16, 18]),
	],
	frame: [[14, 4, 36, 22, "bg", 0.9], [18, 8, 28, 14, T], [20, 30, 24, 3, I, 0.5]],
};

export function getLayoutPreviewRects(
	key: SlideLayoutKey,
	theme: LayoutPreviewTheme,
): CSSProperties[] {
	return LAYOUT_PREVIEW_RECTS[key].map((shape) => {
		if (!Array.isArray(shape)) {
			return shape;
		}
		const [left, top, width, height, tone, opacity = 1] = shape;
		return {
			position: "absolute",
			left,
			top,
			width,
			height,
			borderRadius: 1.5,
			opacity,
			background: tone in theme ? theme[tone as keyof LayoutPreviewTheme] : tone,
			...(tone === "bg" ? { border: `2px solid ${theme.ink}`, boxSizing: "border-box" as const } : {}),
		};
	});
}

export function layoutFor(
	meta: SlideMeta,
	images: DeckImage[],
	options: LayoutGeometryOptions,
): SlideLayoutGeometry {
	const key = resolveLayoutKey(meta.layout);
	const hasImage = images.length > 0;

	const isBleed = key === "full-bleed" && hasImage;
	const isSplit = key === "split" && hasImage;
	const isTitle = key === "title";
	const isMediaTop = key === "media-top" && hasImage;
	const isColumns = key === "columns";
	const isFrame = key === "frame" && hasImage;
	const isBento = key === "bento";
	const isBentoGallery = isBento && !options.hasBody && hasImage;
	const hasSlideChrome = Boolean(meta.header || meta.footer || meta.date);

	const slots = slide({
		isTitle,
		isCenteredTitle: isTitle && !hasImage,
		isSplit,
		isBleed,
		isFrame,
		isMediaTop,
		isColumns,
		isBento,
		bentoCol: isBento ? (isBentoGallery ? "gallery" : "text") : undefined,
		hideContent: isBentoGallery && !hasSlideChrome,
		noHeader: !meta.header,
	});

	const bentoGrid = bentoGridFor(isBento ? images.length : 0, options.hasBody);
	const rowOffset = isBentoGallery && hasSlideChrome ? 1 : 0;
	const rowStyle: CSSProperties = isBento
		? {
				gridTemplateColumns: bentoGrid.columns,
				gridTemplateRows: [...(rowOffset ? ["auto"] : []), ...Array(bentoGrid.rows).fill(ONE)].join(" "),
			}
		: {};

	const imageSlots: SlideLayoutGeometry["imageSlots"] = isBento
		? bentoGrid.tiles.map(([colStart, colEnd, rowStart, rowEnd]) => ({
				className: imageSlot({ kind: "bento" }),
				style: {
					gridColumn: `${colStart} / ${colEnd}`,
					gridRow: `${rowStart + rowOffset} / ${rowEnd + rowOffset}`,
				},
			}))
		: hasImage && !isBleed
			? [
					{
						className: imageSlot({
							kind: isMediaTop ? "mediaTop" : isFrame ? "frame" : isSplit ? "split" : "inline",
						}),
					},
				]
			: [];

	return {
		key,
		label: LAYOUT_LABELS[key],
		pad: isBleed ? "p-64" : "py-76 px-92",
		rowClass: slots.row(),
		rowStyle,
		contentColClass: slots.contentCol(),
		bodyClass: slots.body(),
		headerClass: slots.header(),
		footerClass: slots.footer(),
		imageSlots,
		showBleed: isBleed,
	};
}

const text = tv({
	slots: {
		h1: "mb-[.3em] text-[1.9em] leading-[1.06] font-bold tracking-[-.022em]",
		h2: "mb-[.34em] text-[1.36em] leading-[1.14] font-bold tracking-[-.016em]",
		h3: "mb-[.36em] text-[1.1em] leading-[1.2] font-bold",
		p: "mb-[.55em] opacity-[.86]",
		ul: "mb-[.55em] list-none flex flex-col gap-[.32em]",
		nestedUl: "mt-[.32em] ml-[1.4em]",
		li: "flex items-baseline gap-[.5em] opacity-[.86]",
		liMarker: "shrink-0 text-[1.3em] font-bold text-(--accent)",
		nestedLiMarker: "shrink-0 text-current opacity-50",
		blockquote: "mt-[.2em] mb-[.6em] border-l-[.125em] border-(--accent) pl-[.7em] italic opacity-95",
		code: "rounded-[.19em] bg-[rgba(128,128,128,.18)] px-[.32em] py-[.1em] font-['IBM_Plex_Mono',monospace] text-[.82em]",
	},
	variants: {
		columns: {
			true: {
				h1: "[column-span:all]",
				h2: "[column-span:all]",
				h3: "[column-span:all]",
				ul: "block",
				li: "break-inside-avoid mb-[.32em]",
			},
		},
	},
});

export type SlideTextClasses = ReturnType<typeof getSlideTextClasses>;

export function getSlideTextClasses(options: { columns?: boolean } = {}) {
	const slots = text({ columns: options.columns });
	return {
		h1: slots.h1(),
		h2: slots.h2(),
		h3: slots.h3(),
		p: slots.p(),
		ul: slots.ul(),
		nestedUl: slots.nestedUl(),
		li: slots.li(),
		liMarker: slots.liMarker(),
		nestedLiMarker: slots.nestedLiMarker(),
		blockquote: slots.blockquote(),
		code: slots.code(),
	};
}
