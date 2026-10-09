import { X } from "lucide-react";
import type { DragEvent, KeyboardEvent, MouseEvent } from "react";
import { DECK_FONT_CLASS } from "@/constants/deck-fonts";
import { LAYOUT_LABELS, resolveLayoutKey } from "@/constants/slide-layouts";
import { excerptFor, type ParsedSlide } from "@/lib/slide-parser";
import { cn } from "@/lib/utils";
import { useDeckStore, useResolvedDeckTheme } from "@/stores/deck-store";

interface SlideThumbnailProps {
	slide: ParsedSlide;
	index: number;
	isActive: boolean;
	canDelete: boolean;
}

export function SlideThumbnail({
	slide,
	index,
	isActive,
	canDelete,
}: SlideThumbnailProps) {
	const setActiveSlideIndex = useDeckStore((s) => s.setActiveSlideIndex);
	const deleteSlide = useDeckStore((s) => s.deleteSlide);
	const reorderSlide = useDeckStore((s) => s.reorderSlide);
	const deckFontId = useDeckStore((s) => s.deckFontId);
	const theme = useResolvedDeckTheme();

	const layoutKey = resolveLayoutKey(slide.meta.layout);

	function handleDragStart(e: DragEvent<HTMLDivElement>) {
		e.dataTransfer.setData("text/plain", String(index));
	}

	function handleDragOver(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
	}

	function handleDrop(e: DragEvent<HTMLDivElement>) {
		e.preventDefault();
		const from = Number(e.dataTransfer.getData("text/plain"));
		if (!Number.isNaN(from) && from !== index) {
			reorderSlide(from, index);
		}
	}

	function handleDelete(e: MouseEvent) {
		e.stopPropagation();
		deleteSlide(index);
	}

	function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setActiveSlideIndex(index);
		}
	}

	return (
		// biome-ignore lint/a11y/useSemanticElements: contains a nested delete <button>, which a real <button> can't host
		<div
			draggable
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			onClick={() => setActiveSlideIndex(index)}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
			aria-label={`Slide ${index + 1}: ${excerptFor(slide.raw)}`}
			aria-current={isActive}
			title={`Slide ${index + 1} · ${LAYOUT_LABELS[layoutKey]}`}
			className={cn(
				"relative flex h-17 w-28 shrink-0 cursor-pointer flex-col justify-between rounded-[9px] border p-1.75 text-left shadow-sm transition-transform outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				DECK_FONT_CLASS[deckFontId],
				isActive
					? "border-2 shadow-[0_5px_14px_rgba(0,0,0,.16)]"
					: "border-border",
			)}
			style={{
				background: theme.bg,
				color: theme.ink,
				borderColor: isActive ? theme.accent : undefined,
			}}
		>
			{canDelete ? (
				<button
					type="button"
					onClick={handleDelete}
					aria-label={`Delete slide ${index + 1}`}
					className="absolute -top-1.75 -right-1.75 flex size-4.5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"
				>
					<X className="size-2.5" />
				</button>
			) : null}

			<div
				className="flex items-center justify-between gap-1"
				style={{ paddingRight: canDelete ? 13 : 0 }}
			>
				<span className="text-xxs font-bold opacity-50">{index + 1}</span>
				{layoutKey !== "stack" ? (
					<span
						className="overflow-hidden text-xxs font-bold tracking-wider text-ellipsis whitespace-nowrap uppercase"
						style={{ color: theme.accent }}
					>
						{LAYOUT_LABELS[layoutKey]}
					</span>
				) : null}
			</div>

			<p className="line-clamp-2 text-xxs leading-tight">
				{excerptFor(slide.raw)}
			</p>
		</div>
	);
}
