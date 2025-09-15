
-- =====================
-- STORAGE POLICIES (Avatars)
-- =====================

-- Avatar Storage Policies
-- Allow all users to view avatar images
DROP POLICY IF EXISTS "Allow all users to view avatars" ON storage.objects;
CREATE POLICY "Allow all users to view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
DROP POLICY IF EXISTS "Allow users to upload their own avatar" ON storage.objects;
CREATE POLICY "Allow users to upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
DROP POLICY IF EXISTS "Allow users to update their own avatar" ON storage.objects;
CREATE POLICY "Allow users to update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
) WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
DROP POLICY IF EXISTS "Allow users to delete their own avatar" ON storage.objects;
CREATE POLICY "Allow users to delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
