-- Create the visits table
CREATE TABLE IF NOT EXISTS public.visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    language TEXT,
    screen_resolution TEXT,
    timezone TEXT,
    country TEXT,
    city TEXT,
    region TEXT,
    latitude TEXT,
    longitude TEXT,
    referrer TEXT,
    current_page TEXT,
    session_id TEXT, -- To group actions by session
    actions JSONB DEFAULT '[]'::jsonb -- To record what the user did (sections viewed, clicks, etc.)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert visits (for tracking)
CREATE POLICY "Allow public to insert visits" ON public.visits
    FOR INSERT WITH CHECK (true);

-- Allow only authenticated users (or you) to view visits
-- For simplicity, since you use a custom login, we will allow selecting based on your needs
-- Or you can use a more restrictive policy if you use Supabase Auth
CREATE POLICY "Allow public to read visits" ON public.visits
    FOR SELECT USING (true);

-- Enable Realtime for these tables
-- Run these individually if you get errors, as some Supabase projects have different realtime setups
ALTER PUBLICATION supabase_realtime ADD TABLE public.visits;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
