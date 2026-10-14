import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { type DeckFontId, DECK_FONT_ORDER } from "@/constants/deck-fonts";
import {
	type DeckTheme,
	type DeckThemeId,
	resolveDeckTheme,
} from "@/constants/deck-themes";
import type { SlideLayoutKey } from "@/constants/slide-layouts";
import { DEFAULT_MD } from "@/constants/starter-deck";
import { track } from "@/lib/analytics";
import {
	joinSlides,
	parseDeck,
	type ParsedSlide,
	setSlideLayout as setSlideLayoutSource,
} from "@/lib/slide-parser";
import { createBoardStorage, getBoardStorageKey } from "@/stores/board-storage";

interface DeckState {
	markdown: string;
	activeSlideIndex: number;
	deckThemeId: DeckThemeId;
	customAccent: string | null;
	deckFontId: DeckFontId;

	setMarkdown(next: string): void;
	setActiveSlideIndex(i: number): void;
	addSlide(): void;
	deleteSlide(i: number): void;
	reorderSlide(from: number, to: number): void;
	setActiveSlideLayout(key: SlideLayoutKey): void;
	setDeckTheme(id: DeckThemeId): void;
	setCustomAccent(hex: string | null): void;
	setDeckFont(id: DeckFontId): void;
	insertStarterDeck(): void;
}

function clampActiveIndex(index: number, slideCount: number): number {
	return Math.max(0, Math.min(index, slideCount - 1));
}

const initialDeckData: Pick<
	DeckState,
	"markdown" | "deckThemeId" | "customAccent" | "deckFontId"
> = {
	markdown: DEFAULT_MD,
	deckThemeId: "paper",
	customAccent: null,
	deckFontId: DECK_FONT_ORDER[0],
};

export const useDeckStore = create<DeckState>()(
	persist(
		immer((set, get) => ({
			...initialDeckData,
			activeSlideIndex: 0,

			setMarkdown: (next) =>
				set((state) => {
					state.markdown = next;
					const slideCount = parseDeck(next).length;
					state.activeSlideIndex = clampActiveIndex(
						state.activeSlideIndex,
						slideCount,
					);
				}),

			setActiveSlideIndex: (i) =>
				set((state) => {
					const slideCount = parseDeck(state.markdown).length;
					state.activeSlideIndex = clampActiveIndex(i, slideCount);
				}),

			addSlide: () => {
				const sources = parseDeck(get().markdown).map((s) => s.source);
				sources.push("## New slide\nWrite something here.");
				set((state) => {
					state.markdown = joinSlides(sources);
					state.activeSlideIndex = sources.length - 1;
				});
				track({ event: "slide_added", properties: { slide_count: sources.length } });
			},

			deleteSlide: (i) => {
				const sources = parseDeck(get().markdown).map((s) => s.source);
				if (sources.length <= 1 || i < 0 || i >= sources.length) {
					return;
				}
				sources.splice(i, 1);
				set((state) => {
					state.markdown = joinSlides(sources);
					state.activeSlideIndex = Math.max(0, i - 1);
				});
				track({ event: "slide_deleted", properties: { slide_count: sources.length } });
			},

			reorderSlide: (from, to) => {
				const sources = parseDeck(get().markdown).map((s) => s.source);
				if (from === to || to < 0 || to >= sources.length) {
					return;
				}
				const [moved] = sources.splice(from, 1);
				if (moved === undefined) {
					return;
				}
				sources.splice(to, 0, moved);
				set((state) => {
					state.markdown = joinSlides(sources);
					state.activeSlideIndex = to;
				});
				track({ event: "slide_reordered" });
			},

			setActiveSlideLayout: (key) => {
				const slides = parseDeck(get().markdown);
				const idx = get().activeSlideIndex;
				const active = slides[idx];
				if (!active) {
					return;
				}
				const sources = slides.map((s) => s.source);
				const nextSource = setSlideLayoutSource(active.source, key);
				if (nextSource === active.source) {
					return;
				}
				sources[idx] = nextSource;
				set((state) => {
					state.markdown = joinSlides(sources);
				});
				track({ event: "layout_changed", properties: { layout: key } });
			},

			setDeckTheme: (id) => {
				if (get().deckThemeId === id) {
					return;
				}
				set((state) => {
					state.deckThemeId = id;
				});
				track({ event: "theme_changed", properties: { theme: id } });
			},

			setCustomAccent: (hex) => {
				if (get().customAccent === hex) {
					return;
				}
				set((state) => {
					state.customAccent = hex;
				});
				track({ event: "accent_changed" });
			},

			setDeckFont: (id) => {
				if (get().deckFontId === id) {
					return;
				}
				set((state) => {
					state.deckFontId = id;
				});
				track({ event: "font_changed", properties: { font: id } });
			},

			insertStarterDeck: () => {
				if (get().markdown === DEFAULT_MD) {
					return;
				}
				set((state) => {
					state.markdown = DEFAULT_MD;
					state.activeSlideIndex = 0;
				});
				track({ event: "deck_started_from_template" });
			},
		})),
		{
			name: getBoardStorageKey(),
			storage: createJSONStorage(() =>
				createBoardStorage(
					"deck",
					JSON.stringify({ state: initialDeckData, version: 0 }),
				),
			),
			partialize: (state) => ({
				markdown: state.markdown,
				deckThemeId: state.deckThemeId,
				customAccent: state.customAccent,
				deckFontId: state.deckFontId,
			}),
		},
	),
);

export function useSlides(): ParsedSlide[] {
	const markdown = useDeckStore((s) => s.markdown);
	return parseDeck(markdown);
}

export function useActiveSlide(): ParsedSlide | undefined {
	const slides = useSlides();
	const activeSlideIndex = useDeckStore((s) => s.activeSlideIndex);
	return slides[activeSlideIndex];
}

export function useResolvedDeckTheme(): DeckTheme {
	const deckThemeId = useDeckStore((s) => s.deckThemeId);
	const customAccent = useDeckStore((s) => s.customAccent);
	return resolveDeckTheme(deckThemeId, customAccent);
}
