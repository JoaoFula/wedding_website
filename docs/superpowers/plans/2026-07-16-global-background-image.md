# Global Background Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fixed, full-screen background photo (`public/background.jpg`) that persists across all pages at 40% opacity, with page content remaining readable inside frosted white cards.

**Architecture:** A `body::before` pseudo-element in `globals.css` holds the background image at configurable opacity via a CSS variable — this prevents the opacity from cascading to child elements. Existing `bg-white rounded-xl shadow-lg` content cards across all pages get `backdrop-filter: blur(8px)` added via a `.content-card` utility class. Gradient backgrounds on each page's outermost wrapper are removed since the photo replaces them.

**Tech Stack:** Next.js 14, Tailwind CSS v4, plain CSS in `globals.css`

---

### Task 1: Add background CSS to globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add the CSS variable and body::before rule**

Open `app/globals.css` and replace the existing content with:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #1f2937;
  --bg-opacity: 0.4;
}

/* Tailwind v4 theme configuration */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-inter);
  --font-serif: var(--font-playfair);
}

body {
  color: var(--foreground);
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  opacity: var(--bg-opacity);
  z-index: -1;
}

.content-card {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```

- [ ] **Step 2: Add a placeholder background image**

Since the real photo isn't available yet, create a placeholder so the layout is testable. Run:

```bash
cd wedding_website && node -e "
const fs = require('fs');
// Create a minimal 1x1 white JPEG placeholder
const buf = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=', 'base64');
fs.writeFileSync('public/background.jpg', buf);
console.log('Placeholder created at public/background.jpg');
"
```

- [ ] **Step 3: Start the dev server and verify the background appears**

```bash
cd wedding_website && npm run dev
```

Open http://localhost:3000. You should see the page with a faint white background (the placeholder is white, so the effect is subtle — the CSS is working if there are no console errors and the body::before pseudo-element appears in DevTools). Confirm no layout breaks.

- [ ] **Step 4: Commit**

```bash
cd wedding_website && git add app/globals.css public/background.jpg && git commit -m "feat: add global background image with fixed parallax and opacity variable"
```

---

### Task 2: Remove gradient backgrounds from page wrappers

Each page's outermost `<div>` currently has `bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50` or similar. These need to be removed so the background photo shows through. The loading state in the RSVP page also has a hardcoded gradient that needs removing.

**Files:**
- Modify: `app/details/page.tsx`
- Modify: `app/story/page.tsx`
- Modify: `app/login/page.tsx`
- Modify: `app/photos/page.tsx`
- Modify: `app/rsvp/page.tsx`

- [ ] **Step 1: Remove gradient from details/page.tsx**

In `app/details/page.tsx`, change line 10:
```tsx
// Before
<div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">

// After
<div className="min-h-screen">
```

- [ ] **Step 2: Remove gradient from story/page.tsx**

In `app/story/page.tsx`, change line 22:
```tsx
// Before
<div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">

// After
<div className="min-h-screen">
```

- [ ] **Step 3: Remove gradient from login/page.tsx**

In `app/login/page.tsx`, change line 121:
```tsx
// Before
<div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">

// After
<div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
```

- [ ] **Step 4: Remove gradient from photos/page.tsx**

In `app/photos/page.tsx`, change line 13:
```tsx
// Before
<div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">

// After
<div className="min-h-screen">
```

- [ ] **Step 5: Remove gradients from rsvp/page.tsx**

In `app/rsvp/page.tsx`, there are two gradients to remove:

Line 195 (loading state):
```tsx
// Before
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">

// After
<div className="min-h-screen flex items-center justify-center">
```

Line 205 (main return):
```tsx
// Before
<div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">

// After
<div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
```

- [ ] **Step 6: Remove gradient from home page hero section**

In `app/page.tsx`, the hero section has its own gradient overlay on lines 13-14. Remove both absolute gradient divs:
```tsx
// Before (lines 12-15)
<section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-pink-50 to-purple-100" />
  <div className="absolute inset-0 bg-white/40" />
  <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">

// After
<section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
  <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
```

Also remove the solid white background from the welcome section (line 51):
```tsx
// Before
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">

// After
<section className="py-20 px-4 sm:px-6 lg:px-8">
```

And remove `bg-gray-50` from the cards section (line 65):
```tsx
// Before
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">

// After
<section className="py-16 px-4 sm:px-6 lg:px-8">
```

- [ ] **Step 7: Commit**

```bash
cd wedding_website && git add app/details/page.tsx app/story/page.tsx app/login/page.tsx app/photos/page.tsx app/rsvp/page.tsx app/page.tsx && git commit -m "feat: remove page gradient backgrounds to expose global background photo"
```

---

### Task 3: Apply content-card class to page wrappers and sections

The existing `bg-white rounded-xl shadow-lg p-8` sections already look like cards. We need to add the `content-card` class to apply the frosted glass effect. We also need to wrap the home page hero text and the page header areas (which don't currently have a card) in a frosted card.

**Files:**
- Modify: `app/details/page.tsx`
- Modify: `app/story/page.tsx`
- Modify: `app/login/page.tsx`
- Modify: `app/photos/page.tsx`
- Modify: `app/rsvp/page.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Add content-card to all bg-white sections in details/page.tsx**

In `app/details/page.tsx`, add `content-card` to every `<section>` that has `bg-white`:

```tsx
// Venue section (line 22)
<section className="bg-white rounded-xl shadow-lg p-8 content-card">

// Schedule section (line 60)
<section className="bg-white rounded-xl shadow-lg p-8 content-card">

// Dress Code section (line 86)
<section className="bg-white rounded-xl shadow-lg p-8 content-card">

// Accommodation section (line 108)
<section className="bg-white rounded-xl shadow-lg p-8 content-card">

// Playlist section (line 120)
<section className="bg-white rounded-xl shadow-lg p-8 content-card">

// FAQ section (line 154)
<section className="bg-white rounded-xl shadow-lg p-8 content-card">

// Contact section (line 174) — has bg-yellow-50 instead of bg-white, also add content-card
<section className="bg-yellow-50 rounded-xl p-8 text-center content-card">
```

Also wrap the page header in a card. After `<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">` (line 20), the text-center header div at lines 11-18 should become:

```tsx
<div className="text-center py-16 px-4">
```
→ no change needed here, the header text sits directly on the background (acceptable for headings).

- [ ] **Step 2: Add content-card to story/page.tsx cards**

In `app/story/page.tsx`, add `content-card` to the timeline item cards (line 44):
```tsx
// Before
<div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">

// After
<div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow content-card">
```

And to the closing section (line 62):
```tsx
// Before
<div className="bg-white py-16 px-4">

// After
<div className="bg-white py-16 px-4 content-card">
```

- [ ] **Step 3: Add content-card to login/page.tsx**

In `app/login/page.tsx`, add `content-card` to the form card (line 131):
```tsx
// Before
<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">

// After
<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6 content-card">
```

And to the info box (line 216):
```tsx
// Before
<div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">

// After
<div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 content-card">
```

- [ ] **Step 4: Add content-card to photos/page.tsx**

In `app/photos/page.tsx`, add `content-card` to each `<section>`:
```tsx
// Upload section (line 25)
<section className="bg-white rounded-xl shadow-lg p-8 content-card">

// Alt section (line 80)
<section className="bg-white rounded-xl shadow-lg p-8 content-card">

// Guidelines section (line 94)
<section className="bg-white rounded-xl shadow-lg p-8 content-card">

// Thanks section (line 106)
<section className="bg-yellow-50 rounded-xl p-8 text-center content-card">
```

- [ ] **Step 5: Add content-card to rsvp/page.tsx**

In `app/rsvp/page.tsx`, add `content-card` to the form (line 257):
```tsx
// Before
<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">

// After
<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6 content-card">
```

- [ ] **Step 6: Add content-card to home page cards**

In `app/page.tsx`, the three link cards (lines 68, 75, 82) already have `bg-white`:
```tsx
// Before
<Link href="/story" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group">

// After
<Link href="/story" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center group content-card">
```

Apply the same `content-card` addition to the `/details` and `/photos` link cards.

Also wrap the home page hero text in a frosted card. In `app/page.tsx`, wrap the `relative z-10` div content:
```tsx
// Before
<div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
  <Heart ... />
  <h1 ...>João & Zuza</h1>
  ...
</div>

// After
<div className="relative z-10 text-center px-8 py-12 rounded-2xl content-card max-w-2xl mx-auto">
  <Heart ... />
  <h1 ...>João & Zuza</h1>
  ...
</div>
```

- [ ] **Step 7: Verify all pages look correct**

With the dev server running, open each page and confirm:
- Background photo is visible behind all content
- Content cards have a frosted white appearance
- Text is readable on all pages
- Navigation bar is unaffected
- No layout breaks or overflow issues

- [ ] **Step 8: Commit**

```bash
cd wedding_website && git add app/details/page.tsx app/story/page.tsx app/login/page.tsx app/photos/page.tsx app/rsvp/page.tsx app/page.tsx && git commit -m "feat: apply frosted content-card glass effect across all pages"
```

---

### Task 4: Replace placeholder with real image (when received)

**Files:**
- Replace: `public/background.jpg`

- [ ] **Step 1: Drop the real image into public/**

When you receive the background photo, copy or move it to:
```
wedding_website/public/background.jpg
```

Replace the placeholder file created in Task 1.

- [ ] **Step 2: Adjust opacity if needed**

Open `app/globals.css` and change the `--bg-opacity` variable to taste:
```css
:root {
  --bg-opacity: 0.4;  /* change this value between 0.0 and 1.0 */
}
```

- [ ] **Step 3: Verify and commit**

```bash
cd wedding_website && npm run dev
```

Check all pages. When satisfied:

```bash
cd wedding_website && git add public/background.jpg app/globals.css && git commit -m "feat: add real wedding background photo"
```
