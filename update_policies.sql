-- 1. Create a SELECT policy for anonymous users to select only started tests.
-- This allows the front-end to retrieve the ID of a newly inserted/registered test record,
-- while preventing them from reading completed test results of other candidates.
CREATE POLICY "Allow anon to select started tests" 
ON public.test_results FOR SELECT TO anon 
USING (status = 'Started');

-- 2. Create a secure RPC function to check the school student status of an email or phone number.
-- This function runs with SECURITY DEFINER (admin privileges) but returns ONLY a simple boolean
-- status without exposing any personal information, scores, or certificate URLs of other candidates.
CREATE OR REPLACE FUNCTION check_student_status(
    p_email TEXT, 
    p_phone TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_student BOOLEAN;
BEGIN
    SELECT is_school_student INTO v_is_student
    FROM public.test_results
    WHERE (
        (p_email IS NOT NULL AND email = p_email) OR 
        (p_phone IS NOT NULL AND phone = p_phone)
    ) AND is_school_student IS NOT NULL
    ORDER BY created_at ASC
    LIMIT 1;

    RETURN v_is_student;
END;
$$;
