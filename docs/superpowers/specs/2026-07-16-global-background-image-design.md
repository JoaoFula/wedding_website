# Global Background Image — Design Spec

**Date:** 2026-07-16

## Overview

Add a fixed, full-screen background photo to the wedding website that persists across all pages. The image sits behind all content at a configurable opacity, with page content displayed inside frosted white cards for readability.

## Requirements

- Background image is visible on every page without any per-page changes.
- Image does not scroll with content (parallax fixed attachment).
- Opacity is adjustable via a single CSS variable.
- Page content remains readable over any photo via frosted white card containers.

## Design

### Background image layer

- **File:** `public/background.jpg` (placeholder slot — user adds the real image when received)
- **CSS target:** `body::before` pseudo-element in `globals.css`
- Using a pseudo-element ensures the image opacity does not cascade down to child elements (which would happen if `opacity` were set directly on `body`)
- Properties: `background-attachment: fixed`, `background-size: cover`, `background-position: center`
- Opacity controlled by `--bg-opacity: 0.4` CSS variable (40%)

### Content cards

- Existing page content wrappers get a semi-transparent frosted white background: `background: rgba(255, 255, 255, 0.82)` with `backdrop-filter: blur(8px)`
- Cards sit visually on top of the photo layer
- Applied via a shared utility class (e.g. `.content-card`) added to each page's main container

### Files changed

| File | Change |
|------|--------|
| `app/globals.css` | Add `--bg-opacity` variable + `body::before` background rule |
| `public/background.jpg` | Image slot — user drops file in when received |
| Per-page components (`app/*/page.tsx`) | Wrap outermost content div with `.content-card` class |

## Constraints

- No changes to `layout.tsx` — the background is purely CSS-driven
- Must not affect the Navigation bar styling (nav sits above the card layer naturally)
- Opacity must remain trivially adjustable: one variable change in `globals.css`
