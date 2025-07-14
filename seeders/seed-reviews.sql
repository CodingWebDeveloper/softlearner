-- Seed Reviews Data
-- This file contains sample review data for testing

-- Insert sample reviews for courses
-- Note: Replace the UUIDs with actual course and user IDs from your database

INSERT INTO reviews (content, rating, user_id, course_id) VALUES
(
  'Excellent course! The instructor explains complex concepts in a very clear and understandable way. Highly recommended for beginners.',
  5,
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM courses WHERE name LIKE '%Business%' LIMIT 1)
),
(
  'Great content and well-structured lessons. The practical examples really help solidify the concepts.',
  4,
  (SELECT id FROM users LIMIT 1 OFFSET 1),
  (SELECT id FROM courses WHERE name LIKE '%Business%' LIMIT 1)
),
(
  'Very comprehensive course covering all the essential topics. The instructor is knowledgeable and engaging.',
  5,
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM courses WHERE name LIKE '%Business%' LIMIT 1)
),
(
  'Perfect for someone transitioning from JavaScript to TypeScript. Clear explanations and good examples.',
  4,
  (SELECT id FROM users LIMIT 1 OFFSET 1),
  (SELECT id FROM courses WHERE name LIKE '%Business%' LIMIT 1)
),
(
  'Amazing course! The instructor covers everything you need to know about Next.js. Very practical and hands-on.',
  5,
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM courses WHERE name LIKE '%Excel%' LIMIT 1)
),
(
  'Well-paced course with excellent real-world examples. The instructor makes complex topics easy to understand.',
  4,
  (SELECT id FROM users LIMIT 1 OFFSET 1),
  (SELECT id FROM courses WHERE name LIKE '%Excel%' LIMIT 1)
),
(
  'This course exceeded my expectations. The instructor provides clear explanations and the exercises are very helpful.',
  5,
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM courses WHERE name LIKE '%Excel%' LIMIT 1)
),
(
  'Great course for learning modern web development. The instructor is very responsive and helpful.',
  3,
  (SELECT id FROM users LIMIT 1 OFFSET 1),
  (SELECT id FROM courses WHERE name LIKE '%Excelt%' LIMIT 1)
),
(
  'Excellent course structure and content. The instructor explains everything step by step which makes it easy to follow.',
  5,
  (SELECT id FROM users LIMIT 1),
  (SELECT id FROM courses WHERE name LIKE '%Excel%' LIMIT 1)
),
(
  'Highly recommended! The course covers all the important concepts and the instructor provides great examples.',
  4,
  (SELECT id FROM users LIMIT 1 OFFSET 1),
  (SELECT id FROM courses WHERE name LIKE '%Excel%' LIMIT 1)
); 