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
import { useMeasure } from "@/hooks/use-measure";
import { getSlideTextStyles, layoutFor } from "@/lib/slide-layout";
import {
	useActiveSlide,
	useDeckStore,
	useResolvedDeckTheme,
	useSlides,
} from "@/stores/deck-store";

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;

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
	const [paneRef, { width, height }] = useMeasure<HTMLDivElement>();
	const slides = useSlides();
	const activeSlide = useActiveSlide();
	const theme = useResolvedDeckTheme();
	const deckFontId = useDeckStore((s) => s.deckFontId);

	const stageScale =
		width && height ? Math.min(width / STAGE_WIDTH, height / STAGE_HEIGHT, 1) : 0;
	const stageWidth = STAGE_WIDTH * stageScale;
	const stageHeight = STAGE_HEIGHT * stageScale;

	if (slides.length === 0 || !activeSlide) {
		return (
			<div
				ref={paneRef}
				className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-background p-8"
			>
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

	const geometry = layoutFor(activeSlide.meta, activeSlide.image, stageScale, {
		accentColor: theme.accent,
	});
	const textStyles = getSlideTextStyles(theme.accent);
	const components = buildMarkdownComponents(textStyles);

	const showFooterBar = Boolean(activeSlide.meta.footer || activeSlide.meta.date);

	return (
		<div
			ref={paneRef}
			className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden bg-background p-8"
		>
			<div className="relative" style={{ width: stageWidth, height: stageHeight }}>
				<TemplatePicker className="absolute -top-8 left-0" />

				<div
					className={DECK_FONT_CLASS[deckFontId]}
					style={{
						background: theme.bg,
						color: theme.ink,
						transform: `scale(${stageScale})`,
						transformOrigin: "top left",
						width: STAGE_WIDTH,
						height: STAGE_HEIGHT,
						position: "absolute",
						top: 0,
						left: 0,
						borderRadius: 14,
						overflow: "hidden",
						boxShadow: "0 20px 50px rgba(0,0,0,.18)",
						padding: geometry.pad,
						boxSizing: "border-box",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div style={geometry.rowStyle}>
						{geometry.showBleed && activeSlide.image ? (
							<>
								<div style={geometry.bleedWrapStyle}>
									<img
										src={activeSlide.image.src}
										alt={activeSlide.image.alt}
										className="h-full w-full object-cover"
									/>
								</div>
								<div style={geometry.scrimStyle} />
							</>
						) : null}

						{!geometry.showBleed &&
						(geometry.showSplitInline || geometry.showInline) &&
						activeSlide.image ? (
							<div style={geometry.inlineWrapStyle}>
								<img
									src={activeSlide.image.src}
									alt={activeSlide.image.alt}
									className="h-full w-full object-cover"
								/>
							</div>
						) : null}

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
