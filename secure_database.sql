-- ==========================================
-- 1. SECURE test_results TABLE
-- ==========================================
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Drop insecure public read/update policies if they exist
DROP POLICY IF EXISTS "Allow reading results" ON public.test_results;
DROP POLICY IF EXISTS "Allow updating results" ON public.test_results;

-- Allow anon to UPDATE only if they know the UUID (which they do right after taking the test)
-- Note: Without a SELECT policy, they cannot list UUIDs to guess them.
CREATE POLICY "Allow anon to update own test" 
ON public.test_results FOR UPDATE TO anon 
USING (true) WITH CHECK (true);

-- Allow authenticated admins to do everything (Supabase usually handles this via service role, but just in case)
-- The existing "Allow admins to delete results" might exist, but let's ensure admins have full access
CREATE POLICY "Allow authenticated full access test_results" 
ON public.test_results FOR ALL TO authenticated USING (true);


-- ==========================================
-- 2. SECURE reservations TABLE
-- ==========================================
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Drop insecure public read/update policies if they exist
DROP POLICY IF EXISTS "Allow reading reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow updating reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow public read" ON public.reservations;

-- Allow public to INSERT reservations
CREATE POLICY "Allow public insert reservations" 
ON public.reservations FOR INSERT TO public WITH CHECK (true);

-- Allow authenticated admins to do everything
CREATE POLICY "Allow authenticated full access reservations" 
ON public.reservations FOR ALL TO authenticated USING (true);


-- ==========================================
-- 3. SECURE contacts TABLE
-- ==========================================
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Drop insecure public read policies if they exist
DROP POLICY IF EXISTS "Allow reading contacts" ON public.contacts;
DROP POLICY IF EXISTS "Allow public read" ON public.contacts;

-- Allow public to INSERT contacts
CREATE POLICY "Allow public insert contacts" 
ON public.contacts FOR INSERT TO public WITH CHECK (true);

-- Allow authenticated admins to do everything
CREATE POLICY "Allow authenticated full access contacts" 
ON public.contacts FOR ALL TO authenticated USING (true);


-- ==========================================
-- 4. CREATE SECURE RPC FUNCTION FOR CHECKING DUPLICATES
-- ==========================================
-- This function runs with "SECURITY DEFINER", meaning it bypasses RLS
-- to check the data securely and returns ONLY a simple string result.
CREATE OR REPLACE FUNCTION check_duplicate_reservation(
    p_email TEXT, 
    p_phone TEXT, 
    p_name TEXT, 
    p_ip TEXT
) RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    twenty_four_hours_ago TIMESTAMP WITH TIME ZONE := NOW() - INTERVAL '24 hours';
BEGIN
    -- Check IP limit (24h) in reservations
    IF EXISTS (SELECT 1 FROM public.reservations WHERE ip_address = p_ip AND created_at >= twenty_four_hours_ago) THEN
        RETURN 'ip_limit';
    END IF;
    -- Check IP limit (24h) in test_results
    IF EXISTS (SELECT 1 FROM public.test_results WHERE reservation_course IS NOT NULL AND ip_address = p_ip AND created_at >= twenty_four_hours_ago) THEN
        RETURN 'ip_limit';
    END IF;

    -- Check data limit (lifetime) in reservations
    IF EXISTS (SELECT 1 FROM public.reservations WHERE email = p_email OR phone = p_phone OR name = p_name) THEN
        RETURN 'data_limit';
    END IF;
    -- Check data limit (lifetime) in test_results
    IF EXISTS (SELECT 1 FROM public.test_results WHERE reservation_course IS NOT NULL AND (email = p_email OR phone = p_phone OR name = p_name)) THEN
        RETURN 'data_limit';
    END IF;

    RETURN 'none';
END;
$$;
