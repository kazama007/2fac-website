-- ============================================================
-- 2FA.AC — Supabase Row Level Security (RLS) lockdown
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
--
-- BEFORE running: make sure SUPABASE_SERVICE_KEY is set in
-- Vercel env vars (it's already in your .env.local).
-- The admin panel writes via the service key, which bypasses RLS.
-- ============================================================

-- 1. Enable RLS on both tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads_settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop any old permissive policies (ignore errors if they don't exist)
DROP POLICY IF EXISTS "public read" ON blog_posts;
DROP POLICY IF EXISTS "public write" ON blog_posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON blog_posts;
DROP POLICY IF EXISTS "Enable insert for all users" ON blog_posts;
DROP POLICY IF EXISTS "Enable update for all users" ON blog_posts;
DROP POLICY IF EXISTS "Enable delete for all users" ON blog_posts;
DROP POLICY IF EXISTS "public read" ON ads_settings;
DROP POLICY IF EXISTS "public write" ON ads_settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON ads_settings;

-- 3. Allow PUBLIC READ ONLY (website needs this for blog + ads display)
CREATE POLICY "public can read posts"
  ON blog_posts FOR SELECT
  USING (true);

CREATE POLICY "public can read ads settings"
  ON ads_settings FOR SELECT
  USING (true);

-- 4. NO insert/update/delete policies for anon = writes blocked.
--    Only the service key (used by /api/admin on the server) can write.

-- ============================================================
-- Verify: run this after — should show rowsecurity = true
-- ============================================================
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('blog_posts', 'ads_settings');
