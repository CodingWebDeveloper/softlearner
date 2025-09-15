-- Course Resources Storage Policies
-- Allow all users to view course resources
DROP POLICY IF EXISTS "Allow all users to view course resources" ON storage.objects;
CREATE POLICY "Allow all users to view course resources" ON storage.objects
FOR SELECT USING (bucket_id = 'course-resources');

-- Allow creators to upload to course-resources bucket if they are the course creator
DROP POLICY IF EXISTS "Allow creators to upload course resources" ON storage.objects;
CREATE POLICY "Allow creators to upload course resources" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-resources'
  AND EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id::text = (storage.foldername(objects.name))[1]  -- First part of path is course_id
    AND c.creator_id = auth.uid()
  )
);

-- Allow creators to update their course resources
DROP POLICY IF EXISTS "Allow creators to update course resources" ON storage.objects;
CREATE POLICY "Allow creators to update course resources" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'course-resources'
  AND EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id::text = (storage.foldername(objects.name))[1]  -- First part of path is course_id
    AND c.creator_id = auth.uid()
  )
) WITH CHECK (
  bucket_id = 'course-resources'
  AND EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id::text = (storage.foldername(objects.name))[1]  -- First part of path is course_id
    AND c.creator_id = auth.uid()
  )
);

-- Allow creators to delete their course resources
DROP POLICY IF EXISTS "Allow creators to delete course resources" ON storage.objects;
CREATE POLICY "Allow creators to delete course resources" ON storage.objects
FOR DELETE USING (
  bucket_id = 'course-resources'
  AND EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id::text = (storage.foldername(objects.name))[1]  -- First part of path is course_id
    AND c.creator_id = auth.uid()
  )
);