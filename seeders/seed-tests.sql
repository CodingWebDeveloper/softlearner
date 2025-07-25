-- Tests for Introduction to Mathematics
INSERT INTO tests (title, description, course_id) VALUES
(
  'Basic Arithmetic Quiz',
  'Test your understanding of fundamental arithmetic operations including addition, subtraction, multiplication, and division.',
  (SELECT id FROM courses WHERE name = 'Introduction to Mathematics')
),
(
  'Algebra Fundamentals Test',
  'Evaluate your knowledge of basic algebraic concepts, equations, and problem-solving techniques.',
  (SELECT id FROM courses WHERE name = 'Introduction to Mathematics')
);

-- Questions for Basic Arithmetic Quiz
INSERT INTO questions (text, type, points, test_id) VALUES
(
  'What is the result of 125 ÷ 5?',
  'single',
  1,
  (SELECT id FROM tests WHERE title = 'Basic Arithmetic Quiz')
);

INSERT INTO answer_options (question_id, text, is_correct) VALUES
(
  (SELECT id FROM questions WHERE text = 'What is the result of 125 ÷ 5?'),
  '15',
  false
),
(
  (SELECT id FROM questions WHERE text = 'What is the result of 125 ÷ 5?'),
  '20',
  false
),
(
  (SELECT id FROM questions WHERE text = 'What is the result of 125 ÷ 5?'),
  '25',
  true
),
(
  (SELECT id FROM questions WHERE text = 'What is the result of 125 ÷ 5?'),
  '30',
  false
);

INSERT INTO questions (text, type, points, test_id) VALUES
(
  'Which of the following are even numbers? Select all that apply.',
  'multiple',
  2,
  (SELECT id FROM tests WHERE title = 'Basic Arithmetic Quiz')
);

INSERT INTO answer_options (question_id, text, is_correct) VALUES
(
  (SELECT id FROM questions WHERE text = 'Which of the following are even numbers? Select all that apply.'),
  '42',
  true
),
(
  (SELECT id FROM questions WHERE text = 'Which of the following are even numbers? Select all that apply.'),
  '15',
  false
),
(
  (SELECT id FROM questions WHERE text = 'Which of the following are even numbers? Select all that apply.'),
  '28',
  true
),
(
  (SELECT id FROM questions WHERE text = 'Which of the following are even numbers? Select all that apply.'),
  '33',
  false
);

-- Tests for Web Development Bootcamp
INSERT INTO tests (title, description, course_id) VALUES
(
  'HTML Basics Assessment',
  'Test your knowledge of HTML fundamentals, document structure, and semantic elements.',
  (SELECT id FROM courses WHERE name = 'Web Development Bootcamp')
),
(
  'CSS Fundamentals Quiz',
  'Evaluate your understanding of CSS selectors, properties, and responsive design concepts.',
  (SELECT id FROM courses WHERE name = 'Web Development Bootcamp')
);

-- Questions for HTML Basics Assessment
INSERT INTO questions (text, type, points, test_id) VALUES
(
  'Which HTML tag is used to create a hyperlink?',
  'single',
  1,
  (SELECT id FROM tests WHERE title = 'HTML Basics Assessment')
);

INSERT INTO answer_options (question_id, text, is_correct) VALUES
(
  (SELECT id FROM questions WHERE text = 'Which HTML tag is used to create a hyperlink?'),
  '<link>',
  false
),
(
  (SELECT id FROM questions WHERE text = 'Which HTML tag is used to create a hyperlink?'),
  '<a>',
  true
),
(
  (SELECT id FROM questions WHERE text = 'Which HTML tag is used to create a hyperlink?'),
  '<href>',
  false
),
(
  (SELECT id FROM questions WHERE text = 'Which HTML tag is used to create a hyperlink?'),
  '<url>',
  false
);

-- Tests for Business Analytics Essentials
INSERT INTO tests (title, description, course_id) VALUES
(
  'Excel Functions Quiz',
  'Test your knowledge of essential Excel functions used in business analytics.',
  (SELECT id FROM courses WHERE name = 'Business Analytics Essentials')
),
(
  'Data Analysis Concepts Test',
  'Evaluate your understanding of fundamental data analysis concepts and techniques.',
  (SELECT id FROM courses WHERE name = 'Business Analytics Essentials')
);

-- Questions for Excel Functions Quiz
INSERT INTO questions (text, type, points, test_id) VALUES
(
  'Which Excel function would you use to find the average of a range of numbers?',
  'single',
  1,
  (SELECT id FROM tests WHERE title = 'Excel Functions Quiz')
);

INSERT INTO answer_options (question_id, text, is_correct) VALUES
(
  (SELECT id FROM questions WHERE text = 'Which Excel function would you use to find the average of a range of numbers?'),
  'SUM()',
  false
),
(
  (SELECT id FROM questions WHERE text = 'Which Excel function would you use to find the average of a range of numbers?'),
  'AVERAGE()',
  true
),
(
  (SELECT id FROM questions WHERE text = 'Which Excel function would you use to find the average of a range of numbers?'),
  'MEAN()',
  false
),
(
  (SELECT id FROM questions WHERE text = 'Which Excel function would you use to find the average of a range of numbers?'),
  'COUNT()',
  false
); 