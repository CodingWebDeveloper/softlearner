-- Add variant column to tests table for categorizing tests
-- This script adds support for test variants: knowledge, skill, competence

-- Add variant column with CHECK constraint
ALTER TABLE tests 
ADD COLUMN variant TEXT 
CHECK (variant IN ('knowledge', 'skill', 'competence')) 
DEFAULT 'knowledge' 
NOT NULL;

-- Add index for potential future filtering and performance
CREATE INDEX IF NOT EXISTS idx_tests_variant ON tests(variant);

-- Update existing tests to have default variant (redundant due to DEFAULT, but explicit)
UPDATE tests SET variant = 'knowledge' WHERE variant IS NULL;

