# Targeted site-wide quality improvements

## Approach
Preserve BotForge’s existing dark forest branding and page structure. Reuse the current design system and installed UI primitives; add no new feature packages.

## Implement
- Add shared site utilities: persistent light/dark theme toggle, cookie notice, scroll progress, back-to-top, skip-to-content, UTM capture, and a compact site search over existing pages and landing sections.
- Improve navigation and mobile behavior at 320, 375, 390, and 430px: overflow prevention, scrollable app navigation, 44px touch targets, responsive page headings and bot headers.
- Repair content and links: make footer items point to existing sections/pages or a real email contact, remove dead labels, and add a floating email contact button. Phone links will not be invented because no phone number is provided.
- Improve forms and states: accessible labels, token visibility toggle, safe validation messages, live success/error announcements, skeleton loading states, template empty state, and confirmation before switching a live bot off.
- Convert the FAQ to a keyboard-accessible accordion and add accurate static “last updated” text where relevant.
- Add popular Telegram commands to bot pages with tap-to-add defaults, backed by a focused server function that preserves existing commands.
- Clean up metadata: unique route titles/descriptions, route-level social tags, favicon retention, valid canonical/site URLs, and sitemap/robots alignment.
- Optimize the assistant image to an appropriately sized WebP and add print styles, reduced-motion handling, and stronger focus/active states.

## Verify
- Recheck all internal links, console/runtime errors, keyboard access, and horizontal overflow.
- Test the main public and app pages at desktop plus 320px, 375px, 390px, and 430px widths.
- Confirm the assistant, builder, template, bot, and add-command flows still work.
