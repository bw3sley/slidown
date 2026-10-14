# Slidown

![Cover](./src/assets/cover.png)

## Idea

Slidown came from a common presentation pain point: every time I need to present something, I have to open PowerPoint or another slide tool and spend too much time formatting instead of thinking about content.

The goal is to let developers, and eventually broader users too, create presentations from Markdown or AI-generated content. Instead of building slides manually, users should be able to write, prompt, or transform content into a presentation-ready format much faster.

## Main experience

- Create presentations without the usual PowerPoint busywork
- Turn Markdown writing into slide decks quickly
- Use AI to help draft or transform presentation content
- Customize themes, accents, and typography without heavy design work
- Make presentation creation faster for developers and other users

## Boards

Each URL path is a separate board. Open `/` or type a path such as `/1` or `/my-board` in the address bar to create or reopen one. New boards start empty, with an option to insert the starter deck. Boards save in this browser's localStorage as you edit; opening the same URL on another device does not transfer the board.

## Analytics configuration

Copy `.env.example` to `.env.local` and set `VITE_POSTHOG_KEY` to enable anonymous product events. Leave the key empty to disable PostHog, including in local development and CI. `VITE_POSTHOG_HOST` defaults to `https://us.i.posthog.com` and can point to another region or a self-hosted instance.

Vite embeds both values at build time. For Docker builds, pass `--build-arg VITE_POSTHOG_KEY=...` and, if needed, `--build-arg VITE_POSTHOG_HOST=...`. The project key is public browser configuration, not a provider API secret.

Only fixed-choice product events and slide counts are tracked. Slide content, AI prompts and responses, provider API keys, and board paths are excluded. PostHog respects Do Not Track; automatic page tracking and session recording are disabled.

## Tech

- HTML
- JavaScript
- Markdown parsing
- Design prototype runtime

## Notes

This repository is currently a front-end prototype.
