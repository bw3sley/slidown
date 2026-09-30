import type { CSSProperties } from "react";
import {
	LAYOUT_LABELS,
	resolveLayoutKey,
	type SlideLayoutKey,
} from "@/constants/slide-layouts";
import { UI_FONT_FAMILY } from "@/constants/deck-fonts";
import type { DeckImage, SlideMeta } from "@/lib/slide-parser";

export interface LayoutGeometryOptions {
	accentColor: string;
	hasBody: boolean;
}

export interface SlideLayoutGeometry {
	key: ReturnType<typeof resolveLayoutKey>;
	label: string;
	pad: string;
	rowStyle: CSSProperties;
	contentColStyle: CSSProperties;
	bodyStyle: CSSProperties;
	headerStyle: CSSProperties;
	footerStyle: CSSProperties;
	imageSlots: CSSProperties[];
	showBleed: boolean;
	bleedWrapStyle: CSSProperties;
	scrimStyle: CSSProperties;
}

const CARD_BG = "rgba(128,128,128,.09)";
const STAGE_DESIGN_WIDTH = 1280;

type GridTile = [colStart: number, colEnd: number, rowStart: number, rowEnd: number];

interface BentoGrid {
	columns: string;
	rows: string[];
	tiles: GridTile[];
}

const GRID_TRACK = "minmax(0,1fr)";
const BENTO_WIDE_LEFT_COLUMNS = "minmax(0,1fr) minmax(0,.5fr) minmax(0,.5fr)";
const BENTO_GALLERY_COLUMNS = "minmax(0,1.4fr) minmax(0,1fr)";

const BENTO_TEXT_GRIDS: BentoGrid[] = [
	{ columns: GRID_TRACK, rows: [GRID_TRACK], tiles: [] },
	{
		columns: BENTO_WIDE_LEFT_COLUMNS,
		rows: [GRID_TRACK, GRID_TRACK],
		tiles: [[2, 4, 1, 3]],
	},
	{
		columns: BENTO_WIDE_LEFT_COLUMNS,
		rows: [GRID_TRACK, GRID_TRACK],
		tiles: [
			[2, 4, 1, 2],
			[2, 4, 2, 3],
		],
	},
	{
		columns: BENTO_WIDE_LEFT_COLUMNS,
		rows: [GRID_TRACK, GRID_TRACK],
		tiles: [
			[2, 3, 1, 2],
			[3, 4, 1, 2],
			[2, 4, 2, 3],
		],
	},
	{
		columns: BENTO_WIDE_LEFT_COLUMNS,
		rows: [GRID_TRACK, GRID_TRACK],
		tiles: [
			[2, 3, 1, 2],
			[3, 4, 1, 2],
			[2, 3, 2, 3],
			[3, 4, 2, 3],
		],
	},
];

