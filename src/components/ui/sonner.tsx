import { useTheme } from "next-themes";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
	const { resolvedTheme } = useTheme();

	return (
		<SonnerToaster
			position="bottom-center"
			richColors
			theme={resolvedTheme === "dark" ? "dark" : "light"}
			toastOptions={{
				classNames: {
					toast:
						"!rounded-xl !border-border !bg-popover !text-popover-foreground !shadow-xl",
					description: "!text-current !opacity-90",
					error:
						"!border-destructive/30 !bg-destructive !text-destructive-foreground",
					success:
						"!border-success/30 !bg-success !text-success-foreground",
				},
			}}
			{...props}
		/>
	);
}

export { Toaster };
export type { ToasterProps };
