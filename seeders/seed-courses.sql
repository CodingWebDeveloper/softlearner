INSERT INTO courses (
  name,
  description,
  video_url,
  price,
  new_price,
  thumbnail_image_url,
  creator_id,
  category_id
) VALUES
(
  'Introduction to Mathematics',
  'A foundational course covering basic mathematical concepts, problem-solving strategies, and real-world applications. This course is perfect for beginners looking to build a strong math foundation.',
  'https://www.youtube.com/embed/VKlcZCc5uQQ?si=99qTsSATXKoc4fCD',
  49.99,
  39.99,
  'https://images.pexels.com/photos/374918/pexels-photo-374918.jpeg',
  '11111111-1111-1111-1111-111111111111',
  (SELECT id FROM categories WHERE name = 'Mathematics')
),
(
  'Web Development Bootcamp',
  'Learn to build modern web applications from scratch. The course covers HTML, CSS, and JavaScript essentials, hands-on projects, and responsive design techniques. Join this bootcamp to kickstart your web development career!',
  'https://www.youtube.com/embed/TG6XSFeOT3g?si=2gikLYtZ43KHTncW',
  99.99,
  79.99,
  'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
  '11111111-1111-1111-1111-111111111111',
  (SELECT id FROM categories WHERE name = 'Web Development')
),
(
  'Business Analytics Essentials',
  'Master the basics of business analytics and data-driven decision making. The course includes data analysis fundamentals, Excel for business insights, and real-world case studies. Unlock the power of analytics for your business success.',
  'https://www.youtube.com/embed/diaZdX1s5L4?si=GcivOv98ZeaOpLQ8',
  79.99,
  59.99,
  'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
  '11111111-1111-1111-1111-111111111111',
  (SELECT id FROM categories WHERE name = 'Business Analytics')
);

-- Tag assignments for each course
-- Introduction to Mathematics: Beginner, Self-paced, Video Lectures, Skill Building
INSERT INTO course_tags (course_id, tag_id) VALUES
  ((SELECT id FROM courses WHERE name = 'Introduction to Mathematics'), (SELECT id FROM tags WHERE name = 'Beginner')),
  ((SELECT id FROM courses WHERE name = 'Introduction to Mathematics'), (SELECT id FROM tags WHERE name = 'Self-paced')),
  ((SELECT id FROM courses WHERE name = 'Introduction to Mathematics'), (SELECT id FROM tags WHERE name = 'Video Lectures')),
  ((SELECT id FROM courses WHERE name = 'Introduction to Mathematics'), (SELECT id FROM tags WHERE name = 'Skill Building'));

-- Web Development Bootcamp: Bootcamp, Project-based, JavaScript, HTML/CSS, React, Beginner
INSERT INTO course_tags (course_id, tag_id) VALUES
  ((SELECT id FROM courses WHERE name = 'Web Development Bootcamp'), (SELECT id FROM tags WHERE name = 'Bootcamp')),
  ((SELECT id FROM courses WHERE name = 'Web Development Bootcamp'), (SELECT id FROM tags WHERE name = 'Project-based')),
  ((SELECT id FROM courses WHERE name = 'Web Development Bootcamp'), (SELECT id FROM tags WHERE name = 'JavaScript')),
  ((SELECT id FROM courses WHERE name = 'Web Development Bootcamp'), (SELECT id FROM tags WHERE name = 'HTML/CSS')),
  ((SELECT id FROM courses WHERE name = 'Web Development Bootcamp'), (SELECT id FROM tags WHERE name = 'React')),
  ((SELECT id FROM courses WHERE name = 'Web Development Bootcamp'), (SELECT id FROM tags WHERE name = 'Beginner'));

-- Business Analytics Essentials: Data Science & Machine Learning, Excel, Career Advancement, Intermediate
INSERT INTO course_tags (course_id, tag_id) VALUES
  ((SELECT id FROM courses WHERE name = 'Business Analytics Essentials'), (SELECT id FROM tags WHERE name = 'Excel')),
  ((SELECT id FROM courses WHERE name = 'Business Analytics Essentials'), (SELECT id FROM tags WHERE name = 'Career Advancement')),
  ((SELECT id FROM courses WHERE name = 'Business Analytics Essentials'), (SELECT id FROM tags WHERE name = 'Intermediate'));

