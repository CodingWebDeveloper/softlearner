-- Course Thumbnails Storage Policies
-- Allow all users to view course thumbnails
DROP POLICY IF EXISTS "Allow all users to view course thumbnails" ON storage.objects;
CREATE POLICY "Allow all users to view course thumbnails" ON storage.objects
FOR SELECT USING (bucket_id = 'course-thumbnails');

-- Allow creators to upload to course-thumbnails bucket
DROP POLICY IF EXISTS "Allow creators to upload to course thumbnails bucket" ON storage.objects;
CREATE POLICY "Allow creators to upload to course thumbnails bucket" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-thumbnails'
  AND EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND (u.role = 'creator' OR u.role = 'admin')
  )
);

-- Allow creators to upload course thumbnails for their courses
DROP POLICY IF EXISTS "Allow creators to upload course thumbnails" ON storage.objects;
CREATE POLICY "Allow creators to upload course thumbnails" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-thumbnails'
  AND (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE (
        c.id::text = objects.name
        OR c.id::text = (storage.foldername(objects.name))[1]
      )
      AND c.creator_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
    )
  )
);

-- Allow creators to update their course thumbnails
DROP POLICY IF EXISTS "Allow creators to update course thumbnails" ON storage.objects;
CREATE POLICY "Allow creators to update course thumbnails" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'course-thumbnails'
  AND (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE (
        c.id::text = objects.name
        OR c.id::text = (storage.foldername(objects.name))[1]
      )
      AND c.creator_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
    )
  )
) WITH CHECK (
  bucket_id = 'course-thumbnails'
  AND (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE (
        c.id::text = objects.name
        OR c.id::text = (storage.foldername(objects.name))[1]
      )
      AND c.creator_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
    )
  )
);

-- Allow creators to delete their course thumbnails
DROP POLICY IF EXISTS "Allow creators to delete course thumbnails" ON storage.objects;
CREATE POLICY "Allow creators to delete course thumbnails" ON storage.objects
FOR DELETE USING (
  bucket_id = 'course-thumbnails'
  AND (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE (
        c.id::text = objects.name
        OR c.id::text = (storage.foldername(objects.name))[1]
      )
      AND c.creator_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
    )
  )
);
