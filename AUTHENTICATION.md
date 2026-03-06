# Authentication System

## Overview

The wedding website uses a **unified authentication system** where all users (both guests and admins) log in the same way using a **username and PIN**. The difference between guests and admins is controlled by an `is_admin` flag in the database.

## How It Works

### Login Flow

1. **All users** go to `/login`
2. Enter their **username** (e.g., `john.smith`) and **PIN** (e.g., `1234`)
3. The system checks the `guest_credentials` table for a matching username/PIN
4. If valid:
   - A session is stored in `localStorage` with user info including `is_admin` flag
   - User is redirected based on their role:
     - **Admins** (`is_admin=true`): Can access `/admin` panel
     - **Guests** (`is_admin=false`): Can access `/rsvp` page
5. If invalid: Error message is shown

### Database Structure

#### `guest_credentials` Table
Stores login credentials for all users:
```sql
- id (UUID)
- username (TEXT, unique) - e.g., "john.smith"
- pin (TEXT) - e.g., "1234"
- guest_name (TEXT) - e.g., "John Smith"
- is_admin (BOOLEAN) - true for admins, false for guests
- has_rsvped (BOOLEAN) - auto-updated when guest RSVPs
- last_login (TIMESTAMP) - auto-updated on login
```

#### `guests` Table
Stores RSVP responses:
```sql
- id (UUID)
- username (TEXT) - links to guest_credentials
- name, email, attending, etc.
```

### Protected Pages

#### `/rsvp` - RSVP Page
- **Requires**: Any logged-in user
- **Checks**: User session exists in localStorage
- **Redirects to `/login`**: If not logged in
- Shows guest name and logout button

#### `/admin` - Admin Dashboard
- **Requires**: Logged-in user with `is_admin=true`
- **Checks**: User session exists AND `isAdmin === true`
- **Redirects to `/login`**: If not logged in
- **Redirects to `/`**: If logged in but not admin
- Shows two tabs:
  1. **RSVPs**: All RSVP submissions with filters
  2. **Guest List**: All login credentials with admin flags

### Sample Users (For Testing)

The database schema includes these sample users:

```sql
-- Admin user
Username: admin
PIN: 0000
is_admin: true

-- Regular guests
Username: john.smith, PIN: 1234, is_admin: false
Username: jane.doe, PIN: 5678, is_admin: false
Username: alice.johnson, PIN: 9999, is_admin: false
Username: bob.williams, PIN: 4321, is_admin: false
```

**IMPORTANT**: Delete these sample users before going live!

## Setup Instructions

### 1. Run the Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire `supabase-schema.sql` file
4. Click "Run"

This creates:
- `guest_credentials` table
- `guests` table
- Row Level Security policies
- Sample test users
- Triggers to auto-update `has_rsvped` flag

### 2. Test the System

**Test as Admin:**
1. Go to `/login`
2. Enter username: `admin`, PIN: `0000`
3. You should be able to access `/admin` dashboard
4. You should see both "RSVPs" and "Guest List" tabs

**Test as Guest:**
1. Logout (if logged in as admin)
2. Go to `/login`
3. Enter username: `john.smith`, PIN: `1234`
4. You should be redirected to `/rsvp`
5. Fill out and submit RSVP
6. Logout and login as admin again
7. Check "Guest List" tab - `john.smith` should show `has_rsvped: Yes`

### 3. Add Your Real Guests

**Option A: Via SQL (Recommended for bulk)**
```sql
INSERT INTO guest_credentials (username, pin, guest_name, is_admin)
VALUES
  ('john.smith', '1234', 'John Smith', false),
  ('jane.doe', '5678', 'Jane Doe', false),
  ('alice.bob', '4321', 'Alice & Bob Johnson', false);
```

**Option B: Via Supabase Table Editor**
1. Go to Supabase Dashboard → Table Editor
2. Select `guest_credentials` table
3. Click "Insert row"
4. Fill in: username, PIN, guest_name, is_admin (false for guests)

**Username Format:** `firstname.lastname` (lowercase, no spaces)
**PIN Format:** Any string (typically 4-6 digits)

### 4. Create Your Admin User

```sql
-- Delete the sample admin first
DELETE FROM guest_credentials WHERE username = 'admin';

-- Create your real admin
INSERT INTO guest_credentials (username, pin, guest_name, is_admin)
VALUES ('your.username', 'your-secure-pin', 'Your Name', true);
```

### 5. Delete Sample Users

Before going live:
```sql
DELETE FROM guest_credentials
WHERE username IN ('admin', 'john.smith', 'jane.doe', 'alice.johnson', 'bob.williams');
```

## Session Management

### Session Storage
Sessions are stored in browser `localStorage` as JSON:
```json
{
  "username": "john.smith",
  "guestName": "John Smith",
  "isAdmin": false,
  "hasRsvped": false,
  "loginTime": "2026-03-06T10:30:00.000Z"
}
```

### Session Checks
- `/rsvp` page: Checks session exists, redirects to `/login` if not
- `/admin` page: Checks session exists AND `isAdmin === true`

### Logout
- Removes session from `localStorage`
- Redirects to home page

## Security Considerations

### Current Implementation
- Credentials stored in plain text in database
- Session stored in browser `localStorage`
- No session expiration (persists until logout)

### Recommendations for Production

1. **Hash PINs**: Use bcrypt to hash PINs in database
2. **Session Expiration**: Add expiration time (e.g., 24 hours)
3. **HTTPS Only**: Ensure site is served over HTTPS
4. **Rate Limiting**: Add login attempt limits
5. **Secure PINs**: Recommend 6+ digit PINs
6. **Session Tokens**: Consider using JWT tokens instead of localStorage

### Row Level Security (RLS)

The database has RLS policies:
- Anyone can read `guest_credentials` (needed for login verification)
- Anyone can insert into `guests` (if they have valid username)
- Only authenticated admins can read all `guests` data
- Only authenticated admins can modify `guest_credentials`

## Troubleshooting

### "Invalid username or PIN"
- Check username is lowercase
- Check PIN matches exactly (case-sensitive)
- Verify credentials exist in database

### "Access denied. Admin privileges required"
- User is logged in but `is_admin=false`
- Check database: `SELECT * FROM guest_credentials WHERE username='...'`
- Update if needed: `UPDATE guest_credentials SET is_admin=true WHERE username='...'`

### Can't access `/rsvp` or `/admin`
- Clear browser localStorage: `localStorage.clear()`
- Try logging in again
- Check browser console for errors

### Session persists after logout
- Clear browser cache
- Check that logout button calls `localStorage.removeItem('userSession')`

## Adding New Guests

You can add guests anytime via the admin panel or SQL:

```sql
INSERT INTO guest_credentials (username, pin, guest_name, is_admin)
VALUES ('new.guest', '1234', 'New Guest Name', false);
```

The guest will receive their credentials (username & PIN) and can log in to RSVP.

## Future Enhancements

Potential improvements:
- Add "Add Guest" form in admin panel
- Email guests their credentials automatically
- Allow password reset/PIN change
- Add guest photo uploads with credentials
- Track login history
- Export guest list to CSV
