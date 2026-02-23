-- run this in Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.tests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    duration integer NOT NULL DEFAULT 60, -- duration in minutes
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.questions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id uuid REFERENCES public.tests(id) ON DELETE CASCADE,
    question_text text NOT NULL,
    type text NOT NULL,
    options jsonb NOT NULL,
    correct_answer text NOT NULL,
    points numeric NOT NULL DEFAULT 1.0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    test_id uuid REFERENCES public.tests(id) ON DELETE CASCADE,
    score numeric DEFAULT 0,
    status text DEFAULT 'in_progress', -- 'in_progress' or 'completed'
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at timestamp with time zone
);

-- RLS policies could be added here if needed, but assuming authenticated users can insert attempts and admins can insert tests/questions.
