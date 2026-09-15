export interface DeckTheme {
	label: string;
	bg: string;
	ink: string;
	accent: string;
}

export const DECK_THEMES = {
	paper: { label: "Paper", bg: "#F6F1E7", ink: "#221F1A", accent: "#C1592F" },
	linen: { label: "Linen", bg: "#FBFAF7", ink: "#26262B", accent: "#3A6EA5" },
	sand: { label: "Sand", bg: "#E8DCC8", ink: "#2C2519", accent: "#8A6A3B" },
	ocean: { label: "Ocean", bg: "#0F3A52", ink: "#F3F7F8", accent: "#6FC3D6" },
	forest: { label: "Forest", bg: "#16352C", ink: "#EFF5F1", accent: "#8FD3A8" },
	plum: { label: "Plum", bg: "#2E1B36", ink: "#F6EEF8", accent: "#D79BE8" },
	sunset: { label: "Sunset", bg: "#E3572E", ink: "#FFF6EF", accent: "#FFD9A6" },
	slate: { label: "Slate", bg: "#2B2F36", ink: "#EDEFF2", accent: "#9FB4D0" },
	mono: { label: "Mono", bg: "#141414", ink: "#FFFFFF", accent: "#9A9A9A" },
	snow: { label: "Snow", bg: "#FFFFFF", ink: "#111114", accent: "#2B4ACB" },
} as const satisfies Record<string, DeckTheme>;

export type DeckThemeId = keyof typeof DECK_THEMES;

export const DECK_THEME_ORDER = Object.keys(DECK_THEMES) as DeckThemeId[];

export const ACCENTS = [
	"#C1592F",
	"#E0603E",
	"#D79BE8",
	"#8FD3A8",
	"#3A6EA5",
	"#6FC3D6",
	"#F0B429",
	"#8A8A94",
] as const;

export function resolveDeckTheme(
	id: DeckThemeId,
	customAccent: string | null,
): DeckTheme {
	const base = DECK_THEMES[id] ?? DECK_THEMES.paper;
	return customAccent ? { ...base, accent: customAccent } : base;
}
