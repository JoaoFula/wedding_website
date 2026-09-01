# YouTube Playlist Embed — Design Spec

**Date:** 2026-06-29
**Status:** Approved

## Goal

Add a read-only YouTube playlist embed to the Details page so guests can preview the style of dancing to expect at the wedding. The embed lives inside the existing Playlist section card alongside the Spotify embed.

## Location

`app/details/page.tsx` — the existing Playlist `<section>` (lines 119–137).

No new section or card is created. Both embeds share the same card.

## Layout (top to bottom within the card)

1. Music icon + "Our Playlist" heading — **unchanged**
2. "Listen to the songs we'll be dancing to" subtitle — **unchanged**
3. Spotify embed — **unchanged**
4. Visual gap (margin)
5. New bridging line using translation key `details.playlist.dance`: "And this is how we'll be dancing"
6. YouTube embed (playlist panel layout)

## YouTube Embed

- **src:** `https://www.youtube-nocookie.com/embed?listType=playlist&list=PLVyVMYnAezTg`
- `youtube-nocookie.com` — avoids tracking cookies for guests
- `listType=playlist&list=PLVyVMYnAezTg` — loads the playlist panel (video player + list sidebar)
- No `si=` sharing token in the URL
- `width="100%"`, `height="450"`, `loading="lazy"`, `allowFullScreen`
- Read-only: guests can browse and watch, not add to the playlist

## Translations

Add one new key to `locales/en-US.json`:

```json
"details.playlist.dance": "And this is how we'll be dancing"
```

Only `en-US.json` is updated manually. The existing auto-translation pipeline handles the remaining 12 locales.

## Out of Scope

- No changes to other pages
- No changes to the Spotify embed
- No auto-translation run (separate step)
