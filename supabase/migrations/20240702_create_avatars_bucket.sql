-- Create avatars storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policy for inserting avatars (only authenticated users can upload their own avatars)
CREATE POLICY IF NOT EXISTS "Avatar Upload Policy"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for updating avatars (only authenticated users can update their own avatars)
CREATE POLICY IF NOT EXISTS "Avatar Update Policy"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for reading avatars (public access)
CREATE POLICY IF NOT EXISTS "Avatar Read Policy"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy for deleting avatars (only authenticated users can delete their own avatars)
CREATE POLICY IF NOT EXISTS "Avatar Delete Policy"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
); 