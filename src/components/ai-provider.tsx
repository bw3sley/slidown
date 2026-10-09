import { Sparkles, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputControl, InputRoot } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AI_PROVIDER_ORDER, AI_PROVIDERS } from "@/constants/ai-providers";
import type { AiProviderId } from "@/constants/ai-providers";
import { useAiStore } from "@/stores/ai-store";
import { useUiStore } from "@/stores/ui-store";
import { DownloadSkillButton } from "./download-skill";

export function AiProvider() {
	const provider = useAiStore((state) => state.provider);
	const apiKeys = useAiStore((state) => state.apiKeys);
	const prompt = useAiStore((state) => state.prompt);
	const loading = useAiStore((state) => state.loading);
	const feedback = useAiStore((state) => state.feedback);
	const error = useAiStore((state) => state.error);
	const setProvider = useAiStore((state) => state.setProvider);
	const setApiKey = useAiStore((state) => state.setApiKey);
	const setPrompt = useAiStore((state) => state.setPrompt);
	const generateDeck = useAiStore((state) => state.generateDeck);
	const evaluateDeck = useAiStore((state) => state.evaluateDeck);

	const openPanel = useUiStore((state) => state.openPanel);
	const setOpenPanel = useUiStore((state) => state.setOpenPanel);

	const open = openPanel === "ai";

	return (
		<Popover
			open={open}
			onOpenChange={(nextOpen) => setOpenPanel(nextOpen ? "ai" : null)}
		>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					className="absolute right-6 bottom-6 size-13 rounded-full shadow-[0_10px_26px_rgba(0,0,0,.22)] transition-transform hover:scale-105"
				>
					<Sparkles className="fill-current" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				side="top"
				size="lg"
				className="max-h-[68vh] w-96 overflow-y-auto"
			>
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<span className="font-semibold">Ask AI</span>
						<Button
							variant="ghost"
							size="icon"
							className="size-6.5"
							onClick={() => setOpenPanel(null)}
						>
							<X />
						</Button>
					</div>

					<DownloadSkillButton
						className="w-full justify-start"
						variant="secondary"
					/>

					<ToggleGroup
						type="single"
						variant="pill"
						size="sm"
						value={provider}
						onValueChange={(value) => {
							if (value) {
								setProvider(value as AiProviderId);
							}
						}}
					>
						{AI_PROVIDER_ORDER.map((id) => (
							<ToggleGroupItem key={id} value={id}>
								{AI_PROVIDERS[id].label}
							</ToggleGroupItem>
						))}
					</ToggleGroup>

					<InputRoot>
						<Label htmlFor="ai-api-key">API key</Label>
						<InputControl
							id="ai-api-key"
							type="password"
							placeholder={AI_PROVIDERS[provider].keyPlaceholder}
							value={apiKeys[provider]}
							onChange={(event) => setApiKey(provider, event.target.value)}
						/>
					</InputRoot>

					<Textarea
						placeholder="Describe the deck you want or leave blank and press Evaluate to critique the current one"
						value={prompt}
						onChange={(event) => setPrompt(event.target.value)}
					/>

					<div className="flex items-center gap-2">
						<Button
							className="flex-1"
							disabled={loading}
							onClick={() => generateDeck()}
						>
							{loading ? "Thinking…" : "Generate deck"}
						</Button>

						<Button
							className="flex-1"
							variant="outline"
							disabled={loading}
							onClick={() => evaluateDeck()}
						>
							{loading ? "Thinking…" : "Evaluate deck"}
						</Button>
					</div>

					{error ? (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					) : null}

					{feedback ? (
						<Alert variant="accent">
							<AlertDescription className="whitespace-pre-wrap">
								{feedback}
							</AlertDescription>
						</Alert>
					) : null}
				</div>
			</PopoverContent>
		</Popover>
	);
}
