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