-- Resources for Introduction to Mathematics
-- YouTube Video Resources
INSERT INTO resources (url, name, short_summary, type, course_id, order_index, duration) VALUES
(
  'https://www.youtube.com/embed/dQw4w9WgXcQ?si=example1',
  'Basic Arithmetic Operations',
  'Learn fundamental arithmetic operations including addition, subtraction, multiplication, and division with practical examples.',
  'video',
  (SELECT id FROM courses WHERE name = 'Introduction to Mathematics'),
  1,
  INTERVAL '15 minutes'
),
(
  'https://www.youtube.com/embed/9bZkp7q19f0?si=example2',
  'Introduction to Algebra',
  'Discover the basics of algebra including variables, equations, and solving for unknown values.',
  'video',
  (SELECT id FROM courses WHERE name = 'Introduction to Mathematics'),
  2,
  INTERVAL '20 minutes'
);

-- Downloadable Resources for Introduction to Mathematics
INSERT INTO resources (url, name, short_summary, type, course_id, order_index) VALUES
(
  'https://drive.google.com/uc?export=download&id=1ABC123DEF456',
  'Mathematics Practice Workbook',
  'Comprehensive workbook with exercises covering all basic mathematical concepts taught in the course.',
  'downloadable file',
  (SELECT id FROM courses WHERE name = 'Introduction to Mathematics'),
  3
),
(
  'https://drive.google.com/uc?export=download&id=2XYZ789GHI012',
  'Formula Reference Sheet',
  'Quick reference guide with all essential mathematical formulas and concepts for easy access.',
  'downloadable file',
  (SELECT id FROM courses WHERE name = 'Introduction to Mathematics'),
  4
);

-- Resources for Web Development Bootcamp
-- YouTube Video Resources
INSERT INTO resources (url, name, short_summary, type, course_id, order_index, duration) VALUES
(
  'https://www.youtube.com/embed/UB1O30fR-EE?si=example3',
  'HTML Fundamentals',
  'Learn the basics of HTML including document structure, elements, and semantic markup.',
  'video',
  (SELECT id FROM courses WHERE name = 'Web Development Bootcamp'),
  1,
  INTERVAL '25 minutes'
),
(
  'https://www.youtube.com/embed/1PnVor36_40?si=example4',
  'CSS Styling Basics',
  'Master CSS fundamentals including selectors, properties, and responsive design principles.',
  'video',
  (SELECT id FROM courses WHERE name = 'Web Development Bootcamp'),
  2,
  INTERVAL '30 minutes'
);

-- Downloadable Resources for Web Development Bootcamp
INSERT INTO resources (url, name, short_summary, type, course_id, order_index) VALUES
(
  'https://drive.google.com/uc?export=download&id=3JKL345MNO678',
  'Web Development Project Templates',
  'Collection of starter templates and code snippets to accelerate your web development projects.',
  'downloadable file',
  (SELECT id FROM courses WHERE name = 'Web Development Bootcamp'),
  3
),
(
  'https://drive.google.com/uc?export=download&id=4PQR901STU234',
  'CSS Framework Guide',
  'Comprehensive guide to popular CSS frameworks including Bootstrap, Tailwind, and Material-UI.',
  'downloadable file',
  (SELECT id FROM courses WHERE name = 'Web Development Bootcamp'),
  4
);

-- Resources for Business Analytics Essentials
-- YouTube Video Resources
INSERT INTO resources (url, name, short_summary, type, course_id, order_index, duration) VALUES
(
  'https://www.youtube.com/embed/aircAruvnKk?si=example5',
  'Data Analysis Fundamentals',
  'Introduction to data analysis concepts, types of data, and basic analytical techniques.',
  'video',
  (SELECT id FROM courses WHERE name = 'Business Analytics Essentials'),
  1,
  INTERVAL '22 minutes'
),
(
  'https://www.youtube.com/embed/8jLOx1hD3_o?si=example6',
  'Excel for Business Analytics',
  'Learn advanced Excel functions and features specifically designed for business analytics and reporting.',
  'video',
  (SELECT id FROM courses WHERE name = 'Business Analytics Essentials'),
  2,
  INTERVAL '28 minutes'
);

-- Downloadable Resources for Business Analytics Essentials
INSERT INTO resources (url, name, short_summary, type, course_id, order_index) VALUES
(
  'https://drive.google.com/uc?export=download&id=5VWX567YZA890',
  'Business Analytics Case Studies',
  'Real-world case studies and datasets to practice your analytical skills on actual business scenarios.',
  'downloadable file',
  (SELECT id FROM courses WHERE name = 'Business Analytics Essentials'),
  3
),
(
  'https://drive.google.com/uc?export=download&id=6BCD123EFG456',
  'Excel Templates and Dashboards',
  'Professional Excel templates and dashboard designs for business reporting and data visualization.',
  'downloadable file',
  (SELECT id FROM courses WHERE name = 'Business Analytics Essentials'),
  4
); 