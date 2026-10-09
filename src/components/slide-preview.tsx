import { AddSlideTile } from "@/components/add-slide-tile";
import { SlideThumbnail } from "@/components/slide-thumbnail";
import { useDeckStore, useSlides } from "@/stores/deck-store";

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
