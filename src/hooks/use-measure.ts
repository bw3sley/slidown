import { useMemo, useRef, useState } from "react";

interface MeasureRect {
	width: number;
	height: number;
}

const defaultRect: MeasureRect = { width: 0, height: 0 };

export function useMeasure<T extends Element>() {
	const [rect, setRect] = useState<MeasureRect>(defaultRect);
	const elementRef = useRef<T | null>(null);

	const observer = useMemo(() => {
		if (typeof ResizeObserver === "undefined") return null;

		return new ResizeObserver(([entry]) => {
			if (!entry) return;
			const { width, height } = entry.contentRect;
			setRect({ width, height });
		});
	}, []);

	const ref = useMemo(
		() => (node: T | null) => {
			if (elementRef.current) observer?.unobserve(elementRef.current);
			elementRef.current = node;
			if (node) observer?.observe(node);
		},
		[observer],
	);

	return [ref, rect] as const;
}
