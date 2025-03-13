-- Create avatars storage bucket if it doesn't exist
DO $$
DECLARE
    bucket_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM storage.buckets
        WHERE name = 'avatars'
    ) INTO bucket_exists;

    IF NOT bucket_exists THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('avatars', 'avatars', TRUE);
    END IF;
END $$;

-- Set up storage policy to allow authenticated users to upload their own avatars
DO $$
BEGIN
    -- Policy for inserting avatars (only authenticated users can upload their own avatars)
    IF NOT EXISTS (
        SELECT 1
        FROM storage.policies
        WHERE name = 'Avatar Upload Policy'
    ) THEN
        CREATE POLICY "Avatar Upload Policy"
        ON storage.objects
        FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'avatars' AND
            (storage.foldername(name))[1] = auth.uid()::text
        );
    END IF;

    -- Policy for updating avatars (only authenticated users can update their own avatars)
    IF NOT EXISTS (
        SELECT 1
        FROM storage.policies
        WHERE name = 'Avatar Update Policy'
    ) THEN
        CREATE POLICY "Avatar Update Policy"
        ON storage.objects
        FOR UPDATE
        TO authenticated
        USING (
            bucket_id = 'avatars' AND
            (storage.foldername(name))[1] = auth.uid()::text
        );
    END IF;

    -- Policy for reading avatars (public access)
    IF NOT EXISTS (
        SELECT 1
        FROM storage.policies
        WHERE name = 'Avatar Read Policy'
    ) THEN
        CREATE POLICY "Avatar Read Policy"
        ON storage.objects
        FOR SELECT
        TO public
        USING (bucket_id = 'avatars');
    END IF;

    -- Policy for deleting avatars (only authenticated users can delete their own avatars)
    IF NOT EXISTS (
        SELECT 1
        FROM storage.policies
        WHERE name = 'Avatar Delete Policy'
    ) THEN
        CREATE POLICY "Avatar Delete Policy"
        ON storage.objects
        FOR DELETE
        TO authenticated
        USING (
            bucket_id = 'avatars' AND
            (storage.foldername(name))[1] = auth.uid()::text
        );
    END IF;
END $$; 