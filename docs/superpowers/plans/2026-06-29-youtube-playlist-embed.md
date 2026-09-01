# YouTube Playlist Embed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a read-only YouTube playlist embed (playlist panel layout) below the Spotify embed inside the existing Playlist section on the Details page.

**Architecture:** Two file changes only — add a new translation key to `en-US.json` and update the Playlist section JSX in `app/details/page.tsx` to render the bridging text and YouTube iframe after the existing Spotify iframe.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, i18n via `useTranslation`

---

### Task 1: Add translation key

**Files:**
- Modify: `locales/en-US.json:65`

- [ ] **Step 1: Add the new key after `details.playlist.subtitle`**

Open `locales/en-US.json`. Line 65 currently reads:
```json
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
```

Add the new key on line 66:
```json
  "details.playlist.subtitle": "Listen to the songs we'll be dancing to",
  "details.playlist.dance": "And this is how we'll be dancing",
```

- [ ] **Step 2: Verify the file is valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('locales/en-US.json','utf8')); console.log('valid')"
```

Expected output: `valid`

- [ ] **Step 3: Commit**

```bash
git add locales/en-US.json
git commit -m "feat: add details.playlist.dance translation key"
```

---

### Task 2: Add YouTube embed to Details page

**Files:**
- Modify: `app/details/page.tsx:119-137`

- [ ] **Step 1: Update the Playlist section JSX**

In `app/details/page.tsx`, replace the Playlist section (lines 119–137) with:

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
          <p className="text-gray-600 mt-8 mb-6">{t('details.playlist.dance')}</p>
          <div className="rounded-lg overflow-hidden">
            <iframe
              title="Wedding Dance Playlist"
              src="https://www.youtube-nocookie.com/embed?listType=playlist&list=PLVyVMYnAezTg"
              width="100%"
              height="450"
              loading="lazy"
              allowFullScreen
              className="border-0"
            />
          </div>
        </section>
```

- [ ] **Step 2: Verify the dev server builds without errors**

```bash
cd /home/jfula/Joao/wedding_website/wedding_website && npm run build 2>&1 | tail -20
```

Expected: build completes with no TypeScript or JSX errors.

- [ ] **Step 3: Commit**

```bash
git add app/details/page.tsx
git commit -m "feat: add YouTube dance playlist embed to Details page"
```