const BENTO_GALLERY_GRIDS: BentoGrid[] = [
	{ columns: GRID_TRACK, rows: [GRID_TRACK], tiles: [] },
	{ columns: GRID_TRACK, rows: [GRID_TRACK], tiles: [[1, 2, 1, 2]] },
	{
		columns: BENTO_GALLERY_COLUMNS,
		rows: [GRID_TRACK],
		tiles: [
			[1, 2, 1, 2],
			[2, 3, 1, 2],
		],
	},
	{
		columns: BENTO_GALLERY_COLUMNS,
		rows: [GRID_TRACK, GRID_TRACK],
		tiles: [
			[1, 2, 1, 3],
			[2, 3, 1, 2],
			[2, 3, 2, 3],
		],
	},
	{
		columns: BENTO_GALLERY_COLUMNS,
		rows: [GRID_TRACK, GRID_TRACK, GRID_TRACK],
		tiles: [
			[1, 2, 1, 4],
			[2, 3, 1, 2],
			[2, 3, 2, 3],
			[2, 3, 3, 4],
		],
	},
	{
		columns: BENTO_WIDE_LEFT_COLUMNS,
		rows: [GRID_TRACK, GRID_TRACK],
		tiles: [
			[1, 2, 1, 3],
			[2, 3, 1, 2],
			[3, 4, 1, 2],
			[2, 3, 2, 3],
			[3, 4, 2, 3],
		],
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

function previewRect(
	left: number,
	top: number,
	width: number,
	height: number,
	background: string,
	opacity?: number,
): CSSProperties {
	return {
		position: "absolute",
		left,
		top,
		width,
		height,
		borderRadius: 1.5,
		background,
		opacity: opacity ?? 1,
	};
}

const LAYOUT_PREVIEW_RECTS: Record<
	SlideLayoutKey,
	(theme: LayoutPreviewTheme) => CSSProperties[]
> = {
	title: (t) => [
		previewRect(15, 13, 30, 6, t.accent),
		previewRect(19, 23, 22, 3, t.ink, 0.45),
	],
	split: (t) => [
		previewRect(6, 9, 20, 3, t.ink, 0.5),
		previewRect(6, 15, 20, 3, t.ink, 0.5),
		previewRect(6, 21, 15, 3, t.ink, 0.5),
		previewRect(34, 6, 24, 30, t.accent),
	],
	"full-bleed": (t) => [
		previewRect(0, 0, 64, 42, t.accent),
		{
			position: "absolute",
			left: 0,
			right: 0,
			bottom: 0,
			height: 16,
			background: "rgba(0,0,0,.55)",
		},
		previewRect(6, 30, 26, 3, "#fff", 0.9),
	],
	stack: (t) => [
		previewRect(6, 6, 14, 3, t.accent),
		previewRect(6, 12, 30, 5, t.ink, 0.8),
		previewRect(6, 20, 36, 3, t.ink, 0.5),
		previewRect(6, 26, 30, 3, t.ink, 0.5),
		previewRect(6, 32, 22, 3, t.ink, 0.5),
	],
	bento: (t) => [
		previewRect(6, 13, 22, 3, t.ink, 0.5),
		previewRect(6, 19, 22, 3, t.ink, 0.5),
		previewRect(6, 25, 16, 3, t.ink, 0.5),
		previewRect(33, 6, 12, 14, t.accent),
		previewRect(47, 6, 12, 14, t.accent),
		previewRect(33, 22, 26, 14, t.accent),
	],
	"media-top": (t) => [
		previewRect(4, 4, 56, 19, t.accent),
		previewRect(6, 27, 34, 3, t.ink, 0.5),
		previewRect(6, 33, 26, 3, t.ink, 0.5),
	],
	columns: (t) => [
		previewRect(6, 8, 20, 3, t.ink, 0.5),
		previewRect(6, 14, 20, 3, t.ink, 0.5),
		previewRect(6, 20, 16, 3, t.ink, 0.5),
		previewRect(6, 26, 18, 3, t.ink, 0.5),
		previewRect(34, 8, 20, 3, t.ink, 0.5),
		previewRect(34, 14, 20, 3, t.ink, 0.5),
		previewRect(34, 20, 16, 3, t.ink, 0.5),
		previewRect(34, 26, 18, 3, t.ink, 0.5),
	],
	frame: (t) => [
		{
			position: "absolute",
			left: 14,
			top: 4,
			width: 36,
			height: 22,
			borderRadius: 1.5,
			background: t.bg,
			border: `2px solid ${t.ink}`,
			boxSizing: "border-box",
			opacity: 0.9,
		},
		previewRect(18, 8, 28, 14, t.accent),
		previewRect(20, 30, 24, 3, t.ink, 0.5),
	],
};

export function getLayoutPreviewRects(
	key: SlideLayoutKey,
	theme: LayoutPreviewTheme,
): CSSProperties[] {
	return LAYOUT_PREVIEW_RECTS[key](theme);
}

export function layoutFor(
	meta: SlideMeta,
	images: DeckImage[],
	options: LayoutGeometryOptions,
): SlideLayoutGeometry {
	const key = resolveLayoutKey(meta.layout);
	const u = (px: number) => `${(px * 100) / STAGE_DESIGN_WIDTH}cqw`;
	const image = images[0] ?? null;

	const isBleed = key === "full-bleed" && !!image;
	const isSplit = key === "split" && !!image;
	const isTitle = key === "title";
	const isMediaTop = key === "media-top" && !!image;
	const isColumns = key === "columns";
	const isFrame = key === "frame" && !!image;
	const isBento = key === "bento";
	const isCenteredTitle = isTitle && !image;
	const isBentoGallery = isBento && !options.hasBody && images.length > 0;
	const hasSlideChrome = Boolean(meta.header || meta.footer || meta.date);
	const bentoGrid = bentoGridFor(isBento ? images.length : 0, options.hasBody);
	const bentoRowOffset = isBentoGallery && hasSlideChrome ? 1 : 0;

	const rowStyle: CSSProperties = isBento
		? {
				position: "relative",
				flex: 1,
				minHeight: 0,
				display: "grid",
				gridTemplateColumns: bentoGrid.columns,
				gridTemplateRows: [...(bentoRowOffset ? ["auto"] : []), ...bentoGrid.rows].join(" "),
				gap: u(18),
			}
		: {
				position: "relative",
				flex: 1,
				minHeight: 0,
				display: "flex",
				gap: isSplit ? u(56) : u(22),
				flexDirection: isSplit ? "row" : "column",
				alignItems: isFrame ? "center" : "stretch",
				justifyContent: isFrame ? "center" : "flex-start",
			};

	const contentColStyle: CSSProperties = isBento
		? {
				position: "relative",
				zIndex: 2,
				display: isBentoGallery && !hasSlideChrome ? "none" : "flex",
				flexDirection: "column",
				justifyContent: "center",
				gap: u(16),
				minWidth: 0,
				minHeight: 0,
				gridColumn: isBentoGallery ? "1 / -1" : "1",
				gridRow: isBentoGallery ? "1" : "1 / -1",
			}
		: {
				position: "relative",
				zIndex: 2,
				display: "flex",
				flexDirection: "column",
				gap: u(16),
				minWidth: 0,
				minHeight: 0,
				flex: isSplit ? "1 1 0" : isBleed || isCenteredTitle ? "1 1 auto" : "0 1 auto",
				justifyContent: isTitle || isSplit ? "center" : isBleed ? "flex-end" : "flex-start",
				alignItems: isTitle || isFrame ? "center" : "stretch",
				textAlign: isTitle || isFrame ? "center" : "left",
				padding: isBleed ? `${u(60)} ${u(72)}` : 0,
				color: isBleed ? "#fff" : "inherit",
				textShadow: isBleed ? `0 ${u(1)} ${u(22)} rgba(0,0,0,.5)` : "none",
				order: isMediaTop || isFrame ? 2 : 0,
				width: isFrame ? "100%" : "auto",
			};

	const bodyStyle: CSSProperties = {
		flex: isBleed ? "0 0 auto" : isTitle || isSplit || isBento ? "0 1 auto" : "1 1 auto",
		minHeight: 0,
		overflow: "hidden",
		fontSize: u(isTitle ? 38 : isSplit || isBento ? 28 : 32),
		lineHeight: 1.42,
		...(isColumns ? { columnCount: 2, columnGap: u(40) } : {}),
		...(isCenteredTitle ? { marginTop: meta.header ? 0 : "auto", marginBottom: "auto" } : {}),
		...(isBentoGallery ? { display: "none" } : {}),
	};

	const headerStyle: CSSProperties = {
		fontSize: u(19),
		fontWeight: 700,
		color: isBleed ? "#fff" : options.accentColor,
		letterSpacing: ".08em",
		textTransform: "uppercase",
		opacity: isBleed ? 0.85 : 1,
		flexShrink: 0,
		...(isCenteredTitle ? { marginTop: "auto" } : {}),
	};

	const footerStyle: CSSProperties = {
		display: "flex",
		gap: u(24),
		justifyContent: isTitle || isFrame ? "center" : "space-between",
		fontSize: u(18),
		opacity: 0.6,
		borderTop: isBleed ? "none" : "1px solid currentColor",
		paddingTop: u(15),
		fontFamily: UI_FONT_FAMILY,
		flexShrink: 0,
	};

	const bentoTileStyle: CSSProperties = {
		position: "relative",
		zIndex: 2,
		minHeight: 0,
		overflow: "hidden",
		borderRadius: u(14),
		boxShadow: `0 ${u(8)} ${u(24)} rgba(0,0,0,.14)`,
	};

	const inlineWrapStyle: CSSProperties = isMediaTop
		? {
				position: "relative",
				zIndex: 2,
				minHeight: u(180),
				maxHeight: u(300),
				overflow: "hidden",
				borderRadius: u(10),
				flex: "1 1 0",
				order: 1,
			}
		: isFrame
			? {
					position: "relative",
					zIndex: 2,
					overflow: "hidden",
					borderRadius: u(6),
					flex: "1 1 0",
					minHeight: u(160),
					maxHeight: u(320),
					width: "62%",
					order: 1,
					border: `${u(10)} solid ${CARD_BG}`,
					boxShadow: `0 ${u(10)} ${u(30)} rgba(0,0,0,.18)`,
					boxSizing: "border-box",
				}
			: {
					position: "relative",
					zIndex: 2,
					minHeight: 0,
					overflow: "hidden",
					borderRadius: u(10),
					flex: isSplit ? "0.8 1 0" : "1.2 1 0",
					alignSelf: "stretch",
					order: isSplit ? 1 : 0,
				};

	const imageSlots: CSSProperties[] = isBento
		? bentoGrid.tiles.map(([colStart, colEnd, rowStart, rowEnd]) => ({
				...bentoTileStyle,
				gridColumn: `${colStart} / ${colEnd}`,
				gridRow: `${rowStart + bentoRowOffset} / ${rowEnd + bentoRowOffset}`,
			}))
		: image && !isBleed
			? [inlineWrapStyle]
			: [];

	return {
		key,
		label: LAYOUT_LABELS[key],
		pad: isBleed ? u(64) : `${u(76)} ${u(92)}`,
		rowStyle,
		contentColStyle,
		bodyStyle,
		headerStyle,
		footerStyle,
		imageSlots,
		showBleed: isBleed,
		bleedWrapStyle: { position: "absolute", inset: `-${u(64)}`, zIndex: 0 },
		scrimStyle: {
			position: "absolute",
			inset: `-${u(64)}`,
			zIndex: 1,
			background:
				"linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,.34) 44%, rgba(0,0,0,.06) 100%)",
		},
	};
}

export interface SlideTextStyles {
	h1: CSSProperties;
	h2: CSSProperties;
	h3: CSSProperties;
	p: CSSProperties;
	ul: CSSProperties;
	nestedUl: CSSProperties;
	li: CSSProperties;
	liMarker: CSSProperties;
	nestedLiMarker: CSSProperties;
	blockquote: CSSProperties;
	code: CSSProperties;
}

export interface SlideTextStyleOptions {
	columns?: boolean;
}

export function getSlideTextStyles(
	accentColor: string,
	options: SlideTextStyleOptions = {},
): SlideTextStyles {
	const headingSpan: CSSProperties = options.columns ? { columnSpan: "all" } : {};

	return {
		h1: {
			margin: "0 0 .3em",
			fontSize: "1.9em",
			lineHeight: 1.06,
			fontWeight: 700,
			letterSpacing: "-.022em",
			...headingSpan,
		},
		h2: {
			margin: "0 0 .34em",
			fontSize: "1.36em",
			lineHeight: 1.14,
			fontWeight: 700,
			letterSpacing: "-.016em",
			...headingSpan,
		},
		h3: {
			margin: "0 0 .36em",
			fontSize: "1.1em",
			lineHeight: 1.2,
			fontWeight: 700,
			...headingSpan,
		},
		p: { margin: "0 0 .55em", opacity: 0.86 },
		ul: options.columns
			? { margin: "0 0 .55em", listStyle: "none" }
			: {
					margin: "0 0 .55em",
					listStyle: "none",
					display: "flex",
					flexDirection: "column",
					gap: ".32em",
				},
		nestedUl: { marginTop: ".32em", marginLeft: "1.4em" },
		li: {
			display: "flex",
			alignItems: "baseline",
			gap: ".5em",
			opacity: 0.86,
			...(options.columns ? { breakInside: "avoid", marginBottom: ".32em" } : {}),
		},
		liMarker: { color: accentColor, flexShrink: 0, fontSize: "1.3em", fontWeight: 700 },
		nestedLiMarker: { color: "currentColor", opacity: 0.5, flexShrink: 0 },
		blockquote: {
			margin: ".2em 0 .6em",
			paddingLeft: ".7em",
			borderLeft: `.125em solid ${accentColor}`,
			fontStyle: "italic",
			opacity: 0.95,
		},
		code: {
			fontFamily: "'IBM Plex Mono', monospace",
			fontSize: ".82em",
			padding: ".1em .32em",
			borderRadius: ".19em",
			background: "rgba(128,128,128,.18)",
		},
	};
}
