# Personal Archive // Jannuh

A mobile-first interactive mystery story for Jannuh. It uses a persisted client-side state machine, touch interactions, a custom voice-note stage, three ending variants, and optional server-side Discord event logging.

## Run

```bash
pnpm install
pnpm dev
```

## Customize

Relationship copy lives in `lib/relationship.ts`: edit the letter, package contents, aliases, and endings there. Replace the final audio path or player wiring in `components/experience.tsx` with `/audio/voice-note.mp3` when the recording is ready. The current preview intentionally keeps audio silent-safe and user-initiated.

## Discord

Copy `.env.example` to `.env.local` and set `DISCORD_WEBHOOK_URL`. The endpoint is `/api/discord-event`; it validates a small allowlist of meaningful events and never exposes the webhook to the browser. Events fail silently so the experience remains usable offline.

## Persistence and secrets

Progress is stored under `jannuh-archive-progress`; the anonymous session ID is stored in session storage. Clear site data or use Start Over to reset. One hidden title tap sequence, a suspicious object, the package file, and the footer object contribute to secret endings.

## Deploy

The project includes `netlify.toml` for Netlify’s Next.js runtime. Add `DISCORD_WEBHOOK_URL` in the deploy environment if Discord logging is desired.
