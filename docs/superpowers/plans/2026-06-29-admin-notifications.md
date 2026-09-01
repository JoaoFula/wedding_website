# Admin RSVP Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-row warning badges in the admin RSVPs table that appear when a guest submits or updates their RSVP, persist across sessions, and are dismissed manually by the admin per row.

**Architecture:** Two new columns (`updated_at`, `admin_seen_at`) on the `guests` table track when a row last changed and when the admin last acknowledged it. A Postgres trigger keeps `updated_at` current. The admin panel computes "unseen" client-side and renders badges + dismiss buttons.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Supabase (Postgres), Tailwind CSS, lucide-react

---

## File Map

| File | Change |
|---|---|
| `supabase-schema.sql` | Add columns to table definition; add UPDATE trigger; add migration block |
| `types/database.ts` | Add `updated_at` and `admin_seen_at` to `Guest` interface |
| `app/admin/page.tsx` | Add `dismissGuest()`, `unseenCount`, tab badge, row badges + dismiss buttons |

---

## Task 1: Update database schema

**Files:**
- Modify: `supabase-schema.sql`

- [ ] **Step 1: Add `updated_at` and `admin_seen_at` columns to the `guests` table definition**

In `supabase-schema.sql`, locate the `CREATE TABLE IF NOT EXISTS guests` block (around line 63). Add two columns before the closing `);`:

```sql
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    admin_seen_at TIMESTAMP WITH TIME ZONE
```

The full column list should now end with:

```sql
    additional_notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    admin_seen_at TIMESTAMP WITH TIME ZONE,
    -- Link to the guest credential that submitted this RSVP
    CONSTRAINT fk_username FOREIGN KEY (username) REFERENCES guest_credentials(username) ON DELETE CASCADE,
    -- Ensure each guest can only have one RSVP row (enforces upsert behaviour)
    CONSTRAINT guests_username_unique UNIQUE (username)
```

- [ ] **Step 2: Extend the existing INSERT trigger function to set `updated_at`**

Locate the `update_has_rsvped` function (around line 144). Replace it with:

