export const LAYOUT_ORDER = [
	"title",
	"split",
	"full-bleed",
	"stack",
	"bento",
	"media-top",
	"columns",
	"frame",
] as const;

export type SlideLayoutKey = (typeof LAYOUT_ORDER)[number];

export const LAYOUT_LABELS = {
	stack: "Stack",
	title: "Title",
	split: "Split",
	"full-bleed": "Full bleed",
	bento: "Bento",
	"media-top": "Media top",
	columns: "Columns",
	frame: "Frame",
} as const satisfies Record<SlideLayoutKey, string>;

export function resolveLayoutKey(layout: string | undefined): SlideLayoutKey {
	return layout && layout in LAYOUT_LABELS
		? (layout as SlideLayoutKey)
		: "stack";
}
