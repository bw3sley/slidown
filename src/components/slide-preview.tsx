import { Plus } from "lucide-react";

import { SlideThumbnail } from "@/components/slide-thumbnail";
import { useDeckStore, useSlides } from "@/stores/deck-store";

function AddSlideTile() {
	const addSlide = useDeckStore((s) => s.addSlide);
	return (
		<button
			type="button"
			onClick={() => addSlide()}
			title="Add slide"
			className="flex h-17 w-10.5 shrink-0 items-center justify-center rounded-[9px] border-[1.5px] border-dashed border-border text-muted-foreground transition-colors hover:bg-accent"
		>
			<Plus className="size-4.5" />
		</button>
	);
}

export function SlidePreview() {
	const slides = useSlides();
	const activeSlideIndex = useDeckStore((s) => s.activeSlideIndex);

	return (
		<footer className="flex h-24 shrink-0 items-center gap-2.5 overflow-x-auto overflow-y-hidden border-t border-border bg-card px-4">
			{slides.map((slide, index) => (
				<SlideThumbnail
					key={slide.line}
					slide={slide}
					index={index}
					isActive={index === activeSlideIndex}
					canDelete={slides.length > 1}
				/>
			))}
			<AddSlideTile />
		</footer>
	);
}
