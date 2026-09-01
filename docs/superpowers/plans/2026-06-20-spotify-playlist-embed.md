# Spotify Playlist Embed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the RSVP song suggestion text field with a Spotify embed + collaborative invite button, and add a listen-only playlist section on the Details page.

**Architecture:** Env var holds the collaborative invite URL; all UI changes are purely presentational (no new components, just JSX edits to two pages and translation key updates across all locale files). The `spotify_song_suggestion` DB column is left in place — the app simply stops writing to it.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, lucide-react, Vitest

---

## File Map

| File | Change |
|------|--------|
| `.env.local` | Add `NEXT_PUBLIC_SPOTIFY_INVITE_URL` |
| `.env.local.example` | Add placeholder for the same var |
| `locales/en-US.json` | Remove 3 old song keys; add 5 new playlist keys |
| `locales/en-GB.json` | Same as en-US (also English) |
| `locales/pt.json` `cs.json` `sv.json` `it.json` `de.json` `el.json` `pl.json` `es-MX.json` `da.json` `ar.json` `fr.json` | Remove 3 old song keys; add 5 new keys with English values (i18n fallback ensures guests see English until DeepL translation script is re-run) |
| `app/rsvp/page.tsx` | Remove song field from state/submit/JSX; add embed block |
| `app/details/page.tsx` | Add `Music` import; insert playlist section between Accommodation and FAQ |

---

## Task 1: Add environment variable

**Files:**
- Modify: `.env.local`
- Modify: `.env.local.example`

- [ ] **Step 1: Add the invite URL to `.env.local`**

Append this line to `.env.local`:

```
NEXT_PUBLIC_SPOTIFY_INVITE_URL=xxx
```

- [ ] **Step 2: Add a placeholder to `.env.local.example`**

Append this line to `.env.local.example`:

```
# Spotify collaborative playlist invite URL (from Spotify → Share → Invite collaborators)
NEXT_PUBLIC_SPOTIFY_INVITE_URL=your-spotify-invite-url
```

- [ ] **Step 3: Commit**

```bash
git add .env.local.example
git commit -m "chore: add NEXT_PUBLIC_SPOTIFY_INVITE_URL env var"
```

(`.env.local` is gitignored — do not stage it.)

---

## Task 2: Update locale files

**Files:**
- Modify: `locales/en-US.json`
- Modify: `locales/en-GB.json`
- Modify: `locales/pt.json`
- Modify: `locales/cs.json`
- Modify: `locales/sv.json`
- Modify: `locales/it.json`
- Modify: `locales/de.json`
- Modify: `locales/el.json`
- Modify: `locales/pl.json`
- Modify: `locales/es-MX.json`
- Modify: `locales/da.json`
- Modify: `locales/ar.json`
- Modify: `locales/fr.json`

### en-US.json and en-GB.json

- [ ] **Step 1: In `locales/en-US.json`, replace the three old song keys with five new playlist keys**

Find and replace this block (lines 61-63):

```json
  "rsvp.field.song": "Song Suggestion for Our Playlist",
  "rsvp.field.song.placeholder": "Song name - Artist (optional)",
  "rsvp.field.song.hint": "Suggest a song you'd love to hear at the wedding!",
```

With:

```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 2: Apply the same replacement to `locales/en-GB.json`**

Find and replace (lines 61-63):

```json
  "rsvp.field.song": "Song Suggestion for Our Playlist",
  "rsvp.field.song.placeholder": "Song name - Artist (optional)",
  "rsvp.field.song.hint": "Suggest a song you'd love to hear at the wedding!",
```

With:

```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

### All other locale files (pt, cs, sv, it, de, el, pl, es-MX, da, ar, fr)

Each of these files has the same three keys at lines 58-60. Replace them with English placeholder values — the `createTranslator` fallback ensures guests see English text until the DeepL script is re-run.

- [ ] **Step 3: Update `locales/pt.json`**

Replace:
```json
  "rsvp.field.song": "Sugestão de música para a nossa lista de reprodução",
  "rsvp.field.song.placeholder": "Título da canção - Artista (opcional)",
  "rsvp.field.song.hint": "Sugere uma música que adorasses ouvir no casamento!",
```
With:
```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 4: Update `locales/cs.json`**

Replace:
```json
  "rsvp.field.song": "Návrh písně do našeho playlistu",
  "rsvp.field.song.placeholder": "Název skladby – Interpret (volitelné)",
  "rsvp.field.song.hint": "Navrhni písničku, kterou bys na svatbě rád/a slyšel/a!",
```
With:
```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 5: Update `locales/sv.json`**