```sql
CREATE OR REPLACE FUNCTION update_has_rsvped()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE guest_credentials
    SET has_rsvped = true,
        last_login = NOW()
    WHERE username = NEW.username;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- [ ] **Step 3: Add the UPDATE trigger for `updated_at`**

After the existing `CREATE TRIGGER on_rsvp_submitted` block, add:

```sql
-- Trigger to stamp updated_at on every RSVP update
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_rsvp_updated ON guests;
CREATE TRIGGER on_rsvp_updated
    BEFORE UPDATE ON guests
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
```

- [ ] **Step 4: Add migration block for existing databases**

At the very bottom of `supabase-schema.sql`, append:

```sql
-- ============================================================================
-- MIGRATION: Add updated_at and admin_seen_at columns (if upgrading existing DB)
-- ============================================================================
-- Run this in the Supabase SQL editor if you already have an existing guests table:
--
--   ALTER TABLE guests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
--   ALTER TABLE guests ADD COLUMN IF NOT EXISTS admin_seen_at TIMESTAMPTZ;
--
--   CREATE OR REPLACE FUNCTION set_updated_at()
--   RETURNS TRIGGER AS $$
--   BEGIN
--       NEW.updated_at = NOW();
--       RETURN NEW;
--   END;
--   $$ LANGUAGE plpgsql;
--
--   DROP TRIGGER IF EXISTS on_rsvp_updated ON guests;
--   CREATE TRIGGER on_rsvp_updated
--       BEFORE UPDATE ON guests
--       FOR EACH ROW
--       EXECUTE FUNCTION set_updated_at();
```

- [ ] **Step 5: Run the migration in Supabase**

Go to your Supabase project → SQL Editor. Run the migration block from Step 4 to add the columns and trigger to your live database:

```sql
ALTER TABLE guests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE guests ADD COLUMN IF NOT EXISTS admin_seen_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_rsvp_updated ON guests;
CREATE TRIGGER on_rsvp_updated
    BEFORE UPDATE ON guests
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
```

Expected: Commands complete with no errors.

- [ ] **Step 6: Commit**

```bash
git add supabase-schema.sql
git commit -m "feat: add updated_at and admin_seen_at columns to guests table"
```

---

## Task 2: Update TypeScript types

**Files:**
- Modify: `types/database.ts`

- [ ] **Step 1: Add the two new fields to the `Guest` interface**

Open `types/database.ts`. The current `Guest` interface ends at line 30. Add `updated_at` and `admin_seen_at` after `additional_notes`:

```ts
export interface Guest {
  id: string
  created_at: string
  username: string
  name: string
  attending: boolean
  plus_one_names?: string[]
  dietary_restrictions?: string
  accommodation_needed: boolean
  spotify_song_suggestion?: string
  additional_notes?: string
  updated_at: string
  admin_seen_at?: string
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd /home/jfula/Joao/wedding_website/wedding_website && npx tsc --noEmit
```

Expected: No errors output.

- [ ] **Step 3: Commit**

```bash
git add types/database.ts
git commit -m "feat: add updated_at and admin_seen_at to Guest type"
```

---

## Task 3: Update the admin panel

**Files:**
- Modify: `app/admin/page.tsx`

- [ ] **Step 1: Add `AlertTriangle` and `X` to the lucide-react import**

At line 20, the current import is:

```ts
import { LogOut, Users, UserCheck, UserX } from 'lucide-react'
```

Change it to:

```ts
import { LogOut, Users, UserCheck, UserX, AlertTriangle, X } from 'lucide-react'
```

- [ ] **Step 2: Add the `dismissGuest` handler**

After the `fetchGuestCredentials` function (around line 117), add:

```ts
const dismissGuest = async (username: string) => {
  const now = new Date().toISOString()
  // Optimistic update: remove badge immediately in local state
  setGuests((prev) =>
    prev.map((g) => (g.username === username ? { ...g, admin_seen_at: now } : g))
  )
  // Persist to database in background
  await supabase
    .from('guests')
    .update({ admin_seen_at: now })
    .eq('username', username)
}
```

- [ ] **Step 3: Add the `unseenCount` derived value**

After the stats block (around line 141, after `const rsvpedCount = ...`), add:

```ts
const unseenCount = guests.filter(
  (g) => g.admin_seen_at == null || g.updated_at > g.admin_seen_at
).length
```

- [ ] **Step 4: Update the RSVPs tab label to show the unseen badge**

Locate the RSVPs tab button (around line 178). Change its text content from:

```tsx
RSVPs ({totalGuests})
```

to:

```tsx
RSVPs ({totalGuests}){unseenCount > 0 ? ` · ${unseenCount} new` : ''}
```

The full button should look like:

```tsx
<button
  onClick={() => setActiveTab('rsvps')}
  className={`px-4 py-2 font-medium border-b-2 transition-colors ${
    activeTab === 'rsvps'
      ? 'border-yellow-600 text-yellow-600'
      : 'border-transparent text-gray-600 hover:text-gray-900'
  }`}
>
  RSVPs ({totalGuests}){unseenCount > 0 ? ` · ${unseenCount} new` : ''}
</button>
```

- [ ] **Step 5: Add a table column header for the dismiss action**

In the RSVPs table `<thead>` (around line 263), add a new `<th>` at the end of the header row, after the "Accommodation" column:

```tsx
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  New
</th>
```

- [ ] **Step 6: Add the warning icon and dismiss button to each table row**

In the table body, locate the `filteredGuests.map((guest) => ...)` block (around line 291). 

First, add the `isUnseen` flag at the top of the map callback:

```tsx
filteredGuests.map((guest) => {
  const isUnseen = guest.admin_seen_at == null || guest.updated_at > guest.admin_seen_at
  return (
    <tr key={guest.id} className="hover:bg-gray-50">
```

Second, update the Name cell to show the warning icon when unseen:

```tsx
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
  <span className="inline-flex items-center gap-1">
    {isUnseen && (
      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
    )}
    {guest.name}
  </span>
</td>
```

Third, add a new `<td>` at the end of the row (after the Accommodation cell) for the dismiss button:

```tsx
<td className="px-6 py-4 whitespace-nowrap">
  {isUnseen && (
    <button
      onClick={() => dismissGuest(guest.username)}
      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      title="Mark as seen"
    >
      <X className="w-4 h-4" />
    </button>
  )}
</td>
```

- [ ] **Step 7: Verify no TypeScript errors**

```bash
cd /home/jfula/Joao/wedding_website/wedding_website && npx tsc --noEmit
```

Expected: No errors output.

- [ ] **Step 8: Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat: add RSVP notification badges with per-row dismiss to admin panel"
```

---

## Task 4: Manual verification

- [ ] **Step 1: Start the dev server**

```bash
cd /home/jfula/Joao/wedding_website/wedding_website && npm run dev
```

Expected: Server starts on `http://localhost:3000`.

- [ ] **Step 2: Verify new RSVP shows badge**

1. Log in as a regular guest (e.g. username `john.smith`, PIN `1234`) at `http://localhost:3000/login`
2. Submit an RSVP at `http://localhost:3000/rsvp`
3. Log out, then log in as admin (username `admin`, PIN `0000`)
4. Open `http://localhost:3000/admin`
5. Expected: RSVPs tab shows "RSVPs (N) · 1 new"; the guest's row shows a yellow ⚠ icon next to their name and an X button at the end.

- [ ] **Step 3: Verify dismiss clears the badge**

1. Click the X button on the guest's row.
2. Expected: The ⚠ icon and X button disappear immediately. The "· 1 new" count in the tab label decrements (disappears if it was the only unseen row). No page reload needed.

- [ ] **Step 4: Verify persistence across sessions**

1. Without dismissing, log out of the admin panel.
2. Log back in as admin.
3. Open the RSVPs tab.
4. Expected: The badge is still present — it was not cleared by logout.

- [ ] **Step 5: Verify update (not just new RSVP) triggers badge**

1. Log in as the same guest again, change their attending status, and re-submit the RSVP form.
2. Log in as admin, open RSVPs tab.
3. Expected: The badge reappears on that guest's row (even though `admin_seen_at` was previously set, `updated_at` is now newer).
