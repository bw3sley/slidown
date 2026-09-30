import { FilePlus } from "lucide-react";
import { createContext, useContext } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

import { AiProvider } from "@/components/ai-provider";
import { TemplatePicker } from "@/components/template-picker";
import { Button } from "@/components/ui/button";
import {
	EmptyState,
	EmptyStateAction,
	EmptyStateDescription,
	EmptyStateIcon,
	EmptyStateTitle,
} from "@/components/ui/empty-state";
import { DECK_FONT_CLASS } from "@/constants/deck-fonts";
import { getSlideTextStyles, layoutFor } from "@/lib/slide-layout";
import { cn } from "@/lib/utils";
import {
	useActiveSlide,
	useDeckStore,
	useResolvedDeckTheme,
	useSlides,
} from "@/stores/deck-store";

const ListDepthContext = createContext(0);

type TagProps<Tag extends keyof React.JSX.IntrinsicElements> =
	React.ComponentPropsWithoutRef<Tag> & { node?: unknown };

function buildMarkdownComponents(
	textStyles: ReturnType<typeof getSlideTextStyles>,
): Components {
	function MarkdownUl({ node: _node, children, ...props }: TagProps<"ul">) {
		const depth = useContext(ListDepthContext);

		return (
			<ListDepthContext.Provider value={depth + 1}>
				<ul style={depth === 0 ? textStyles.ul : textStyles.nestedUl} {...props}>
					{children}
				</ul>
			</ListDepthContext.Provider>
		);
	}

	function MarkdownLi({ node: _node, children, ...props }: TagProps<"li">) {
		const depth = useContext(ListDepthContext);

		const nested = depth > 1;

		return (
			<li style={textStyles.li} {...props}>
				<span style={nested ? textStyles.nestedLiMarker : textStyles.liMarker}>-</span>
				<span>{children}</span>
			</li>
		);
	}

	return {
		h1: ({ node: _node, ...props }) => <h1 style={textStyles.h1} {...props} />,
		h2: ({ node: _node, ...props }) => <h2 style={textStyles.h2} {...props} />,
		h3: ({ node: _node, ...props }) => <h3 style={textStyles.h3} {...props} />,
		p: ({ node: _node, ...props }) => <p style={textStyles.p} {...props} />,
		ul: MarkdownUl,
		li: MarkdownLi,
		blockquote: ({ node: _node, ...props }) => (
			<blockquote style={textStyles.blockquote} {...props} />
		),
		code: ({ node: _node, ...props }) => <code style={textStyles.code} {...props} />,
	};
}

function todayFormatted(): string {
	return new Date().toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function Preview() {
	const slides = useSlides();
	const activeSlide = useActiveSlide();
	const theme = useResolvedDeckTheme();
	const deckFontId = useDeckStore((s) => s.deckFontId);

	if (slides.length === 0 || !activeSlide) {
		return (
			<div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-background p-8">
				<EmptyState>
					<EmptyStateIcon>
						<FilePlus />
					</EmptyStateIcon>
					<EmptyStateTitle>Nothing to show yet</EmptyStateTitle>
					<EmptyStateDescription>
						Start typing markdown on the left. Slides split on a line of ---.
					</EmptyStateDescription>
					<EmptyStateAction>
						<Button onClick={() => useDeckStore.getState().insertStarterDeck()}>
							Insert starter deck
						</Button>
					</EmptyStateAction>
				</EmptyState>
			</div>
		);
	}

	const leadImage = activeSlide.images[0] ?? null;
	const geometry = layoutFor(activeSlide.meta, activeSlide.images, {
		accentColor: theme.accent,
		hasBody: activeSlide.bodyMarkdown.trim().length > 0,
	});
	const textStyles = getSlideTextStyles(theme.accent, {
		columns: geometry.key === "columns",
	});
	const components = buildMarkdownComponents(textStyles);

	const showFooterBar = Boolean(activeSlide.meta.footer || activeSlide.meta.date);

	return (
		<div className="@container-size relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-background p-8">
			<div className="@container relative aspect-video w-[min(100cqw,calc(100cqh*16/9),1280px)]">
				<TemplatePicker className="absolute -top-8 left-0" />

				<div
					className={cn(
						DECK_FONT_CLASS[deckFontId],
						"absolute inset-0 box-border flex flex-col overflow-hidden rounded-[1.09375cqw]",
					)}
					style={{
						background: theme.bg,
						color: theme.ink,
						boxShadow: "0 1.5625cqw 3.90625cqw rgba(0,0,0,.18)",
						padding: geometry.pad,
					}}
				>
					<div style={geometry.rowStyle}>
						{geometry.showBleed && leadImage ? (
							<>
								<div style={geometry.bleedWrapStyle}>
									<img
										src={leadImage.src}
										alt={leadImage.alt}
										className="h-full w-full object-cover"
									/>
								</div>
								<div style={geometry.scrimStyle} />
							</>
						) : null}

						{geometry.imageSlots.map((slotStyle, index) => {
							const slideImage = activeSlide.images[index];

							return (
								<div key={`${index}:${slideImage.src}`} style={slotStyle}>
									<img
										src={slideImage.src}
										alt={slideImage.alt}
										className="h-full w-full object-cover"
									/>
								</div>
							);
						})}

						<div style={geometry.contentColStyle}>
							{activeSlide.meta.header ? (
								<div style={geometry.headerStyle}>{activeSlide.meta.header}</div>
							) : null}

							<div style={geometry.bodyStyle}>
								<ReactMarkdown
									allowedElements={[
										"h1",
										"h2",
										"h3",
										"p",
										"ul",
										"li",
										"blockquote",
										"strong",
										"em",
										"code",
									]}
									components={components}
								>
									{activeSlide.bodyMarkdown}
								</ReactMarkdown>
							</div>

							{showFooterBar ? (
								<div style={geometry.footerStyle}>
									<span>{activeSlide.meta.footer}</span>
									{activeSlide.meta.date ? <span>{todayFormatted()}</span> : null}
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

export { Preview };
