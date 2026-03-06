# Security Documentation

## Security Measures Implemented

This wedding website includes multiple layers of security to protect against common web vulnerabilities.

### 1. SQL Injection Protection ✅

**How it's prevented:**
- **Supabase Client Library**: All database queries use Supabase's query builder with parameterized queries
- **No raw SQL**: We never construct SQL queries with string concatenation
- **Input validation**: All user inputs are validated and sanitized before use

**Example:**
```typescript
// ✅ SAFE - Uses parameterized query
const { data } = await supabase
  .from('guest_credentials')
  .eq('username', sanitizedUsername)  // Automatically escaped
  .eq('pin', sanitizedPin)

// ❌ UNSAFE - Never done in this codebase
const query = `SELECT * FROM guest_credentials WHERE username='${username}'`
```

**Where implemented:**
- `app/login/page.tsx` - Login authentication
- `app/rsvp/page.tsx` - RSVP submission
- `app/admin/page.tsx` - Admin data queries

### 2. Cross-Site Scripting (XSS) Protection ✅

**How it's prevented:**
- **Input sanitization**: All text inputs are sanitized to remove HTML tags and script tags
- **React's built-in protection**: React automatically escapes content
- **Validation utilities**: `utils/validation.ts` provides sanitization functions

**Sanitization applied to:**
- Guest names
- Plus-one names
- Dietary restrictions
- Song suggestions
- Additional notes
- All form inputs

**Example:**
```typescript
// Removes HTML tags, script tags, and event handlers
const sanitizedName = sanitizeText(formData.name)
// Input: "<script>alert('xss')</script>John"
// Output: "John"
```

**Where implemented:**
- `utils/validation.ts` - Sanitization functions
- `app/rsvp/page.tsx` - All RSVP form inputs sanitized

### 3. Rate Limiting ✅

**How it works:**
- **Login attempts limited**: Maximum 5 attempts per username per 15 minutes
- **In-memory tracking**: Simple client-side rate limiting (resets on page reload)
- **Prevents brute force**: Makes it harder to guess PINs

**Configuration:**
- Max attempts: 5
- Time window: 15 minutes (900,000 ms)
- Tracked by: Username

**Where implemented:**
- `utils/validation.ts` - `RateLimiter` class
- `app/login/page.tsx` - Applied before database query

### 4. Input Validation ✅

**Validation rules:**

**Username:**
- 2-50 characters
- Lowercase letters, numbers, dots, hyphens, underscores only
- Regex: `/^[a-z0-9._-]+$/`

**PIN:**
- 4-20 characters
- Alphanumeric only
- Regex: `/^[a-zA-Z0-9]+$/`

**Text fields:**
- Max 1000 characters
- HTML tags removed
- Script tags removed
- Event handlers removed

**Where implemented:**
- `utils/validation.ts` - All validation functions
- Applied before any database operations

### 5. Authorization & Access Control ✅

**How it works:**
- **Role-based access**: Users have `is_admin` flag in database
- **Protected routes**: Admin panel checks `isAdmin` flag from session
- **Session validation**: All protected pages check for valid session

**Access levels:**
1. **Unauthenticated users**: Can view public pages (home, story, details, photos)
2. **Authenticated guests** (`is_admin=false`): Can access `/rsvp`
3. **Authenticated admins** (`is_admin=true`): Can access `/admin` and `/rsvp`

**Where implemented:**
- `app/rsvp/page.tsx` - Checks for valid session
- `app/admin/page.tsx` - Checks for valid session AND `isAdmin` flag

### 6. Row Level Security (RLS) ✅

**Database policies:**

**`guest_credentials` table:**
- Anyone can SELECT (needed for login verification)
- Only authenticated admins can INSERT/UPDATE/DELETE

**`guests` table:**
- Anyone can INSERT (with valid username)
- Only authenticated admins can SELECT/UPDATE/DELETE

**Where implemented:**
- `supabase-schema.sql` - All RLS policies defined

## Known Limitations

### Current Implementation

1. **PINs stored in plain text**
   - Current: PINs are not hashed
   - Recommendation: Hash PINs with bcrypt before storing

2. **Client-side rate limiting**
   - Current: Rate limiting resets on page reload
   - Recommendation: Implement server-side rate limiting

3. **Sessions in localStorage**
   - Current: Sessions persist until logout
   - Recommendation: Add expiration time and use httpOnly cookies

4. **No CSRF protection**
   - Current: No CSRF tokens
   - Risk is low for this use case (wedding website, not financial)

## Recommendations for Production

### High Priority

1. **Enable HTTPS**
   - Vercel provides HTTPS by default ✅
   - Ensures all data is encrypted in transit

2. **Hash PINs**
   ```typescript
   import bcrypt from 'bcrypt'
   const hashedPin = await bcrypt.hash(pin, 10)
   ```

3. **Add session expiration**
   ```typescript
   const session = {
     ...userData,
     expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
   }
   ```

### Medium Priority

4. **Server-side rate limiting**
   - Use Vercel Edge Functions or Supabase Edge Functions
   - Track attempts by IP address

5. **Content Security Policy (CSP)**
   - Add CSP headers to prevent XSS
   - Configure in `next.config.ts`

6. **Audit logging**
   - Log all login attempts
   - Log all RSVP submissions
   - Track admin actions

### Low Priority

7. **Two-factor authentication**
   - Optional for extra security
   - May be overkill for a wedding website

8. **Password strength requirements**
   - Enforce minimum 6-digit PINs
   - Consider alphanumeric requirements

## Security Testing

### Manual Tests

**Test SQL Injection:**
```
Username: ' OR '1'='1
PIN: ' OR '1'='1

Expected: Login fails, inputs sanitized
```

**Test XSS:**
```
Name: <script>alert('xss')</script>John
Notes: <img src=x onerror=alert('xss')>

Expected: Script tags removed, content escaped
```

**Test Rate Limiting:**
```
1. Try logging in with wrong PIN 5 times
2. Try 6th attempt
Expected: "Too many login attempts" error
```

**Test Authorization:**
```
1. Login as regular guest
2. Try accessing /admin directly
Expected: Access denied, redirect to home
```

### Automated Testing

Consider adding:
- Unit tests for validation functions
- Integration tests for auth flows
- Penetration testing tools (OWASP ZAP)

## Incident Response

If a security issue is discovered:

1. **Immediately**: Disable affected functionality
2. **Assess**: Determine scope and impact
3. **Fix**: Apply patch
4. **Notify**: Inform affected users if needed
5. **Review**: Update security measures

## Security Checklist

Before going live:

- [ ] Delete all sample/test credentials
- [ ] Create strong admin PIN (6+ characters)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Review all guest credentials
- [ ] Test login with various inputs
- [ ] Test RSVP form with malicious inputs
- [ ] Verify admin panel access control
- [ ] Check database RLS policies
- [ ] Review environment variables
- [ ] Backup database

## Responsible Disclosure

If you discover a security vulnerability:

1. Do NOT post it publicly
2. Email the website owner directly
3. Provide details and steps to reproduce
4. Allow time for fix before public disclosure

## Further Reading

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
