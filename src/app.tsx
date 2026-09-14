import { ThemeProvider } from "next-themes";

import { Editor } from "@/components/editor";
import { Header } from "@/components/header";
import { Preview } from "@/components/preview";
import { SlidePreview } from "@/components/slide-preview";
import { Toaster } from "@/components/ui/toast";

export function App() {
	return (
		<ThemeProvider attribute="class">
			<div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
				<Header />
				<div className="flex min-h-0 flex-1 flex-col md:flex-row">
					<Editor />
					<Preview />
				</div>
				<SlidePreview />
			</div>
			<Toaster />
		</ThemeProvider>
	);
}
