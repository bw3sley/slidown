import { Check } from "lucide-react";

import type { DeckFontId } from "@/constants/deck-fonts";
import { cn } from "@/lib/utils";

interface FontPickerItemProps {
	fontKey: DeckFontId;
	label: string;
	fontClassName: string;
	isActive: boolean;
	onSelect: (key: DeckFontId) => void;
}

export function FontPickerItem({
	fontKey,
	label,
	fontClassName,
	isActive,
	onSelect,
}: FontPickerItemProps) {
	return (
		<button
			type="button"
			onClick={() => onSelect(fontKey)}
			className={cn(
				"flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
				isActive && "bg-accent text-accent-foreground",
			)}
		>
			<span className={cn("w-6 shrink-0 text-sm", fontClassName)}>Aa</span>
			<span className="flex-1 text-left">{label}</span>
			{isActive ? <Check className="size-3.5" /> : null}
		</button>
	);
}
