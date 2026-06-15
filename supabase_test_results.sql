-- Run this in your Supabase SQL Editor to create the test results table
CREATE TABLE public.test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    score INTEGER,
    level TEXT,
    grammar_score INTEGER,
    reading_score INTEGER,
    listening_score INTEGER,
    writing_score INTEGER,
    status TEXT DEFAULT 'Started',
    certificate_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- Security & Permissions (RLS)
-- ==========================================

-- 1. Enable RLS
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- 2. Explicit Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.test_results TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.test_results TO anon;

-- 3. Policies
CREATE POLICY "Allow students to insert results" 
ON public.test_results FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow reading results" 
ON public.test_results FOR SELECT TO public USING (true);

CREATE POLICY "Allow updating results" 
ON public.test_results FOR UPDATE TO public USING (true);

CREATE POLICY "Allow admins to delete results" 
ON public.test_results FOR DELETE TO authenticated USING (true);
