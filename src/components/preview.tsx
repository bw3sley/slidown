import { AiProvider } from "@/components/ai-provider";
import { EmptySlide } from "@/components/empty-slide";
import { SlideMarkdown } from "@/components/slide-markdown";
import { TemplatePicker } from "@/components/template-picker";
import { DECK_FONT_CLASS } from "@/constants/deck-fonts";
import { dayjs } from "@/lib/dayjs";
import {
	layoutFor,
	STAGE_BLEED_CLASS,
	STAGE_SCRIM_CLASS,
	STAGE_SPACING,
} from "@/lib/slide-layout";
import { getEmptyKind } from "@/lib/slide-parser";
import { cn } from "@/lib/utils";
import {
	useActiveSlide,
	useDeckStore,
	useResolvedDeckTheme,
} from "@/stores/deck-store";

export function Preview() {
	const activeSlide = useActiveSlide();
	const theme = useResolvedDeckTheme();
	const deckFontId = useDeckStore((s) => s.deckFontId);

	const markdown = useDeckStore((s) => s.markdown);
	const emptyKind = getEmptyKind(markdown, activeSlide);

	if (emptyKind || !activeSlide) {
		return <EmptySlide kind={emptyKind} />;
	}

	const leadImage = activeSlide.images[0] ?? null;
	const geometry = layoutFor(activeSlide.meta, activeSlide.images, {
		hasBody: activeSlide.bodyMarkdown.trim().length > 0,
	});
	const showFooterBar = Boolean(
		activeSlide.meta.footer || activeSlide.meta.date,
	);

	return (
		<div className="@container-size relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-background p-8">
			<div className="@container relative aspect-video w-[min(100cqw,calc(100cqh*16/9),1280px)]">
				<TemplatePicker className="absolute -top-8 left-0" />

				<div
					className={cn(
						DECK_FONT_CLASS[deckFontId],
						"absolute inset-0 box-border flex flex-col overflow-hidden rounded-[1.09375cqw]",
						geometry.pad,
					)}
					style={
						{
							background: theme.bg,
							color: theme.ink,
							boxShadow: "0 1.5625cqw 3.90625cqw rgba(0,0,0,.18)",
							"--spacing": STAGE_SPACING,
							"--accent": theme.accent,
						} as React.CSSProperties
					}
				>
					<div className={geometry.rowClass} style={geometry.rowStyle}>
						{geometry.showBleed && leadImage ? (
							<>
								<div className={STAGE_BLEED_CLASS}>
									<img
										src={leadImage.src}
										alt={leadImage.alt}
										className="h-full w-full object-cover"
									/>
								</div>
								<div className={STAGE_SCRIM_CLASS} />
							</>
						) : null}

						{geometry.imageSlots.map((slot, index) => {
							const slideImage = activeSlide.images[index];

							return (
								<div
									key={`${index}:${slideImage.src}`}
									className={slot.className}
									style={slot.style}
								>
									<img
										src={slideImage.src}
										alt={slideImage.alt}
										className="h-full w-full object-cover"
									/>
								</div>
							);
						})}

						<div className={geometry.contentColClass}>
							{activeSlide.meta.header ? (
								<div className={geometry.headerClass}>
									{activeSlide.meta.header}
								</div>
							) : null}

							<div className={geometry.bodyClass}>
								<SlideMarkdown
									markdown={activeSlide.bodyMarkdown}
									columns={geometry.key === "columns"}
								/>
							</div>

							{showFooterBar ? (
								<div className={geometry.footerClass}>
									<span>{activeSlide.meta.footer}</span>
									{activeSlide.meta.date ? (
										<span>{dayjs().format("MMM D, YYYY")}</span>
									) : null}
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>

			<AiProvider />
		</div>
	);
}
