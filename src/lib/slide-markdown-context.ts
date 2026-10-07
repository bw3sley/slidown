import { createContext } from "react";
import { getSlideTextClasses } from "@/lib/slide-layout";
import type { SlideTextClasses } from "@/lib/slide-layout";

export type TagProps<Tag extends keyof React.JSX.IntrinsicElements> =
	React.ComponentPropsWithoutRef<Tag> & { node?: unknown };

export const ListDepthContext = createContext(0);

export const SlideTextContext = createContext<SlideTextClasses>(
	getSlideTextClasses(),
);
