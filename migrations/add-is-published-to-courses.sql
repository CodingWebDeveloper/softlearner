-- Add is_published column to courses table
-- This migration adds the ability to publish/unpublish courses

ALTER TABLE courses 
ADD COLUMN is_published BOOLEAN DEFAULT FALSE;

-- Add index for performance when filtering published courses
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);

-- Update the existing courses trigger to include the new column
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
