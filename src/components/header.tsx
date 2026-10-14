import { Presentation } from "lucide-react";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { FontPicker } from "@/components/font-picker";
import { MobileSettingsMenu } from "@/components/mobile-settings-menu";
import { ShareButton } from "@/components/share-button";
import { ThemePicker } from "@/components/theme-picker";

export function Header() {
	return (
		<header className="flex h-15 items-center justify-between border-b border-border bg-card px-4.5">
			<div className="flex items-center gap-2.5">
				<div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
					<Presentation className="size-4" />
				</div>
				<span className="text-base font-bold tracking-tight">slidown</span>
			</div>

			<div className="flex items-center gap-1.5">
				<div className="hidden items-center gap-1.5 md:flex">
					<ThemePicker />
					<FontPicker />
					<DarkModeToggle />
				</div>
				<div className="md:hidden">
					<MobileSettingsMenu />
				</div>
				<ShareButton />
			</div>
		</header>
	);
}
