import { AI_PROVIDERS } from "@/constants/ai-providers";

import { AiClientError } from "@/http/errors/ai-error";

interface OpenAiResponse {
	choices?: Array<{ message?: { content?: string } }>;
}

export async function askOpenAi(
	apiKey: string,
	systemPrompt: string,
	userMessage: string,
): Promise<string> {
	const res = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: AI_PROVIDERS.openai.model,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userMessage },
			],
		}),
	});

	if (!res.ok) {
		throw new AiClientError(`OpenAI request failed (${res.status}).`);
	}

	const data = (await res.json()) as OpenAiResponse;
	
	const text = data.choices?.[0]?.message?.content;
	
	if (!text) {
		throw new AiClientError("The OpenAI response was empty or malformed.");
	}
	
	return text;
}
