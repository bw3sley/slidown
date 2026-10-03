import {
	Download,
	FileDown,
	FileType2,
	Link2,
	Share2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDownloadSkill } from "@/hooks/use-download-skill";
import { useUiStore } from "@/stores/ui-store";

export function ShareButton() {
	const open = useUiStore((s) => s.openPanel === "share");

	const { download } = useDownloadSkill();

	function handleOpenChange(next: boolean) {
		useUiStore.getState().setOpenPanel(next ? "share" : null);
	}

	function handleExportPdf() {
		useUiStore.getState().setPrinting(true);
	}

	return (
		<DropdownMenu open={open} onOpenChange={handleOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button size="md" className="ml-3">
					<Share2 className="size-3.5" />
					Share
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent size="md">
				<DropdownMenuItem disabled>
					<Link2 className="size-3.5" />
					<span className="flex-1">Copy link</span>
					<Badge variant="muted" size="sm" className="font-bold uppercase tracking-wide">
						Soon
					</Badge>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={handleExportPdf}>
					<FileDown className="size-3.5" />
					Export as PDF
				</DropdownMenuItem>

				<DropdownMenuItem disabled>
					<FileType2 className="size-3.5" />

					<span className="flex-1">Export as PPTX</span>

					<Badge variant="muted" size="sm" className="font-bold uppercase tracking-wide">
						Soon
					</Badge>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={() => void download()}>
					<Download className="size-3.5" />
					Download skill
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
