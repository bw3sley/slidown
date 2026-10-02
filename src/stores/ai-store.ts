import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { AiProviderId } from "@/constants/ai-providers";
import { createBoardStorage, getBoardStorageKey } from "@/stores/board-storage";
import { callModel } from "@/lib/ai-client";
import { SLIDE_CRITIQUE_SYSTEM_PROMPT } from "@/prompts/slide-critique";
import {
	EMPTY_DECK_REQUEST_PROMPT,
	SLIDE_GENERATION_SYSTEM_PROMPT,
} from "@/prompts/slide-generation";
import { useDeckStore } from "@/stores/deck-store";
import { AiClientError } from "@/http/errors/ai-error";

interface AiState {
	provider: AiProviderId;
	apiKeys: Record<AiProviderId, string>;
	prompt: string;
	loading: boolean;
	feedback: string | null;
	error: string | null;

	setProvider(id: AiProviderId): void;
	setApiKey(id: AiProviderId, key: string): void;
	setPrompt(text: string): void;
	generateDeck(): Promise<void>;
	evaluateDeck(): Promise<void>;
}

export const useAiStore = create<AiState>()(
	persist(
		immer((set, get) => ({
			provider: "claude",
			apiKeys: { claude: "", openai: "", gemini: "" },
			prompt: "",
			loading: false,
			feedback: null,
			error: null,

			setProvider: (id) =>
				set((state) => {
					state.provider = id;
				}),

			setApiKey: (id, key) =>
				set((state) => {
					state.apiKeys[id] = key;
				}),

			setPrompt: (text) =>
				set((state) => {
					state.prompt = text;
				}),

			generateDeck: async () => {
				const { provider, apiKeys, prompt } = get();

				set((state) => {
					state.loading = true;
					state.error = null;
				});

				try {
					const text = await callModel(
						provider,
						apiKeys[provider],
						SLIDE_GENERATION_SYSTEM_PROMPT,
						prompt || EMPTY_DECK_REQUEST_PROMPT,
					);

					useDeckStore.getState().setMarkdown(text.trim());

					set((state) => {
						state.loading = false;
					});
				}

				catch (err) {
					set((state) => {
						state.loading = false;
						state.error =
							err instanceof AiClientError
								? err.message
								: "Something went wrong generating the deck.";
					});
				}
			},

			evaluateDeck: async () => {
				const { provider, apiKeys } = get();

				const markdown = useDeckStore.getState().markdown;

				set((state) => {
					state.loading = true;
					state.error = null;
					state.feedback = null;
				});

				try {
					const text = await callModel(
						provider,
						apiKeys[provider],
						SLIDE_CRITIQUE_SYSTEM_PROMPT,
						markdown,
					);

					set((state) => {
						state.loading = false;
						state.feedback = text.trim();
					});
				}

				catch (err) {
					set((state) => {
						state.loading = false;
						state.error =
							err instanceof AiClientError
								? err.message
								: "Something went wrong evaluating the deck.";
					});
				}
			},
		})),
		{
			name: getBoardStorageKey(undefined, "ai"),
			storage: createJSONStorage(() => createBoardStorage("ai")),
			partialize: (state) => ({ provider: state.provider, apiKeys: state.apiKeys }),
		},
	),
);
