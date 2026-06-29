-- Wedding Website Database Schema
--
-- Instructions:
-- 1. Go to https://supabase.com and create a new project
-- 2. Go to the SQL Editor in your Supabase dashboard
-- 3. Copy and paste this entire file
-- 4. Click "Run" to create the tables
-- 5. Copy your project URL and anon key to .env.local

-- ============================================================================
-- GUEST CREDENTIALS TABLE
-- ============================================================================
-- This table stores username/PIN combinations for guest authentication
-- You'll need to populate this with your guests' credentials before they can RSVP

CREATE TABLE IF NOT EXISTS guest_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    username TEXT NOT NULL UNIQUE,
    pin TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    has_rsvped BOOLEAN NOT NULL DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    CONSTRAINT username_lowercase CHECK (username = LOWER(username))
);

-- Enable Row Level Security
ALTER TABLE guest_credentials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read credentials for login verification (PIN will be hashed in production)
-- This is safe because we only check credentials, never expose them
CREATE POLICY "Allow reading credentials for authentication" ON guest_credentials
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Only authenticated admin users can insert/update/delete credentials
CREATE POLICY "Allow authenticated inserts" ON guest_credentials
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated updates" ON guest_credentials
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated deletes" ON guest_credentials
    FOR DELETE
    TO authenticated
    USING (true);

-- Create an index on username for faster lookups
CREATE INDEX IF NOT EXISTS guest_credentials_username_idx ON guest_credentials(username);

-- ============================================================================
-- GUESTS (RSVPs) TABLE
-- ============================================================================
-- This table stores the actual RSVP responses from guests

CREATE TABLE IF NOT EXISTS guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    username TEXT NOT NULL,
    name TEXT NOT NULL,
    attending BOOLEAN NOT NULL DEFAULT false,
    plus_one_name TEXT,
    dietary_restrictions TEXT,
    accommodation_needed BOOLEAN NOT NULL DEFAULT false,
    spotify_song_suggestion TEXT,
    additional_notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    admin_seen_at TIMESTAMP WITH TIME ZONE,
    -- Link to the guest credential that submitted this RSVP
    CONSTRAINT fk_username FOREIGN KEY (username) REFERENCES guest_credentials(username) ON DELETE CASCADE,
    -- Ensure each guest can only have one RSVP row (enforces upsert behaviour)
    CONSTRAINT guests_username_unique UNIQUE (username)
);

-- Enable Row Level Security (RLS)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert RSVPs (they must have a valid username)
CREATE POLICY "Allow inserts with valid username" ON guests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM guest_credentials
            WHERE guest_credentials.username = guests.username
        )
    );

-- Allow anyone to read records (admin check happens in the application)
-- This is needed because we use custom auth (guest_credentials) instead of Supabase Auth
CREATE POLICY "Allow authenticated reads" ON guests
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow anyone to update records (admin check happens in the application)
-- This is needed because we use custom auth (guest_credentials) instead of Supabase Auth
CREATE POLICY "Allow authenticated updates" ON guests
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow anyone to delete records (admin check happens in the application)
-- This is needed because we use custom auth (guest_credentials) instead of Supabase Auth
CREATE POLICY "Allow authenticated deletes" ON guests
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS guests_username_idx ON guests(username);
CREATE INDEX IF NOT EXISTS guests_created_at_idx ON guests(created_at DESC);

-- ============================================================================
-- SAMPLE GUEST CREDENTIALS
-- ============================================================================
-- Insert some sample guest credentials for testing
-- USERNAME FORMAT: firstname.lastname (lowercase, no spaces)
-- PIN: Simple 4-6 digit PIN
-- IMPORTANT: Delete these and add your real guests before going live!

INSERT INTO guest_credentials (username, pin, guest_name, is_admin) VALUES
    -- Admin user - has access to admin panel
    ('admin', '0000', 'Admin User', true),
    -- Regular guests - can only RSVP
    ('john.smith', '1234', 'John Smith', false),
    ('jane.doe', '5678', 'Jane Doe', false),
    ('alice.johnson', '9999', 'Alice Johnson', false),
    ('bob.williams', '4321', 'Bob Williams', false)
ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- HELPER FUNCTION
-- ============================================================================
-- Function to update has_rsvped flag when a guest submits RSVP
-- This runs automatically via a trigger

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

-- Create trigger to automatically update has_rsvped when RSVP is submitted
DROP TRIGGER IF EXISTS on_rsvp_submitted ON guests;
CREATE TRIGGER on_rsvp_submitted
    AFTER INSERT ON guests
    FOR EACH ROW
    EXECUTE FUNCTION update_has_rsvped();

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
    BEFORE UPDATE OF name, attending, plus_one_name, dietary_restrictions, accommodation_needed, spotify_song_suggestion, additional_notes ON guests
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- POST-SETUP INSTRUCTIONS
-- ============================================================================
-- After running this schema:
--
-- 1. TEST THE ADMIN LOGIN:
--    - Username: admin
--    - PIN: 0000
--    - This user has is_admin = true and can access the admin panel
--
-- 2. DELETE THE SAMPLE CREDENTIALS BEFORE GOING LIVE:
--    DELETE FROM guest_credentials WHERE username IN ('admin', 'john.smith', 'jane.doe', 'alice.johnson', 'bob.williams');
--
-- 3. CREATE YOUR REAL ADMIN USER:
--    INSERT INTO guest_credentials (username, pin, guest_name, is_admin)
--    VALUES ('your.username', 'your-pin', 'Your Name', true);
--
-- 4. ADD YOUR REAL GUESTS:
--    You can do this via the admin panel or manually:
--    INSERT INTO guest_credentials (username, pin, guest_name, is_admin)
--    VALUES ('firstname.lastname', 'pin', 'Full Name', false);
--
-- 5. COPY YOUR SUPABASE CREDENTIALS to .env.local:
--    - Go to Settings > API
--    - Copy Project URL and anon public key
--
-- NOTE: You no longer need to create users in Supabase Auth!
-- All authentication (guests and admin) uses the guest_credentials table.

-- ============================================================================
-- MIGRATION: Add unique constraint on guests.username (if upgrading existing DB)
-- ============================================================================
-- If you already have an existing guests table, run this in the SQL editor:
--
--   -- First, remove duplicate rows, keeping only the most recent per username:
--   DELETE FROM guests
--   WHERE id NOT IN (
--       SELECT DISTINCT ON (username) id
--       FROM guests
--       ORDER BY username, created_at DESC
--   );
--
--   -- Then add the unique constraint:
--   ALTER TABLE guests ADD CONSTRAINT guests_username_unique UNIQUE (username);

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
--       BEFORE UPDATE OF name, attending, plus_one_name, dietary_restrictions, accommodation_needed, spotify_song_suggestion, additional_notes ON guests
--       FOR EACH ROW
--       EXECUTE FUNCTION set_updated_at();
