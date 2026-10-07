import { useContext } from "react";
import {
	ListDepthContext,
	SlideTextContext,
} from "@/lib/slide-markdown-context";
import type { TagProps } from "@/lib/slide-markdown-context";

export function MarkdownLi({
	node: _node,
	children,
	...props
}: TagProps<"li">) {
	const depth = useContext(ListDepthContext);
	const text = useContext(SlideTextContext);

	const nested = depth > 1;

	return (
		<li className={text.li} {...props}>
			<span className={nested ? text.nestedLiMarker : text.liMarker}>-</span>
			<span>{children}</span>
		</li>
	);
}
