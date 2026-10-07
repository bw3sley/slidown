import { FilePlus } from "lucide-react";
import { AiProvider } from "@/components/ai-provider";
import { Button } from "@/components/ui/button";
import {
	EmptyState,
	EmptyStateAction,
	EmptyStateDescription,
	EmptyStateIcon,
	EmptyStateTitle,
} from "@/components/ui/empty-state";
import { DECK_FONT_CLASS } from "@/constants/deck-fonts";
import type { EmptyKind } from "@/lib/slide-parser";
import { cn } from "@/lib/utils";
import { useDeckStore, useResolvedDeckTheme } from "@/stores/deck-store";

export interface EmptySlideProps {
	kind: EmptyKind | null;
}

export function EmptySlide({ kind }: EmptySlideProps) {
	const theme = useResolvedDeckTheme();
	const deckFontId = useDeckStore((s) => s.deckFontId);

	return (
		<div className="@container-size relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-background p-8">
			<div className="@container relative aspect-video w-[min(100cqw,calc(100cqh*16/9),1280px)]">
				<div
					className={cn(
						DECK_FONT_CLASS[deckFontId],
						"absolute inset-0 box-border flex items-center justify-center overflow-hidden rounded-[1.09375cqw]",
					)}
					style={{
						background: theme.bg,
						color: theme.ink,
						boxShadow: "0 1.5625cqw 3.90625cqw rgba(0,0,0,.18)",
					}}
				>
					<EmptyState className="text-current">
						<EmptyStateIcon>
							<FilePlus />
						</EmptyStateIcon>
						<EmptyStateTitle>
							{kind === "slide" ? "This slide is empty" : "Nothing to show yet"}
						</EmptyStateTitle>
						<EmptyStateDescription className="text-current opacity-60">
							{kind === "slide"
								? "Add a heading, some bullets or an image to this slide in the editor on the left."
								: "Start typing markdown on the left. Slides split on a line of ---."}
						</EmptyStateDescription>
						<EmptyStateAction>
							<Button
								onClick={() => useDeckStore.getState().insertStarterDeck()}
							>
								Insert starter deck
							</Button>
						</EmptyStateAction>
					</EmptyState>
				</div>
			</div>

			<AiProvider />
		</div>
	);
}
