ALTER TABLE public.test_results 
ADD COLUMN IF NOT EXISTS reservation_course TEXT,
ADD COLUMN IF NOT EXISTS reservation_level TEXT,
ADD COLUMN IF NOT EXISTS reservation_time TEXT,
ADD COLUMN IF NOT EXISTS reservation_message TEXT,
ADD COLUMN IF NOT EXISTS reservation_status TEXT DEFAULT 'New';
