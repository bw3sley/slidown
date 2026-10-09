import { useState } from "react";
import { toast } from "sonner";
import skillMarkdown from "@/skills/slidown-slides/SKILL.md?raw";

const SKILL_FILE_NAME = "SKILL.md";

export function useDownloadSkill() {
	const [isDownloading, setIsDownloading] = useState(false);

	async function download() {
		setIsDownloading(true);

		try {
			const blob = new Blob([skillMarkdown], { type: "text/markdown" });
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement("a");

			anchor.href = url;
			anchor.download = SKILL_FILE_NAME;
			document.body.appendChild(anchor);
			anchor.click();
			anchor.remove();
			URL.revokeObjectURL(url);

			toast.success("Skill file downloaded", {
				description: "slidown-slides/SKILL.md",
			});
		} catch {
			toast.error("Download failed", {
				description: "Couldn't download the skill file. Try again.",
			});
		} finally {
			setIsDownloading(false);
		}
	}

	return { download, isDownloading };
}
