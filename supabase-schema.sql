-- Wedding Website Database Schema
--
-- Instructions:
-- 1. Go to https://supabase.com and create a new project
-- 2. Go to the SQL Editor in your Supabase dashboard
-- 3. Copy and paste this entire file
-- 4. Click "Run" to create the tables
-- 5. Copy your project URL and anon key to .env.local

-- Create the guests table
CREATE TABLE IF NOT EXISTS guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    attending BOOLEAN NOT NULL DEFAULT false,
    plus_one_name TEXT,
    dietary_restrictions TEXT,
    accommodation_needed BOOLEAN NOT NULL DEFAULT false,
    spotify_song_suggestion TEXT,
    additional_notes TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for RSVP form)
-- This allows guests to submit their RSVP without authentication
CREATE POLICY "Allow anonymous inserts" ON guests
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create a policy that allows authenticated users to read all records
-- This is for the admin panel - only logged-in users can see all RSVPs
CREATE POLICY "Allow authenticated reads" ON guests
    FOR SELECT
    TO authenticated
    USING (true);

-- Create a policy that allows authenticated users to update records
-- This allows admins to update guest information if needed
CREATE POLICY "Allow authenticated updates" ON guests
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create a policy that allows authenticated users to delete records
-- This allows admins to remove spam or duplicate entries
CREATE POLICY "Allow authenticated deletes" ON guests
    FOR DELETE
    TO authenticated
    USING (true);

-- Create an index on email for faster lookups (optional but recommended)
CREATE INDEX IF NOT EXISTS guests_email_idx ON guests(email);

-- Create an index on created_at for sorting (optional but recommended)
CREATE INDEX IF NOT EXISTS guests_created_at_idx ON guests(created_at DESC);

-- Note: After running this schema, you'll need to:
-- 1. Create an admin user in Supabase Auth (Settings > Authentication)
--    - Go to Authentication > Users > Add User
--    - Create a user with your email/password for admin access
-- 2. Copy your Supabase URL and anon key to .env.local
