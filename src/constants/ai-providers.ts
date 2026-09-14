export interface AiProviderConfig {
	label: string;
	keyPlaceholder: string;
	model: string;
}

export const AI_PROVIDERS = {
	claude: {
		label: "Claude",
		keyPlaceholder: "Anthropic API key",
		model: "claude-sonnet-5",
	},
	openai: {
		label: "OpenAI",
		keyPlaceholder: "OpenAI API key",
		model: "gpt-5.5",
	},
	gemini: {
		label: "Gemini",
		keyPlaceholder: "Gemini API key",
		model: "gemini-3.1-pro",
	},
} as const satisfies Record<string, AiProviderConfig>;

export type AiProviderId = keyof typeof AI_PROVIDERS;

export const AI_PROVIDER_ORDER = Object.keys(AI_PROVIDERS) as AiProviderId[];
