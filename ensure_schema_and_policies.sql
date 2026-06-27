-- Ensure all missing columns exist in test_results table
ALTER TABLE public.test_results ADD COLUMN IF NOT EXISTS is_school_student BOOLEAN DEFAULT false;
ALTER TABLE public.test_results ADD COLUMN IF NOT EXISTS reservation_course TEXT;
ALTER TABLE public.test_results ADD COLUMN IF NOT EXISTS reservation_level TEXT;
ALTER TABLE public.test_results ADD COLUMN IF NOT EXISTS reservation_time TEXT;
ALTER TABLE public.test_results ADD COLUMN IF NOT EXISTS reservation_message TEXT;
ALTER TABLE public.test_results ADD COLUMN IF NOT EXISTS reservation_status TEXT DEFAULT 'Pending';
ALTER TABLE public.test_results ADD COLUMN IF NOT EXISTS deal_status TEXT DEFAULT 'Pending';
ALTER TABLE public.test_results ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Enable Row Level Security (RLS)
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Clean up older conflicting policies
DROP POLICY IF EXISTS "Allow students to insert results" ON public.test_results;
DROP POLICY IF EXISTS "Allow reading results" ON public.test_results;
DROP POLICY IF EXISTS "Allow updating results" ON public.test_results;
DROP POLICY IF EXISTS "Allow anon to select started tests" ON public.test_results;
DROP POLICY IF EXISTS "Allow anon to update own test" ON public.test_results;
DROP POLICY IF EXISTS "Allow authenticated full access test_results" ON public.test_results;
DROP POLICY IF EXISTS "Allow anon insert test_results" ON public.test_results;
DROP POLICY IF EXISTS "Allow anon select started tests" ON public.test_results;

-- Create Policies

-- 1. Allow anonymous users to INSERT rows
CREATE POLICY "Allow anon insert test_results" 
ON public.test_results FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- 2. Allow anonymous users to SELECT rows only if they have status = 'Started'
-- This allows them to retrieve the ID after insertion without exposing completed results of other users.
CREATE POLICY "Allow anon select started tests" 
ON public.test_results FOR SELECT TO anon 
USING (status = 'Started');

-- 3. Allow anonymous users to UPDATE their own rows
CREATE POLICY "Allow anon update own test" 
ON public.test_results FOR UPDATE TO anon 
USING (true) WITH CHECK (true);

-- 4. Allow authenticated users (Admins) full access
CREATE POLICY "Allow authenticated full access test_results" 
ON public.test_results FOR ALL TO authenticated 
USING (true);

-- Explicit Grants for PostgREST Data API access
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.test_results TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.test_results TO authenticated;
