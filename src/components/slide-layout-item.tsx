import type { CSSProperties } from "react";

import type { SlideLayoutKey } from "@/constants/slide-layouts";
import { cn } from "@/lib/utils";

interface SlideLayoutItemProps {
	layoutKey: SlideLayoutKey;
	label: string;
	rects: CSSProperties[];
	previewBg: string;
	accent: string;
	isActive: boolean;
	onSelect: (key: SlideLayoutKey) => void;
}

export function SlideLayoutItem({
	layoutKey,
	label,
	rects,
	previewBg,
	accent,
	isActive,
	onSelect,
}: SlideLayoutItemProps) {
	return (
		<button
			type="button"
			title={label}
			onClick={() => onSelect(layoutKey)}
			className="flex cursor-pointer flex-col gap-1.5 transition-transform hover:-translate-y-px"
		>
			<div
				className={cn(
					"relative mx-auto h-10.5 w-16 overflow-hidden rounded-md border",
					isActive
						? "border-2 shadow-[0_0_0_3px_var(--layout-picker-ring)]"
						: "border-[rgba(130,130,145,.32)]",
				)}
				style={
					{
						background: previewBg,
						borderColor: isActive ? accent : undefined,
						"--layout-picker-ring": isActive ? `${accent}33` : undefined,
					} as CSSProperties
				}
			>
				{rects.map((rectStyle, i) => (
					<div key={i} style={rectStyle} />
				))}
			</div>

			<span
				className={cn(
					"text-xxs font-semibold",
					isActive ? "" : "text-muted-foreground",
				)}
				style={{ color: isActive ? accent : undefined }}
			>
				{label}
			</span>
		</button>
	);
}
