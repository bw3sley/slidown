import { Monitor, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeItem } from "@/components/theme-item";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	DECK_FONT_CLASS,
	DECK_FONT_ORDER,
	DECK_FONTS,
	type DeckFontId,
} from "@/constants/deck-fonts";
import { DECK_THEME_ORDER, DECK_THEMES } from "@/constants/deck-themes";
import { useDeckStore } from "@/stores/deck-store";
import { useUiStore } from "@/stores/ui-store";

const SECTION_LABEL =
	"mb-1.5 text-xxs font-bold tracking-[0.06em] text-muted-foreground uppercase";

const APPEARANCE_ITEM =
	"flex-1 rounded-md data-[state=on]:bg-popover data-[state=on]:text-foreground data-[state=on]:shadow-xs";

export function MobileSettingsMenu() {
	const { theme, setTheme } = useTheme();
	const deckThemeId = useDeckStore((s) => s.deckThemeId);
	const customAccent = useDeckStore((s) => s.customAccent);
	const deckFontId = useDeckStore((s) => s.deckFontId);
	const setDeckTheme = useDeckStore((s) => s.setDeckTheme);
	const setDeckFont = useDeckStore((s) => s.setDeckFont);
	const open = useUiStore((s) => s.openPanel === "settings");

	function handleOpenChange(next: boolean) {
		useUiStore.getState().setOpenPanel(next ? "settings" : null);
	}

	function handleAppearanceChange(value: string) {
		if (value) {
			setTheme(value);
		}
	}

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					title="Settings"
					aria-label="Settings"
					data-testid="mobile-settings-trigger"
				>
					<Settings className="size-4" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align="end"
				size="sm"
				data-testid="mobile-settings-content"
				className="max-h-[calc(100dvh-5rem)] w-[min(18rem,calc(100vw-2rem))] origin-top-right overflow-y-auto"
			>
				<div className={SECTION_LABEL}>Appearance</div>
				<ToggleGroup
					type="single"
					variant="ghost"
					size="sm"
					value={theme ?? "system"}
					onValueChange={handleAppearanceChange}
					className="w-full rounded-lg bg-background p-0.5"
				>
					<ToggleGroupItem value="light" className={APPEARANCE_ITEM}>
						<Sun className="size-3.5" />
						Light
					</ToggleGroupItem>
					<ToggleGroupItem value="dark" className={APPEARANCE_ITEM}>
						<Moon className="size-3.5" />
						Dark
					</ToggleGroupItem>
					<ToggleGroupItem value="system" className={APPEARANCE_ITEM}>
						<Monitor className="size-3.5" />
						Auto
					</ToggleGroupItem>
				</ToggleGroup>

				<Separator className="-mx-3 my-3 data-[orientation=horizontal]:w-[calc(100%+1.5rem)]" />

				<div className={SECTION_LABEL}>Slide theme</div>
				<div className="grid grid-cols-4 gap-2">
					{DECK_THEME_ORDER.map((themeKey) => {
						const deckTheme = DECK_THEMES[themeKey];
						const isActive = themeKey === deckThemeId;

						return (
							<ThemeItem
								key={themeKey}
								themeKey={themeKey}
								label={deckTheme.label}
								bg={deckTheme.bg}
								ink={deckTheme.ink}
								accent={
									isActive && customAccent ? customAccent : deckTheme.accent
								}
								isActive={isActive}
								onSelect={setDeckTheme}
							/>
						);
					})}
				</div>

				<Separator className="-mx-3 my-3 data-[orientation=horizontal]:w-[calc(100%+1.5rem)]" />

				<div className={SECTION_LABEL}>Slide font</div>
				<Select
					value={deckFontId}
					onValueChange={(value) => setDeckFont(value as DeckFontId)}
				>
					<SelectTrigger aria-label="Slide font" data-testid="mobile-font-select">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{DECK_FONT_ORDER.map((fontKey) => (
							<SelectItem
								key={fontKey}
								value={fontKey}
								className={DECK_FONT_CLASS[fontKey]}
							>
								{DECK_FONTS[fontKey].label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</PopoverContent>
		</Popover>
	);
}
