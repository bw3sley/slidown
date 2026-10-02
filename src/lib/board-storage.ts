import { toast } from "sonner";
import type { StateStorage } from "zustand/middleware";

export const DECK_STORAGE_VERSION = 2;

type BoardStorageKind = "deck" | "ai";

export function getBoardId(): string {
	if (typeof window === "undefined") return "/";
	return window.location.pathname.replace(/\/+$/, "") || "/";
}

export function getBoardStorageKey(
	boardId: string = getBoardId(),
	kind: BoardStorageKind = "deck",
): string {
	return `slidown-v${DECK_STORAGE_VERSION}:${kind}:${encodeURIComponent(boardId)}`;
}

function getLegacyBoardStorageKey(boardId: string, kind: BoardStorageKind): string | null {
	// The old key for /default was the same as /, so that data belongs to /.
	if (boardId === "/default") return null;
	const legacyId = boardId === "/" ? "default" : boardId.replace(/^\/+|\/+$/g, "");
	const key = `slidown-v1:${legacyId}`;
	return kind === "ai" ? `${key}:ai` : key;
}

function isLegacyValueForKind(value: string, kind: BoardStorageKind): boolean {
	try {
		const parsed: unknown = JSON.parse(value);
		if (typeof parsed !== "object" || parsed === null || !("state" in parsed)) {
			return false;
		}
		const state = parsed.state;
		if (typeof state !== "object" || state === null) return false;
		return kind === "deck"
			? "markdown" in state && typeof state.markdown === "string"
			: "apiKeys" in state && typeof state.apiKeys === "object";
	} catch {
		return false;
	}
}

function reportStorageError(): void {
	toast.error("Local storage is unavailable. Changes to this board won't be saved.", {
		id: "board-storage-error",
	});
}

export function createBoardStorage(
	kind: BoardStorageKind,
	initialValue?: string,
): StateStorage {
	const boardId = getBoardId();
	const legacyKey = getLegacyBoardStorageKey(boardId, kind);

	return {
		getItem(name) {
			try {
				const current = localStorage.getItem(name);
				if (current !== null) return current;

				const legacy = legacyKey ? localStorage.getItem(legacyKey) : null;
				const value = legacy && isLegacyValueForKind(legacy, kind)
					? legacy
					: initialValue ?? null;
				if (value !== null) localStorage.setItem(name, value);
				return value;
			} catch {
				reportStorageError();
				return null;
			}
		},
		setItem(name, value) {
			try {
				localStorage.setItem(name, value);
			} catch {
				reportStorageError();
			}
		},
		removeItem(name) {
			try {
				localStorage.removeItem(name);
			} catch {
				reportStorageError();
			}
		},
	};
}
