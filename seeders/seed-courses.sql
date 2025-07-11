INSERT INTO courses (
  name,
  description,
  video_url,
  price,
  thumbnail_image_url,
  creator_id,
  category_id
) VALUES
(
  'Introduction to Mathematics',
  '**A foundational course covering:**\n- Basic mathematical concepts\n- Problem-solving strategies\n- Real-world applications\n\n_This course is perfect for beginners looking to build a strong math foundation._',
  'https://www.youtube.com/embed/VKlcZCc5uQQ?si=99qTsSATXKoc4fCD',
  49.99,
  'https://images.pexels.com/photos/374918/pexels-photo-374918.jpeg',
  '11111111-1111-1111-1111-111111111111',
  (SELECT id FROM categories WHERE name = 'Mathematics')
),
(
  'Web Development Bootcamp',
  '**Learn to build modern web applications from scratch:**\n- HTML, CSS, and JavaScript essentials\n- Hands-on projects\n- Responsive design techniques\n\n_Join this bootcamp to kickstart your web development career!_',
  'https://www.youtube.com/embed/TG6XSFeOT3g?si=2gikLYtZ43KHTncW',
  99.99,
  'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
  '11111111-1111-1111-1111-111111111111',
  (SELECT id FROM categories WHERE name = 'Web Development')
),
(
  'Business Analytics Essentials',
  '**Master the basics of business analytics and data-driven decision making:**\n- Data analysis fundamentals\n- Excel for business insights\n- Real-world case studies\n\n_Unlock the power of analytics for your business success._',
  'https://www.youtube.com/embed/diaZdX1s5L4?si=GcivOv98ZeaOpLQ8',
  79.99,
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
  ((SELECT id FROM courses WHERE name = 'Business Analytics Essentials'), (SELECT id FROM tags WHERE name = 'Data Science & Machine Learning')),
  ((SELECT id FROM courses WHERE name = 'Business Analytics Essentials'), (SELECT id FROM tags WHERE name = 'Excel')),
  ((SELECT id FROM courses WHERE name = 'Business Analytics Essentials'), (SELECT id FROM tags WHERE name = 'Career Advancement')),
  ((SELECT id FROM courses WHERE name = 'Business Analytics Essentials'), (SELECT id FROM tags WHERE name = 'Intermediate')); 