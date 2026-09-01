---
name: spotify-playlist-embed
description: Replace the RSVP song suggestion text field with a Spotify embed + collaborative invite button; add a listen-only playlist section on the Details page.
metadata:
  type: project
---

# Spotify Playlist Embed

## Overview

Two changes to the wedding website:

1. **RSVP page** — Replace the "Song Suggestion" text input with a Spotify playlist embed and an "Add a Song" button that opens a collaborative invite link in Spotify.
2. **Details page** — Add a new "Our Playlist" section (between Accommodation and FAQ) with a listen-only Spotify embed.

## Background

Spotify's embed player is listen-only; songs cannot be added via iframe. To contribute songs, guests must open the collaborative invite link in the Spotify app, where they join as a collaborator and add songs directly.

The playlist ID is `1q7gd1czHuYwJ3RSd8fklx`.

---

## RSVP Page Changes

### What's removed
- `spotifySongSuggestion` field from form state
- `sanitizedSong` variable and its DB write (`spotify_song_suggestion`) from the submit handler
- The label, `<input>`, and hint `<p>` for the song suggestion field

### What replaces it

A new block in the same position:

1. **Section label** — translated heading (`rsvp.playlist.heading`)
2. **Spotify embed** — `<iframe>` at `https://open.spotify.com/embed/playlist/1q7gd1czHuYwJ3RSd8fklx`, height 352px, `allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"`, `loading="lazy"`
3. **"Add a Song" button** — yellow-600 style, opens `NEXT_PUBLIC_SPOTIFY_INVITE_URL` in a new tab
4. **Hint text** — translated (`rsvp.playlist.hint`): instructs guests to open the link in Spotify to join as a collaborator

### Environment variable

```
NEXT_PUBLIC_SPOTIFY_INVITE_URL=https://open.spotify.com/playlist/1q7gd1czHuYwJ3RSd8fklx?si=b6766fd293574642&pt=07c1481c29999119bbdbe265125cb8e1
```

Added to `.env.local` and `.env.local.example`. The `pt` token grants collaborative access; storing it in an env var means it can be rotated without a code change.

---

## Details Page Changes

### New section

Inserted between the Accommodation section and the FAQ section, following the existing `bg-white rounded-xl shadow-lg p-8` card pattern.

Contents:
1. `Music` icon (from lucide-react) + translated heading (`details.playlist.heading`)
2. Translated subtitle (`details.playlist.subtitle`)
3. Spotify embed — same iframe URL, height 450px

No invite button — this section is listen-only by design.

---

## Translation Keys

New keys to add to all locale files:

| Key | English value |
|-----|---------------|
| `rsvp.playlist.heading` | Our Wedding Playlist |
| `rsvp.playlist.hint` | Click "Add a Song" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear! |
| `rsvp.playlist.button` | Add a Song |
| `details.playlist.heading` | Our Playlist |
| `details.playlist.subtitle` | Listen to the songs we'll be dancing to |

Existing keys to remove:
- `rsvp.field.song`
- `rsvp.field.song.placeholder`
- `rsvp.field.song.hint`

All locale files must be updated: `en-US.json`, `en-GB.json`, `pt.json`, `cs.json`, `sv.json`, `it.json`, `de.json`, `el.json`, `pl.json`, `es-MX.json`, `da.json`, `ar.json`, `fr.json`, and `.cache.json`.

---

## Data / Database

The `spotify_song_suggestion` column in the database is **not dropped** — existing rows retain their data. The app simply stops writing to it. No migration needed.

---

## Out of Scope

- Spotify OAuth / API integration
- Real-time song search within the site
- Any changes to the admin page
