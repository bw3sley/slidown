// Renders public/og-image.png (1200x630) and public/apple-touch-icon.png (180x180).
// Run with `npm run og`. Uses the Playwright-managed Chromium when installed
// (`npx playwright install chromium`), otherwise falls back to system Edge/Chrome.
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

async function launch() {
	for (const options of [{}, { channel: "msedge" }, { channel: "chrome" }]) {
		try {
			return await chromium.launch(options);
		} catch {
			// try the next browser
		}
	}

	throw new Error("No browser found. Run `npx playwright install chromium`.");
}

const browser = await launch();

try {
	const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
	await og.goto(pathToFileURL(resolve(root, "scripts/og/template.html")).href);
	await og.evaluate(() => document.fonts.ready);
	await og.screenshot({ path: resolve(root, "public/og-image.png") });

	const svg = await readFile(resolve(root, "public/favicon.svg"), "utf8");
	const icon = await browser.newPage({ viewport: { width: 180, height: 180 } });
	await icon.setContent(
		`<style>*{margin:0}svg{display:block;width:180px;height:180px}</style>${svg}`,
	);
	await icon.screenshot({ path: resolve(root, "public/apple-touch-icon.png") });
} finally {
	await browser.close();
}