Replace:
```json
  "rsvp.field.song": "Låtförslag till vår spellista",
  "rsvp.field.song.placeholder": "Låtens titel – Artist (valfritt)",
  "rsvp.field.song.hint": "Föreslå en låt som du gärna skulle vilja höra på bröllopet!",
```
With:
```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 6: Update `locales/it.json`**

Replace:
```json
  "rsvp.field.song": "Suggerimento di una canzone per la nostra playlist",
  "rsvp.field.song.placeholder": "Titolo del brano - Artista (facoltativo)",
  "rsvp.field.song.hint": "Suggerisci una canzone che ti piacerebbe ascoltare al matrimonio!",
```
With:
```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 7: Update `locales/de.json`**

Replace:
```json
  "rsvp.field.song": "Songvorschlag für unsere Playlist",
  "rsvp.field.song.placeholder": "Titel – Interpret (optional)",
  "rsvp.field.song.hint": "Schlag doch mal einen Song vor, den du gerne auf der Hochzeit hören würdest!",
```
With:
```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 8: Update `locales/el.json`**

Replace:
```json
  "rsvp.field.song": "Πρόταση τραγουδιού για τη λίστα αναπαραγωγής μας",
  "rsvp.field.song.placeholder": "Τίτλος τραγουδιού - Καλλιτέχνης (προαιρετικό)",
  "rsvp.field.song.hint": "Προτείνετε ένα τραγούδι που θα θέλατε πολύ να ακούσετε στο γάμο!",
```
With:
```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 9: Update `locales/pl.json`**

Replace:
```json
  "rsvp.field.song": "Propozycja utworu do naszej playlisty",
  "rsvp.field.song.placeholder": "Tytuł utworu – Wykonawca (opcjonalnie)",
  "rsvp.field.song.hint": "Zaproponuj piosenkę, którą chciałbyś usłyszeć na weselu!",
```
With:
```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 10: Update `locales/es-MX.json`**

Replace:
```json
  "rsvp.field.song": "Sugerencia de canción para nuestra lista de reproducción",
  "rsvp.field.song.placeholder": "Título de la canción - Artista (opcional)",
  "rsvp.field.song.hint": "¡Sugiere una canción que te encantaría escuchar en la boda!",
```
With:
```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 11: Update `locales/da.json`**

Replace:
```json
  "rsvp.field.song": "Forslag til en sang til vores playliste",
  "rsvp.field.song.placeholder": "Sangtitel – Kunstner (valgfrit)",
  "rsvp.field.song.hint": "Foreslå en sang, du rigtig gerne vil høre til brylluppet!",
```
With:
```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 12: Update `locales/ar.json`**

Replace:
```json
  "rsvp.field.song": "اقتراح أغنية لإضافتها إلى قائمة التشغيل الخاصة بنا",
  "rsvp.field.song.placeholder": "اسم الأغنية - الفنان (اختياري)",
  "rsvp.field.song.hint": "اقترح أغنية تود سماعها في حفل الزفاف!",
```
With:
```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 13: Update `locales/fr.json`**

Replace:
```json
  "rsvp.field.song": "Suggestion de chanson pour notre playlist",
  "rsvp.field.song.placeholder": "Titre de la chanson - Artiste (facultatif)",
  "rsvp.field.song.hint": "Proposez une chanson que vous aimeriez entendre lors du mariage !",
```
With:
```json
  "rsvp.playlist.heading": "Our Wedding Playlist",
  "rsvp.playlist.hint": "Click \"Add a Song\" to open Spotify — join the playlist as a collaborator and add any song you'd love to hear!",
  "rsvp.playlist.button": "Add a Song",
  "details.playlist.heading": "Our Playlist",
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

- [ ] **Step 14: Run tests to verify locale changes didn't break the i18n system**

```bash
cd wedding_website && npm test
```

Expected: all tests pass.

- [ ] **Step 15: Commit locale changes**

```bash
git add locales/
git commit -m "feat: replace song suggestion keys with spotify playlist keys in all locales"
```

---

## Task 3: Update RSVP page

**Files:**
- Modify: `app/rsvp/page.tsx`

- [ ] **Step 1: Remove `spotifySongSuggestion` from `formData` initial state**

Find (lines 40-48):
```tsx
  const [formData, setFormData] = useState({
    name: '',
    attending: true,
    plusOneName: '',
    dietaryRestrictions: '',
    accommodationNeeded: false,
    spotifySongSuggestion: '',
    additionalNotes: '',
  })
```

Replace with:
```tsx
  const [formData, setFormData] = useState({
    name: '',
    attending: true,
    plusOneName: '',
    dietaryRestrictions: '',
    accommodationNeeded: false,
    additionalNotes: '',
  })
