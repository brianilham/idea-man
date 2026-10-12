-- ==============================================================================
-- 01_create_ideas.sql: Supabase PostgreSQL DDL Migration for Idea-man
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create categories & difficulties ENUM or CHECK constraints
-- Table: ideas
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    problem_summary TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    recommended_stack TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    category TEXT NOT NULL CHECK (category IN ('Web App', 'DevTool', 'AI Tool', 'Automation')),
    upvotes INTEGER NOT NULL DEFAULT 0,
    url TEXT NOT NULL UNIQUE,
    author TEXT NOT NULL DEFAULT 'anonymous',
    subreddit TEXT,
    is_new BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_ideas_category ON public.ideas(category);
CREATE INDEX IF NOT EXISTS idx_ideas_difficulty ON public.ideas(difficulty);
CREATE INDEX IF NOT EXISTS idx_ideas_url ON public.ideas(url);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON public.ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_subreddit ON public.ideas(subreddit);
-- Full-Text Search index (GIN) for fast title and problem search
CREATE INDEX IF NOT EXISTS idx_ideas_fts ON public.ideas USING GIN (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(problem_summary, '') || ' ' || coalesce(proposed_solution, ''))
);

-- 4. Trigger to automatically update `updated_at` on modification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ideas_updated_at ON public.ideas;
CREATE TRIGGER trigger_ideas_updated_at
    BEFORE UPDATE ON public.ideas
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- 5.1 Ideas Policies
-- Anyone (authenticated & anonymous visitors) can view ideas
CREATE POLICY "Ideas are viewable by everyone"
    ON public.ideas FOR SELECT
    USING (true);

-- Note: Insert and update on ideas are restricted.
-- Background Ingestion engine uses Service Role Key (admin client) which bypasses RLS automatically.
-- Public and regular users cannot mutate ideas directly from the client.

