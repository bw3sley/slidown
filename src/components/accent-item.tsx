import { cn } from "@/lib/utils";

interface AccentItemProps {
	hex: string;
	isActive: boolean;
	onSelect: (hex: string) => void;
}

export function AccentItem({ hex, isActive, onSelect }: AccentItemProps) {
	return (
		<button
			type="button"
			title={hex}
			onClick={() => onSelect(hex)}
			className={cn(
				"size-5.5 cursor-pointer rounded-full border transition-transform hover:scale-110",
				isActive ? "border-[2.5px] border-foreground" : "border-border",
			)}
			style={{ background: hex }}
		/>
	);
}
