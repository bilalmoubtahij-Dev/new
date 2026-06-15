-- Add ip_address column to reservations table
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Add ip_address column to test_results table
ALTER TABLE public.test_results ADD COLUMN IF NOT EXISTS ip_address TEXT;
