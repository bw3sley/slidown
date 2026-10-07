import { Plus } from "lucide-react";
import { useDeckStore } from "@/stores/deck-store";

export function AddSlideTile() {
	const addSlide = useDeckStore((s) => s.addSlide);

	return (
		<button
			type="button"
			onClick={() => addSlide()}
			title="Add slide"
			className="flex h-17 w-10.5 shrink-0 items-center justify-center rounded-[9px] border-[1.5px] border-dashed border-border text-muted-foreground transition-colors hover:bg-accent"
		>
			<Plus className="size-4.5" />
		</button>
	);
}
