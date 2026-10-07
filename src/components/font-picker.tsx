import { ChevronDown } from "lucide-react";
import { FontPickerItem } from "@/components/font-picker-item";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	DECK_FONT_CLASS,
	DECK_FONT_ORDER,
	DECK_FONTS,
} from "@/constants/deck-fonts";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/stores/deck-store";
import { useUiStore } from "@/stores/ui-store";

export function FontPicker() {
	const deckFontId = useDeckStore((s) => s.deckFontId);
	const setDeckFont = useDeckStore((s) => s.setDeckFont);
	const open = useUiStore((s) => s.openPanel === "font");

	function handleOpenChange(next: boolean) {
		useUiStore.getState().setOpenPanel(next ? "font" : null);
	}

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-sm transition-colors hover:bg-accent">
				<span
					className={cn(
						"flex size-6 shrink-0 items-center justify-center text-base font-semibold",
						DECK_FONT_CLASS[deckFontId],
					)}
				>
					Aa
				</span>
				<ChevronDown className="size-3 opacity-45" />
			</PopoverTrigger>

			<PopoverContent align="end" size="sm" className="w-48 origin-top-right">
				<div className="mb-1.5 text-xxs font-bold tracking-[0.06em] text-muted-foreground uppercase">
					Slide font
				</div>

				<div className="flex flex-col gap-0.5">
					{DECK_FONT_ORDER.map((fontKey) => {
						const font = DECK_FONTS[fontKey];
						return (
							<FontPickerItem
								key={fontKey}
								fontKey={fontKey}
								label={font.label}
								fontClassName={DECK_FONT_CLASS[fontKey]}
								isActive={fontKey === deckFontId}
								onSelect={(key) => {
									setDeckFont(key);
									useUiStore.getState().setOpenPanel(null);
								}}
							/>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}
