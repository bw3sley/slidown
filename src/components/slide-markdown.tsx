import ReactMarkdown from "react-markdown";
import { tv } from "tailwind-variants";

const ALLOWED_ELEMENTS = [
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
];

/**
 * Slide text styling on top of @tailwindcss/typography. Sizes are em-based so
 * they follow the font size that `layoutFor` sets on the slide body; prose
 * colors and font metrics are neutralised so everything inherits from there.
 */
const slideProse = tv({
	base: [
		"prose max-w-none [font-size:inherit] [line-height:inherit] text-inherit",
		"[--tw-prose-body:currentColor] [--tw-prose-headings:currentColor] [--tw-prose-bold:currentColor]",
		"[--tw-prose-bullets:var(--accent)] [--tw-prose-quotes:currentColor] [--tw-prose-quote-borders:var(--accent)]",
		"[--tw-prose-code:currentColor] [--tw-prose-counters:currentColor]",
		// headings
		"prose-h1:mt-0 prose-h1:mb-[.3em] prose-h1:text-[length:1.9em] prose-h1:font-bold prose-h1:[line-height:1.06] prose-h1:tracking-[-.022em]",
		"prose-h2:mt-0 prose-h2:mb-[.34em] prose-h2:text-[length:1.36em] prose-h2:font-bold prose-h2:[line-height:1.14] prose-h2:tracking-[-.016em]",
		"prose-h3:mt-0 prose-h3:mb-[.36em] prose-h3:text-[length:1.1em] prose-h3:font-bold prose-h3:[line-height:1.2]",
		// paragraphs, lists
		"prose-p:mt-0 prose-p:mb-[.55em] prose-p:opacity-[.86]",
		"prose-strong:font-bold",
		"prose-ul:mt-0 prose-ul:mb-[.55em] prose-ul:list-disc prose-ul:pl-[1.2em] [&_ul_ul]:mt-[.32em] [&_ul_ul]:mb-0",
		// marker type follows nesting depth: disc > circle > square, decimal > alpha > roman
		"[&_ul_ul]:list-[circle] [&_ul_ul_ul]:list-[square] [&_ul_ul_ul_ul]:list-disc",
		"prose-ol:list-decimal [&_ol_ol]:list-[lower-alpha] [&_ol_ol_ol]:list-[lower-roman] [&_ol_ol_ol_ol]:list-decimal",
		"[&_ol_ul]:list-[circle] [&_ul_ol]:list-[lower-alpha]",
		"prose-li:my-0 prose-li:pl-0 prose-li:marker:text-(--accent) [&_li+li]:mt-[.32em]",
		// quote
		"prose-blockquote:mt-[.2em] prose-blockquote:mb-[.6em] prose-blockquote:border-l-[.125em] prose-blockquote:border-(--accent) prose-blockquote:pl-[.7em] prose-blockquote:font-normal prose-blockquote:italic prose-blockquote:opacity-95 prose-blockquote:[quotes:none]",
		"[&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none",
		// inline code
		"prose-code:rounded-[.19em] prose-code:bg-[rgba(128,128,128,.18)] prose-code:px-[.32em] prose-code:py-[.1em] prose-code:font-(family-name:--font-deck-mono) prose-code:text-[length:.82em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
	],
	variants: {
		columns: {
			true: "prose-h1:[column-span:all] prose-h2:[column-span:all] prose-h3:[column-span:all] prose-li:mb-[.32em] prose-li:break-inside-avoid [&_li+li]:mt-0",
		},
	},
});

interface SlideMarkdownProps {
	markdown: string;
	columns: boolean;
}

export function SlideMarkdown({ markdown, columns }: SlideMarkdownProps) {
	return (
		<div className={slideProse({ columns })}>
			<ReactMarkdown allowedElements={ALLOWED_ELEMENTS}>{markdown}</ReactMarkdown>
		</div>
	);
}
