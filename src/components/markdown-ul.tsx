import { useContext } from "react";

import {
	ListDepthContext,
	SlideTextContext,
} from "@/lib/slide-markdown-context";
import type { TagProps } from "@/lib/slide-markdown-context";

export function MarkdownUl({ node: _node, children, ...props }: TagProps<"ul">) {
	const depth = useContext(ListDepthContext);
	const text = useContext(SlideTextContext);

	return (
		<ListDepthContext.Provider value={depth + 1}>
			<ul className={depth === 0 ? text.ul : text.nestedUl} {...props}>
				{children}
			</ul>
		</ListDepthContext.Provider>
	);
}