```

- [ ] **Step 2: Remove `sanitizedSong` and its DB write from `handleSubmit`**

Find (lines 123, 142):
```tsx
      const sanitizedSong = formData.spotifySongSuggestion ? sanitizeText(formData.spotifySongSuggestion) : null
```
Delete that line entirely.

Then find:
```tsx
        spotify_song_suggestion: sanitizedSong,
```
Delete that line entirely.

- [ ] **Step 3: Remove `spotifySongSuggestion` from the form reset in the success block**

Find (lines 158-166):
```tsx
      setFormData({
        name: userSession.guestName,
        attending: true,
        plusOneName: '',
        dietaryRestrictions: '',
        accommodationNeeded: false,
        spotifySongSuggestion: '',
        additionalNotes: '',
      })
```

Replace with:
```tsx
      setFormData({
        name: userSession.guestName,
        attending: true,
        plusOneName: '',
        dietaryRestrictions: '',
        accommodationNeeded: false,
        additionalNotes: '',
      })
```

- [ ] **Step 4: Replace the song suggestion JSX block with the Spotify embed block**

Find (lines 331-348):
```tsx
              {/* Spotify Song Suggestion */}
              <div>
                <label htmlFor="spotifySongSuggestion" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rsvp.field.song')}
                </label>
                <input
                  type="text"
                  id="spotifySongSuggestion"
                  name="spotifySongSuggestion"
                  value={formData.spotifySongSuggestion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder={t('rsvp.field.song.placeholder')}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {t('rsvp.field.song.hint')}
                </p>
              </div>
```

Replace with:
```tsx
              {/* Spotify Playlist */}
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-3">
                  {t('rsvp.playlist.heading')}
                </p>
                <div className="rounded-lg overflow-hidden mb-3">
                  <iframe
                    title="Wedding Playlist"
                    src="https://open.spotify.com/embed/playlist/1q7gd1czHuYwJ3RSd8fklx"
                    width="100%"
                    height="352"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="border-0"
                  />
                </div>
                <a
                  href={process.env.NEXT_PUBLIC_SPOTIFY_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {t('rsvp.playlist.button')}
                </a>
                <p className="mt-2 text-sm text-gray-500">
                  {t('rsvp.playlist.hint')}
                </p>
              </div>
```

- [ ] **Step 5: Verify TypeScript compiles without errors**

```bash
cd wedding_website && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add app/rsvp/page.tsx
git commit -m "feat: replace song suggestion field with Spotify embed on RSVP page"
```

---

## Task 4: Add playlist section to Details page

**Files:**
- Modify: `app/details/page.tsx`

- [ ] **Step 1: Add `Music` to the lucide-react import**

Find (line 3):
```tsx
import { MapPin, Clock, Hotel, Info, Navigation } from 'lucide-react'
```

Replace with:
```tsx
import { MapPin, Clock, Hotel, Info, Navigation, Music } from 'lucide-react'
```

- [ ] **Step 2: Insert the playlist section between Accommodation and FAQ**

Find (lines 107-121 — the closing tag of the Accommodation section and the opening of the FAQ section):
```tsx
        {/* FAQ */}
        <section className="bg-white rounded-xl shadow-lg p-8">
```

Replace with:
```tsx
        {/* Playlist */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-8 h-8 text-yellow-600" />
            <h2 className="font-serif text-3xl font-bold text-gray-900">{t('details.playlist.heading')}</h2>
          </div>
          <p className="text-gray-600 mb-6">{t('details.playlist.subtitle')}</p>
          <div className="rounded-lg overflow-hidden">
            <iframe
              title="Wedding Playlist"
              src="https://open.spotify.com/embed/playlist/1q7gd1czHuYwJ3RSd8fklx"
              width="100%"
              height="450"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="border-0"
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-xl shadow-lg p-8">
```

- [ ] **Step 3: Verify TypeScript compiles without errors**

```bash
cd wedding_website && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/details/page.tsx
git commit -m "feat: add listen-only Spotify playlist section to Details page"
```

---

## Task 5: Final verification

- [ ] **Step 1: Run the full test suite**

```bash
cd wedding_website && npm test
```

Expected: all tests pass.

- [ ] **Step 2: Start the dev server and verify both pages**

```bash
cd wedding_website && npm run dev
```

Check:
- `/rsvp` (after logging in): the song text field is gone; the Spotify embed loads; the "Add a Song" button is visible
- `/rsvp` with a non-attending selection: the playlist section does not appear (it is inside the `{formData.attending && ...}` conditional — this is correct)
- `/details`: the "Our Playlist" section appears between Accommodation and FAQ; the embed loads and plays

- [ ] **Step 3: Verify no TypeScript errors remain**

```bash
cd wedding_website && npx tsc --noEmit
```

Expected: exit 0, no output.
