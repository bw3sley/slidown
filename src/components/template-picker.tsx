import { ChevronDown, LayoutGrid } from "lucide-react";
import { SlideLayoutItem } from "@/components/slide-layout-item";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	LAYOUT_LABELS,
	LAYOUT_ORDER,
	resolveLayoutKey,
} from "@/constants/slide-layouts";
import type { SlideLayoutKey } from "@/constants/slide-layouts";
import { getLayoutPreviewRects } from "@/lib/slide-layout";
import { cn } from "@/lib/utils";
import {
	useActiveSlide,
	useDeckStore,
	useResolvedDeckTheme,
} from "@/stores/deck-store";
import { useUiStore } from "@/stores/ui-store";

interface TemplatePickerProps {
	className?: string;
}

export function TemplatePicker({ className }: TemplatePickerProps) {
	const activeSlide = useActiveSlide();
	const activeLayoutKey = resolveLayoutKey(activeSlide?.meta.layout);
	const theme = useResolvedDeckTheme();
	const open = useUiStore((s) => s.openPanel === "layout");

	function handleOpenChange(next: boolean) {
		useUiStore.getState().setOpenPanel(next ? "layout" : null);
	}

	function handleSelect(key: SlideLayoutKey) {
		useDeckStore.getState().setActiveSlideLayout(key);
		useUiStore.getState().setOpenPanel(null);
	}

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger
				className={cn(
					"flex cursor-pointer items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground data-[state=open]:text-primary",
					className,
				)}
			>
				<LayoutGrid className="size-3.5" />
				<span>{LAYOUT_LABELS[activeLayoutKey]}</span>
				<ChevronDown className="size-2.5 opacity-55" />
			</PopoverTrigger>

			<PopoverContent
				align="start"
				size="sm"
				className="max-h-90 w-56 origin-top-left overflow-y-auto"
			>
				<div className="mb-1.5 text-xxs font-bold tracking-[0.06em] text-muted-foreground uppercase">
					Slide layout
				</div>

				<div className="grid grid-cols-2 gap-2.25">
					{LAYOUT_ORDER.map((key) => (
						<SlideLayoutItem
							key={key}
							layoutKey={key}
							label={LAYOUT_LABELS[key]}
							rects={getLayoutPreviewRects(key, theme)}
							previewBg={theme.bg}
							accent={theme.accent}
							isActive={key === activeLayoutKey}
							onSelect={handleSelect}
						/>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
