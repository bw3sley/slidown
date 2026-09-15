import { ChevronRight, Download } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { Button } from "@/components/ui/button";
import { useDownloadSkill } from "@/hooks/use-download-skill";
import { cn } from "@/lib/utils";

export function DownloadSkillButton({
	className,
	variant = "outline",
	onClick,
	disabled,
	...props
}: ComponentPropsWithoutRef<typeof Button>) {
	const { download, isDownloading } = useDownloadSkill();

	return (
		<Button
			type="button"
			variant={variant}
			disabled={disabled ?? isDownloading}
			className={cn(
				"h-auto items-center justify-start gap-3 px-3 py-2.5 text-left",
				className,
			)}
			onClick={(event) => {
				onClick?.(event);
				void download();
			}}
			{...props}
		>
			<Download className="size-4 shrink-0 opacity-60" />
			<span className="flex min-w-0 flex-1 flex-col">
				<span className="text-xs font-bold">Get the slidown skill</span>
				<span className="text-xs font-normal text-muted-foreground">
					Best practices for any AI tool
				</span>
			</span>
			<ChevronRight className="size-4 shrink-0 opacity-60" />
		</Button>
	);
}
