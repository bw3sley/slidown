import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { MarkdownLi } from "@/components/markdown-li";
import { MarkdownUl } from "@/components/markdown-ul";
import { getSlideTextClasses } from "@/lib/slide-layout";
import { SlideTextContext } from "@/lib/slide-markdown-context";

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

interface SlideMarkdownProps {
	markdown: string;
	columns: boolean;
}

export function SlideMarkdown({ markdown, columns }: SlideMarkdownProps) {
	const text = getSlideTextClasses({ columns });

	const components: Components = {
		h1: ({ node: _node, ...props }) => <h1 className={text.h1} {...props} />,
		h2: ({ node: _node, ...props }) => <h2 className={text.h2} {...props} />,
		h3: ({ node: _node, ...props }) => <h3 className={text.h3} {...props} />,
		p: ({ node: _node, ...props }) => <p className={text.p} {...props} />,
		ul: MarkdownUl,
		li: MarkdownLi,
		blockquote: ({ node: _node, ...props }) => (
			<blockquote className={text.blockquote} {...props} />
		),
		code: ({ node: _node, ...props }) => (
			<code className={text.code} {...props} />
		),
	};

	return (
		<SlideTextContext.Provider value={text}>
			<ReactMarkdown allowedElements={ALLOWED_ELEMENTS} components={components}>
				{markdown}
			</ReactMarkdown>
		</SlideTextContext.Provider>
	);
}
