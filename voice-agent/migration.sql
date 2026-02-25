-- Run this in Supabase SQL editor to add the viva feature tables

CREATE TABLE IF NOT EXISTS public.viva_topics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    subject text,
    description text,
    system_prompt text,
    difficulty text DEFAULT 'medium',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.viva_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id uuid REFERENCES public.viva_topics(id) ON DELETE CASCADE,
    transcript jsonb DEFAULT '[]'::jsonb,
    score numeric,
    feedback text,
    status text DEFAULT 'in_progress',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at timestamp with time zone
);
