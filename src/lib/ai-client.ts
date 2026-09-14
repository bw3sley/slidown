import { AI_PROVIDERS, type AiProviderId } from "@/constants/ai-providers";
import { askClaude } from "@/http/ask-claude";
import { askGemini } from "@/http/ask-gemini";
import { askOpenAi } from "@/http/ask-openai";
import { AiClientError } from "@/lib/ai-error";

export { AiClientError };

const REQUEST_BY_PROVIDER: Record<
	AiProviderId,
	(apiKey: string, systemPrompt: string, userMessage: string) => Promise<string>
> = {
	claude: askClaude,
	gemini: askGemini,
	openai: askOpenAi,
};

export async function callModel(
	provider: AiProviderId,
	apiKey: string,
	systemPrompt: string,
	userMessage: string,
): Promise<string> {
	if (!apiKey) {
		const article = provider === "gemini" ? "a" : "an";

		throw new AiClientError(
			`Add ${article} ${AI_PROVIDERS[provider].keyPlaceholder} first.`,
		);
	}
	try {
		return await REQUEST_BY_PROVIDER[provider](apiKey, systemPrompt, userMessage);
	} catch (err) {
		if (err instanceof AiClientError) throw err;
		throw new AiClientError("Network error while contacting the model.", err);
	}
}
