export const DECK_STORAGE_VERSION = 1;

export function getBoardId(): string {
	if (typeof window === "undefined") return "default";
	const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
	return path || "default";
}

export function getBoardStorageKey(boardId: string = getBoardId()): string {
	return `slidown-v${DECK_STORAGE_VERSION}:${boardId}`;
}
