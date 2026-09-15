import { ChevronDown, Sun } from "lucide-react";

import { AccentItem } from "@/components/accent-item";
import { ThemeItem } from "@/components/theme-item";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
	ACCENTS,
	DECK_THEME_ORDER,
	DECK_THEMES,
} from "@/constants/deck-themes";
import { useDeckStore } from "@/stores/deck-store";
import { useUiStore } from "@/stores/ui-store";

export function ThemePicker() {
	const deckThemeId = useDeckStore((s) => s.deckThemeId);
	const customAccent = useDeckStore((s) => s.customAccent);
	const setDeckTheme = useDeckStore((s) => s.setDeckTheme);
	const setCustomAccent = useDeckStore((s) => s.setCustomAccent);
	const open = useUiStore((s) => s.openPanel === "theme");

	function handleOpenChange(next: boolean) {
		useUiStore.getState().setOpenPanel(next ? "theme" : null);
	}

	const activeTheme = DECK_THEMES[deckThemeId];
	const activeAccent = customAccent ?? activeTheme.accent;

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-sm transition-colors hover:bg-accent">
				<span
					className="size-5 shrink-0 rounded-[5px] border border-[rgba(130,130,145,.38)]"
					style={{
						background: activeTheme.bg,
						boxShadow: `inset -6px 0 0 ${activeAccent}`,
					}}
				/>
				<span className="font-semibold">{activeTheme.label}</span>
				<ChevronDown className="size-3 opacity-45" />
			</PopoverTrigger>

			<PopoverContent align="end" size="sm" className="w-64 origin-top-right">
				<div className="mb-1.5 text-xxs font-bold tracking-[0.06em] text-muted-foreground uppercase">
					Slide theme
				</div>

				<div className="grid grid-cols-5 gap-2">
					{DECK_THEME_ORDER.map((themeKey) => {
						const theme = DECK_THEMES[themeKey];
						const isActive = themeKey === deckThemeId;

						return (
							<ThemeItem
								key={themeKey}
								themeKey={themeKey}
								label={theme.label}
								bg={theme.bg}
								ink={theme.ink}
								accent={isActive && customAccent ? customAccent : theme.accent}
								isActive={isActive}
								onSelect={setDeckTheme}
							/>
						);
					})}
				</div>

				<Separator className="my-3" />

				<div className="mb-1.5 text-xxs font-bold tracking-[0.06em] text-muted-foreground uppercase">
					Accent
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						title="Use theme default"
						onClick={() => setCustomAccent(null)}
						className="flex size-5.5 cursor-pointer items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition-transform hover:scale-110"
					>
						<Sun className="size-3" />
					</button>

					{ACCENTS.map((hex) => (
						<AccentItem
							key={hex}
							hex={hex}
							isActive={customAccent === hex}
							onSelect={setCustomAccent}
						/>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
