-- Create plants storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('plants', 'plants', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policy for inserting plant images (only authenticated users can upload their own plant images)
CREATE POLICY IF NOT EXISTS "Plant Image Upload Policy"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'plants' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for updating plant images (only authenticated users can update their own plant images)
CREATE POLICY IF NOT EXISTS "Plant Image Update Policy"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'plants' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for reading plant images (public access)
CREATE POLICY IF NOT EXISTS "Plant Image Read Policy"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'plants');

-- Policy for deleting plant images (only authenticated users can delete their own plant images)
CREATE POLICY IF NOT EXISTS "Plant Image Delete Policy"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'plants' AND
    (storage.foldername(name))[1] = auth.uid()::text
); 