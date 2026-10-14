export type AiErrorType =
	| "missing_key"
	| "provider_error"
	| "model_refusal"
	| "empty_response"
	| "network_error"
	| "unknown";

export class AiClientError extends Error {
	readonly type: AiErrorType;

	constructor(
		message: string,
		type: AiErrorType = "unknown",
		cause?: unknown,
	) {
		super(message, cause !== undefined ? { cause } : undefined);

		this.name = "AiClientError";
		this.type = type;
	}
}
