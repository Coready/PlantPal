-- Add avatar_url column to users table if it doesn't exist
ALTER TABLE IF EXISTS public.users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT; 