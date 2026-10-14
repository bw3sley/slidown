import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

export function DarkModeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	function handleTheme() {
		const mode = isDark ? "light" : "dark";
		setTheme(mode);
		track({ event: "dark_mode_toggled", properties: { mode } });
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			title="Toggle dark mode"
			aria-label="Toggle dark mode"
			onClick={handleTheme}
		>
			{isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
		</Button>
	);
}
