import { AI_PROVIDERS } from "@/constants/ai-providers";
import { AiClientError } from "@/lib/ai-error";

interface ClaudeResponse {
	stop_reason?: string;
	content?: Array<{ type: string; text?: string }>;
}

export async function askClaude(
	apiKey: string,
	systemPrompt: string,
	userMessage: string,
): Promise<string> {
	const res = await fetch("https://api.anthropic.com/v1/messages", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey,
			"anthropic-version": "2023-06-01",
			"anthropic-dangerous-direct-browser-access": "true",
		},
		body: JSON.stringify({
			model: AI_PROVIDERS.claude.model,
			max_tokens: 8000,
			system: systemPrompt,
			messages: [{ role: "user", content: userMessage }],
		}),
	});

	if (!res.ok) {
		throw new AiClientError(`Anthropic request failed (${res.status}).`);
	}

	const data = (await res.json()) as ClaudeResponse;
	
	if (data.stop_reason === "refusal") {
		throw new AiClientError("The model declined this request.");
	}

	const text = (data.content ?? [])
		.filter((block) => block.type === "text")
		.map((block) => block.text ?? "")
		.join("");
	
		if (!text) {
		throw new AiClientError("The Claude response was empty or malformed.");
	}
	
	return text;
}
