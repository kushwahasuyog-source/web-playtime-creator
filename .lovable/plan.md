# BotForge — Phase 1: accounts, AI bot builder, templates, live on Telegram

The landing page stays as it is. This adds the working product behind it, in one phase, starting with the parts you chose: sign-in, the AI bot builder, and the template library — with bots that really answer messages on Telegram.

## What you'll be able to do

1. **Sign up / log in** with email and password. Everything you create is private to your account.
2. **Describe a bot** in plain language ("a bot that answers questions about my bakery and takes orders"). The AI writes the bot's personality, its commands (`/start`, `/help`, plus any it invents), and its reply behaviour, streaming its progress as it works.
3. **Start from a template** instead — the 8 templates already shown on the landing page become real, forkable starting points that pre-fill the builder.
4. **Connect your bot to Telegram** by pasting the token BotFather gave you. The token is checked against Telegram, stored encrypted, and never shown in the browser again.
5. **Turn it on.** Once live, real people message your bot on Telegram and it replies using the behaviour you described. Every incoming message and reply is recorded.
6. **Manage bots** from a dashboard: list of your bots, live/off state, edit the description and commands, re-generate, and a message log for each bot.

## Screens

- `/auth` — sign up / log in
- `/app` — your bots (cards with live state, message count, last activity)
- `/app/new` — the AI builder: prompt box, streamed generation, template picker
- `/app/bots/$id` — one bot: its generated behaviour and commands, Telegram token connection, on/off switch, recent messages
- `/app/templates` — browse and fork templates

## Backend setup this needs

- **Lovable Cloud** for accounts, and to store bots, commands, templates and message logs (private per user).
- **A Telegram connection** so the app can verify tokens, register the webhook for each bot, and send replies. I'll open the connection card for you when we get there.

## Technical notes

- Enable Lovable Cloud (Supabase). Tables: `profiles`, `bots` (owner, name, prompt, generated spec JSON, status, encrypted token, telegram username), `bot_commands`, `bot_messages`, `templates` (seeded with the 8 landing-page templates plus their starter prompts). RLS on everything: owners only; `templates` readable by all authenticated users. Explicit grants per table.
- Bot tokens encrypted at rest with AES-256-GCM in a server-only helper using a generated secret; never returned to the client (only a masked suffix).
- Generation: `createServerFn` → Lovable AI (`openai/gpt-6-astra`, Responses API, streaming with reasoning shown in the UI) producing a strict-schema bot spec: name, persona, system prompt, commands with replies, fallback behaviour.
- Webhook: public route `src/routes/api/public/telegram/webhook/$botId.ts`, verified by the `X-Telegram-Bot-Api-Secret-Token` header derived per bot. It looks up the bot, logs the update, resolves a matching command reply or asks the AI with the bot's system prompt, and replies via the connector gateway `sendMessage`. Registered with `setWebhook` at the stable dev/published URL when the user switches a bot on.
- Auth gate under `src/routes/_authenticated/`; token-attaching client middleware in `src/start.ts`.

## Not in this phase

Bot directory (public listing), workflow builder, analytics charts, hosting controls beyond on/off, and the AI coding assistant. They build on this foundation and come next — say the word and I'll plan phase 2.
