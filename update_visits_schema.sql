-- Add new columns for advanced visitor tracking
ALTER TABLE public.visits 
ADD COLUMN IF NOT EXISTS ram_size TEXT,
ADD COLUMN IF NOT EXISTS cpu_cores TEXT,
ADD COLUMN IF NOT EXISTS battery_level TEXT,
ADD COLUMN IF NOT EXISTS battery_charging BOOLEAN,
ADD COLUMN IF NOT EXISTS connection_type TEXT,
ADD COLUMN IF NOT EXISTS connection_speed TEXT,
ADD COLUMN IF NOT EXISTS full_url TEXT;
