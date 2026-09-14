import MonacoEditor, { type OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

import { useActiveSlide, useDeckStore } from "@/stores/deck-store";

type MonacoEditorInstance = Parameters<OnMount>[0];

export function Editor() {
	const markdown = useDeckStore((s) => s.markdown);
	const setMarkdown = useDeckStore((s) => s.setMarkdown);
	const { resolvedTheme } = useTheme();
	const editorRef = useRef<MonacoEditorInstance | null>(null);

	const activeLine = useActiveSlide()?.line;

	useEffect(() => {
		if (activeLine === undefined) return;
		const editorInstance = editorRef.current;
		if (!editorInstance) return;
		editorInstance.revealLineInCenter(activeLine);
		editorInstance.setPosition({ lineNumber: activeLine, column: 1 });
	}, [activeLine]);

	const handleMount: OnMount = (editorInstance) => {
		editorRef.current = editorInstance;
	};

	return (
		<div className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-border md:border-r md:border-b-0">
			<MonacoEditor
				value={markdown}
				onChange={(value) => setMarkdown(value ?? "")}
				language="markdown"
				theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
				onMount={handleMount}
				options={{
					wordWrap: "on",
					minimap: { enabled: false },
					automaticLayout: true,
					fontSize: 14,
					scrollBeyondLastLine: false,
					lineNumbers: "on",
				}}
			/>
		</div>
	);
}
