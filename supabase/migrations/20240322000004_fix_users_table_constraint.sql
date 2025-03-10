-- Remove the foreign key constraint on users table
ALTER TABLE IF EXISTS public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Enable realtime for users table
alter publication supabase_realtime add table users;