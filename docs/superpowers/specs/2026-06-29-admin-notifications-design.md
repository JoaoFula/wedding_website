# Admin RSVP Notifications — Design Spec

**Date:** 2026-06-29  
**Status:** Approved

## Summary

Add per-row warning badges in the admin RSVPs table to indicate when a guest has newly submitted or updated their RSVP. Badges persist across sessions and are dismissed manually, one row at a time.

---

## Requirements

- A warning badge appears next to a guest's name in the RSVPs table when their RSVP is new or has changed since the admin last acknowledged it.
- "Changed" means any field on the `guests` row was updated (attending status, dietary restrictions, plus-one name, etc.).
- The badge persists across admin logout/login (stored in the database, not browser memory).
- The admin dismisses badges manually per row by clicking a dismiss button on that row.
- The RSVPs tab label shows a "· N new" count when there are unseen changes, so the admin knows at a glance.
- No changes to the guest-facing RSVP page are required.

---

## Schema Changes

Two columns are added to the `guests` table:

| Column | Type | Description |
|---|---|---|
| `updated_at` | `TIMESTAMPTZ NOT NULL DEFAULT now()` | Set automatically on every INSERT and UPDATE via Postgres trigger |
| `admin_seen_at` | `TIMESTAMPTZ NULL` | Set by admin when they dismiss the badge; NULL means never seen |

**Unseen condition:** `admin_seen_at IS NULL OR updated_at > admin_seen_at`

### Triggers

- **`on_rsvp_submitted`** (existing INSERT trigger) — extended to also set `updated_at = now()` on the `guests` row.
- **`on_rsvp_updated`** (new UPDATE trigger) — sets `updated_at = now()` on every UPDATE to any field on a `guests` row.

### Migration block

A migration SQL block is added at the bottom of `supabase-schema.sql` for existing databases:

```sql
ALTER TABLE guests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE guests ADD COLUMN IF NOT EXISTS admin_seen_at TIMESTAMPTZ;
-- (plus trigger creation — see schema file)
```

---

## Type Changes

`types/database.ts` — `Guest` interface gains:

```ts
updated_at: string
admin_seen_at?: string
```

---

## Admin Panel UI

### Tab label

When `unseenCount > 0`, the RSVPs tab renders as:

```
RSVPs (12) · 3 new
```

Otherwise it renders as `RSVPs (12)` unchanged.

### Table rows

Each row where `admin_seen_at IS NULL OR updated_at > admin_seen_at`:

- Renders a yellow `<AlertTriangle>` icon (lucide-react) immediately before the guest name.
- Renders an `<X>` icon button at the end of the row as a dismiss control.

Rows without unseen changes render exactly as today.

### Dismiss interaction

Clicking the X button on a row:

1. Immediately removes the badge from local state (optimistic update — no full refetch).
2. Calls `supabase.from('guests').update({ admin_seen_at: new Date().toISOString() }).eq('username', guest.username)` in the background.

---

## Data Flow

```
Guest submits/re-submits RSVP
  → Supabase upsert on guests table
  → Postgres trigger sets updated_at = now()
  → admin_seen_at remains unchanged (or NULL for first RSVP)

Admin opens RSVPs tab
  → fetchGuests() returns all rows including updated_at and admin_seen_at
  → client computes unseenCount and per-row isUnseen flag
  → tab badge and row badges render

Admin clicks dismiss on a row
  → local state updated immediately (badge disappears)
  → supabase.update({ admin_seen_at: now() }) called in background
```

---

## Files Changed

| File | Change |
|---|---|
| `supabase-schema.sql` | Add `updated_at` + `admin_seen_at` columns to table definition; add UPDATE trigger; add migration block |
| `types/database.ts` | Add `updated_at` and `admin_seen_at` to `Guest` interface |
| `app/admin/page.tsx` | Add `dismissGuest()` handler, `unseenCount` derived value, tab badge, row badges + dismiss buttons |

No other files change.
