import { create } from "zustand";

export type PanelKey = "theme" | "font" | "share" | "layout" | "ai" | null;

interface UiState {
	openPanel: PanelKey;
	setOpenPanel(panel: PanelKey): void;
	printing: boolean;
	setPrinting(v: boolean): void;
}

export const useUiStore = create<UiState>((set) => ({
	openPanel: null,
	setOpenPanel: (panel) => set({ openPanel: panel }),
	printing: false,
	setPrinting: (v) => set({ printing: v }),
}));
