export interface DeckFont {
	label: string;
	family: string;
}

export const DECK_FONTS = {
	sans: { label: "Sans", family: "'Plus Jakarta Sans', sans-serif" },
	serif: { label: "Serif", family: "'Source Serif 4', serif" },
	mono: { label: "Mono", family: "'IBM Plex Mono', monospace" },
} as const satisfies Record<string, DeckFont>;

export type DeckFontId = keyof typeof DECK_FONTS;

export const DECK_FONT_ORDER = Object.keys(DECK_FONTS) as DeckFontId[];

export const DECK_FONT_CLASS = {
	sans: "font-deck-sans",
	serif: "font-deck-serif",
	mono: "font-deck-mono",
} as const satisfies Record<DeckFontId, string>;

export const UI_FONT_FAMILY = "'Plus Jakarta Sans', sans-serif";
