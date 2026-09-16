import { AI_PROVIDERS } from "@/constants/ai-providers";
import { AiClientError } from "@/http/errors/ai-error";

interface GeminiResponse {
	candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

export async function askGemini(
	apiKey: string,
	systemPrompt: string,
	userMessage: string,
): Promise<string> {
	const res = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/${AI_PROVIDERS.gemini.model}:generateContent`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
			body: JSON.stringify({
				contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
			}),
		},
	);

	if (!res.ok) {
		throw new AiClientError(`Gemini request failed (${res.status}).`);
	}

	const data = (await res.json()) as GeminiResponse;
	const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

	if (!text) {
		throw new AiClientError("The Gemini response was empty or malformed.");
	}

	return text;
}
