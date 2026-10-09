import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import type { DeckThemeId } from "@/constants/deck-themes";
import { cn } from "@/lib/utils";

interface ThemeItemProps {
	themeKey: DeckThemeId;
	label: string;
	bg: string;
	ink: string;
	accent: string;
	isActive: boolean;
	onSelect: (key: DeckThemeId) => void;
}

export function ThemeItem({
	themeKey,
	label,
	bg,
	ink,
	accent,
	isActive,
	onSelect,
}: ThemeItemProps) {
	return (
		<button
			type="button"
			title={label}
			onClick={() => onSelect(themeKey)}
			className="flex cursor-pointer flex-col gap-1.5 transition-transform hover:-translate-y-px"
		>
			<div
				className={cn(
					"relative h-9.5 overflow-hidden rounded-lg border",
					isActive
						? "border-2 shadow-[0_0_0_3px_var(--theme-picker-ring)]"
						: "border-[rgba(130,130,145,.32)]",
				)}
				style={
					{
						background: bg,
						borderColor: isActive ? accent : undefined,
						"--theme-picker-ring": isActive ? `${accent}33` : undefined,
					} as CSSProperties
				}
			>
				<span
					className="absolute bottom-1.75 left-1.75 h-1 w-4.5 rounded-[3px]"
					style={{ background: accent }}
				/>

				{isActive ? (
					<Check
						className="absolute top-1.25 right-1.25 size-3"
						style={{ color: ink }}
					/>
				) : null}
			</div>

			<span
				className="text-center text-xs font-medium"
				style={{ color: isActive ? accent : undefined }}
			>
				{label}
			</span>
		</button>
	);
}
