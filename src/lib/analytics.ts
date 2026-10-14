import posthog from "posthog-js";
import type { AiProviderId } from "@/constants/ai-providers";
import type { DeckFontId } from "@/constants/deck-fonts";
import type { DeckThemeId } from "@/constants/deck-themes";
import type { SlideLayoutKey } from "@/constants/slide-layouts";
import type { AiErrorType } from "@/http/errors/ai-error";

type AnalyticsEvent =
	| { event: "deck_started_from_template" }
	| { event: "slide_added"; properties: { slide_count: number } }
	| { event: "slide_deleted"; properties: { slide_count: number } }
	| { event: "slide_reordered" }
	| { event: "layout_changed"; properties: { layout: SlideLayoutKey } }
	| { event: "theme_changed"; properties: { theme: DeckThemeId } }
	| { event: "font_changed"; properties: { font: DeckFontId } }
	| { event: "accent_changed" }
	| { event: "dark_mode_toggled"; properties: { mode: "light" | "dark" } }
	| { event: "export_pdf"; properties: { slide_count: number } }
	| { event: "skill_downloaded" }
	| { event: "ai_generate_succeeded"; properties: { provider: AiProviderId } }
	| {
			event: "ai_generate_failed";
			properties: { provider: AiProviderId; error_type: AiErrorType };
	  };

type AnalyticsEventName = AnalyticsEvent["event"];

const EVENT_PROPERTIES: Record<AnalyticsEventName, readonly string[]> = {
	deck_started_from_template: [],
	slide_added: ["slide_count"],
	slide_deleted: ["slide_count"],
	slide_reordered: [],
	layout_changed: ["layout"],
	theme_changed: ["theme"],
	font_changed: ["font"],
	accent_changed: [],
	dark_mode_toggled: ["mode"],
	export_pdf: ["slide_count"],
	skill_downloaded: [],
	ai_generate_succeeded: ["provider"],
	ai_generate_failed: ["provider", "error_type"],
};

let initialized = false;

export function initAnalytics(): void {
	const key = import.meta.env.VITE_POSTHOG_KEY?.trim();

	if (!key || initialized) {
		return;
	}

	posthog.init(key, {
		api_host: import.meta.env.VITE_POSTHOG_HOST?.trim() || "https://us.i.posthog.com",
		autocapture: false,
		capture_pageview: false,
		capture_pageleave: false,
		disable_session_recording: true,
		person_profiles: "never",
		persistence: "localStorage",
		save_campaign_params: false,
		save_referrer: false,
		respect_dnt: true,
		advanced_disable_flags: true,
		disable_surveys: true,
		capture_performance: false,
		capture_exceptions: false,
		before_send: (event) => {
			// PostHog adds browser metadata and the current URL to manual events.
			// Only send fields listed here, plus identifiers required for ingestion.
			if (!(event.event in EVENT_PROPERTIES)) {
				return null;
			}
			const source = event.properties ?? {};

			const properties: typeof event.properties = {
				token: key,
				distinct_id: source.distinct_id,
				$process_person_profile: false,
			};

			for (const name of EVENT_PROPERTIES[event.event as AnalyticsEventName]) {
				properties[name] = source[name];
			}

			event.properties = properties;

			return event;
		},
	});

	initialized = true;
}

export function track(event: AnalyticsEvent): void {
	if (!initialized) {
		return;
	}

	posthog.capture(event.event, "properties" in event ? event.properties : undefined);
}
