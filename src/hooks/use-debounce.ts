import { useEffect, useMemo, useRef } from "react";

export interface Debounced<Args extends unknown[]> {
	(...args: Args): void;
	cancel(): void;
	flush(): void;
}

export function debounce<Args extends unknown[]>(
	fn: (...args: Args) => void,
	waitMs: number,
): Debounced<Args> {
	let timer: ReturnType<typeof setTimeout> | null = null;
	let lastArgs: Args | null = null;

	const debounced = ((...args: Args) => {
		lastArgs = args;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			if (lastArgs) fn(...lastArgs);
		}, waitMs);
	}) as Debounced<Args>;

	debounced.cancel = () => {
		if (timer) clearTimeout(timer);
		timer = null;
	};

	debounced.flush = () => {
		if (timer) clearTimeout(timer);
		timer = null;
		if (lastArgs) fn(...lastArgs);
	};

	return debounced;
}

export function useDebouncedCallback<Args extends unknown[]>(
	fn: (...args: Args) => void,
	waitMs: number,
): (...args: Args) => void {
	const fnRef = useRef(fn);
	useEffect(() => {
		fnRef.current = fn;
	});

	const debounced = useMemo(
		() => debounce<Args>((...args) => fnRef.current(...args), waitMs),
		[waitMs],
	);

	useEffect(() => debounced.cancel, [debounced]);

	return debounced;
}
