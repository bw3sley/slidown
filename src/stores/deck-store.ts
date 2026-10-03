
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import {
	type DeckFontId,
	DECK_FONT_ORDER,
} from "@/constants/deck-fonts";

import {
	type DeckTheme,
	type DeckThemeId,
	resolveDeckTheme,
} from "@/constants/deck-themes";

import type { SlideLayoutKey } from "@/constants/slide-layouts";

import { DEFAULT_MD } from "@/constants/starter-deck";

import { createBoardStorage, getBoardStorageKey } from "@/stores/board-storage";

import {
	joinSlides,
	parseDeck,
	type ParsedSlide,
	setSlideLayout as setSlideLayoutSource,
} from "@/lib/slide-parser";

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
	markdown: "",
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
			},

			deleteSlide: (i) => {
				const sources = parseDeck(get().markdown).map((s) => s.source);
				if (sources.length <= 1) {
					return;
				}
				sources.splice(i, 1);
				set((state) => {
					state.markdown = joinSlides(sources);
					state.activeSlideIndex = Math.max(0, i - 1);
				});
			},

			reorderSlide: (from, to) => {
				const sources = parseDeck(get().markdown).map((s) => s.source);
				const [moved] = sources.splice(from, 1);
				if (moved === undefined) {
					return;
				}
				sources.splice(to, 0, moved);
				set((state) => {
					state.markdown = joinSlides(sources);
					state.activeSlideIndex = to;
				});
			},

			setActiveSlideLayout: (key) => {
				const slides = parseDeck(get().markdown);
				const idx = get().activeSlideIndex;
				const active = slides[idx];
				if (!active) {
					return;
				}
				const sources = slides.map((s) => s.source);
				sources[idx] = setSlideLayoutSource(active.source, key);
				set((state) => {
					state.markdown = joinSlides(sources);
				});
			},

			setDeckTheme: (id) =>
				set((state) => {
					state.deckThemeId = id;
				}),

			setCustomAccent: (hex) =>
				set((state) => {
					state.customAccent = hex;
				}),

			setDeckFont: (id) =>
				set((state) => {
					state.deckFontId = id;
				}),

			insertStarterDeck: () =>
				set((state) => {
					state.markdown = DEFAULT_MD;
					state.activeSlideIndex = 0;
				}),
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
