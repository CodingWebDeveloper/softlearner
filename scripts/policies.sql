-- =====================
-- RLS POLICIES (Categories, Tags, Courses)
-- =====================

-- Categories Policies
-- Allow all users to view categories
DROP POLICY IF EXISTS "Allow all users to view categories" ON categories;
CREATE POLICY "Allow all users to view categories" ON categories
FOR SELECT USING (true);
-- Allow only admin to add, update, delete categories
DROP POLICY IF EXISTS "Allow only admin to modify categories" ON categories;
CREATE POLICY "Allow only admin to modify categories" ON categories
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- Tags Policies
-- Allow all users to view tags
DROP POLICY IF EXISTS "Allow all users to view tags" ON tags;
CREATE POLICY "Allow all users to view tags" ON tags
FOR SELECT USING (true);
-- Allow only admin to add, update, delete tags
DROP POLICY IF EXISTS "Allow only admin to modify tags" ON tags;
CREATE POLICY "Allow only admin to modify tags" ON tags
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- Course Tags Policies
-- Allow all users to view course tags
DROP POLICY IF EXISTS "Allow all users to view course tags" ON course_tags;
CREATE POLICY "Allow all users to view course tags" ON course_tags
FOR SELECT USING (true);

-- Allow course creators to manage tags for their courses
DROP POLICY IF EXISTS "Allow creators to manage course tags" ON course_tags;
CREATE POLICY "Allow creators to manage course tags" ON course_tags
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
);

-- Courses Policies
-- Allow all users to view courses
DROP POLICY IF EXISTS "Allow all users to view courses" ON courses;
CREATE POLICY "Allow all users to view courses" ON courses
FOR SELECT USING (true);
-- Allow only admin or creator to add, update, delete courses
DROP POLICY IF EXISTS "Allow admin or creator to modify courses" ON courses;
CREATE POLICY "Allow admin or creator to modify courses" ON courses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  ) OR auth.uid() = creator_id
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  ) OR auth.uid() = creator_id
);

-- Users Policies
-- Allow all users to view users
DROP POLICY IF EXISTS "Allow all users to view users" ON users;
CREATE POLICY "Allow all users to view users" ON users
FOR SELECT USING (true);

-- Allow users to update their own profile data
DROP POLICY IF EXISTS "Allow users to update their own profile" ON users;
CREATE POLICY "Allow users to update their own profile" ON users
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Resources Policies
-- Allow all users to view resources
DROP POLICY IF EXISTS "Allow all users to view resources" ON resources;
CREATE POLICY "Allow all users to view resources" ON resources
FOR SELECT USING (true);

-- Allow course creators to create resources for their courses
DROP POLICY IF EXISTS "Allow creators to create resources" ON resources;
CREATE POLICY "Allow creators to create resources" ON resources
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_id
    AND c.creator_id = auth.uid()
  )
);

-- Allow course creators to update their course resources
DROP POLICY IF EXISTS "Allow creators to update resources" ON resources;
CREATE POLICY "Allow creators to update resources" ON resources
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_id
    AND c.creator_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_id
    AND c.creator_id = auth.uid()
  )
);

-- Allow course creators to delete their course resources
DROP POLICY IF EXISTS "Allow creators to delete resources" ON resources;
CREATE POLICY "Allow creators to delete resources" ON resources
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_id
    AND c.creator_id = auth.uid()
  )
);

-- Reviews Policies
-- Allow all users to view reviews
DROP POLICY IF EXISTS "Allow all users to view reviews" ON reviews;
CREATE POLICY "Allow all users to view reviews" ON reviews
FOR SELECT USING (true);
-- Allow authenticated users to create reviews only for courses they have purchased
DROP POLICY IF EXISTS "Allow authenticated users to create reviews for purchased courses" ON reviews;
CREATE POLICY "Allow authenticated users to create reviews for purchased courses" ON reviews
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM orders 
    WHERE user_id = auth.uid() 
    AND course_id = reviews.course_id 
    AND status = 'ACTIVE'
  )
);
-- Allow users to update their own reviews
DROP POLICY IF EXISTS "Allow users to update their own reviews" ON reviews;
CREATE POLICY "Allow users to update their own reviews" ON reviews
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Allow users to delete their own reviews
DROP POLICY IF EXISTS "Allow users to delete their own reviews" ON reviews;
CREATE POLICY "Allow users to delete their own reviews" ON reviews
FOR DELETE USING (auth.uid() = user_id);

-- Review Votes Policies
-- Allow all users to view review votes
DROP POLICY IF EXISTS "Allow all users to view review votes" ON review_votes;
CREATE POLICY "Allow all users to view review votes" ON review_votes
FOR SELECT USING (true);

-- Allow authenticated users to create review votes
DROP POLICY IF EXISTS "Allow authenticated users to create review votes" ON review_votes;
CREATE POLICY "Allow authenticated users to create review votes" ON review_votes
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own review votes
DROP POLICY IF EXISTS "Allow users to update their own review votes" ON review_votes;
CREATE POLICY "Allow users to update their own review votes" ON review_votes
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own review votes
DROP POLICY IF EXISTS "Allow users to delete their own review votes" ON review_votes;
CREATE POLICY "Allow users to delete their own review votes" ON review_votes
FOR DELETE USING (auth.uid() = user_id);

-- Orders Policies
-- Allow authenticated users to view their own orders
DROP POLICY IF EXISTS "Allow users to view their own orders" ON orders;
CREATE POLICY "Allow users to view their own orders" ON orders
FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to create orders for themselves only
DROP POLICY IF EXISTS "Allow authenticated users to create orders" ON orders;
CREATE POLICY "Allow authenticated users to create orders" ON orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own orders
DROP POLICY IF EXISTS "Allow users to update their own orders" ON orders;
CREATE POLICY "Allow users to update their own orders" ON orders
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Bookmarks Policies
-- Allow authenticated users to view their own bookmarks
DROP POLICY IF EXISTS "Allow users to view their own bookmarks" ON bookmarks;
CREATE POLICY "Allow users to view their own bookmarks" ON bookmarks
FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to create bookmarks for themselves only
DROP POLICY IF EXISTS "Allow authenticated users to create bookmarks" ON bookmarks;
CREATE POLICY "Allow authenticated users to create bookmarks" ON bookmarks
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own bookmarks
DROP POLICY IF EXISTS "Allow users to delete their own bookmarks" ON bookmarks;
CREATE POLICY "Allow users to delete their own bookmarks" ON bookmarks
FOR DELETE USING (auth.uid() = user_id);

-- Tests Policies
-- Allow all users to view tests
DROP POLICY IF EXISTS "Allow all users to view tests" ON tests;
CREATE POLICY "Allow all users to view tests" ON tests
FOR SELECT USING (true);

-- Allow course creators to create tests for their courses
DROP POLICY IF EXISTS "Allow creators to create tests" ON tests;
CREATE POLICY "Allow creators to create tests" ON tests
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
);

-- Allow course creators to update their course tests
DROP POLICY IF EXISTS "Allow creators to update tests" ON tests;
CREATE POLICY "Allow creators to update tests" ON tests
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
);

-- Allow course creators to delete their course tests
DROP POLICY IF EXISTS "Allow creators to delete tests" ON tests;
CREATE POLICY "Allow creators to delete tests" ON tests
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM courses c
    WHERE c.id = course_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
);

-- Questions Policies
-- Allow users to view questions only for courses they have purchased
DROP POLICY IF EXISTS "Allow users to view questions for purchased courses" ON questions;
CREATE POLICY "Allow users to view questions for purchased courses" ON questions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o
    JOIN tests t ON t.course_id = o.course_id
    WHERE o.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND t.id = questions.test_id
  )
);

-- Allow course creators to create questions for their course tests
DROP POLICY IF EXISTS "Allow creators to create questions" ON questions;
CREATE POLICY "Allow creators to create questions" ON questions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM tests t
    JOIN courses c ON c.id = t.course_id
    WHERE t.id = questions.test_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
);

-- Allow course creators to update questions for their course tests
DROP POLICY IF EXISTS "Allow creators to update questions" ON questions;
CREATE POLICY "Allow creators to update questions" ON questions
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM tests t
    JOIN courses c ON c.id = t.course_id
    WHERE t.id = questions.test_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM tests t
    JOIN courses c ON c.id = t.course_id
    WHERE t.id = questions.test_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
);

-- Allow course creators to delete questions for their course tests
DROP POLICY IF EXISTS "Allow creators to delete questions" ON questions;
CREATE POLICY "Allow creators to delete questions" ON questions
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM tests t
    JOIN courses c ON c.id = t.course_id
    WHERE t.id = questions.test_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
);

-- Answer Options Policies
-- Allow users to view answer options only for courses they have purchased
DROP POLICY IF EXISTS "Allow users to view answer options for purchased courses" ON answer_options;
CREATE POLICY "Allow users to view answer options for purchased courses" ON answer_options
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o
    JOIN tests t ON t.course_id = o.course_id
    JOIN questions q ON q.test_id = t.id
    WHERE o.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND q.id = answer_options.question_id
  )
);

DROP POLICY IF EXISTS "Allow creators to view answer options" ON answer_options;
CREATE POLICY "Allow creators to view answer options" ON answer_options
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM questions q
    JOIN tests t ON q.test_id = t.id
    JOIN courses c ON c.id = t.course_id
    WHERE q.id = answer_options.question_id
      AND c.creator_id = auth.uid()
  )
);

-- Allow course creators to create answer options for their course questions
DROP POLICY IF EXISTS "Allow creators to create answer options" ON answer_options;
CREATE POLICY "Allow creators to create answer options" ON answer_options
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM questions q
    JOIN tests t ON t.id = q.test_id
    JOIN courses c ON c.id = t.course_id
    WHERE q.id = answer_options.question_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
);

-- Allow course creators to update answer options for their course questions
DROP POLICY IF EXISTS "Allow creators to update answer options" ON answer_options;
CREATE POLICY "Allow creators to update answer options" ON answer_options
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM questions q
    JOIN tests t ON t.id = q.test_id
    JOIN courses c ON c.id = t.course_id
    WHERE q.id = answer_options.question_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM questions q
    JOIN tests t ON t.id = q.test_id
    JOIN courses c ON c.id = t.course_id
    WHERE q.id = answer_options.question_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
);

-- Allow course creators to delete answer options for their course questions
DROP POLICY IF EXISTS "Allow creators to delete answer options" ON answer_options;
CREATE POLICY "Allow creators to delete answer options" ON answer_options
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM questions q
    JOIN tests t ON t.id = q.test_id
    JOIN courses c ON c.id = t.course_id
    WHERE q.id = answer_options.question_id
    AND (
      c.creator_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.role = 'admin'
      )
    )
  )
);

-- User Tests Policies
-- Allow users to view their own test results only for courses they have purchased
DROP POLICY IF EXISTS "Allow users to view their own test results" ON user_tests;
CREATE POLICY "Allow users to view their own test results" ON user_tests
FOR SELECT USING (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM orders o
    JOIN tests t ON t.course_id = o.course_id
    WHERE o.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND t.id = user_tests.test_id
  )
);

-- Allow users to create test results only for courses they have purchased
DROP POLICY IF EXISTS "Allow users to create test results" ON user_tests;
CREATE POLICY "Allow users to create test results" ON user_tests
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM orders o
    JOIN tests t ON t.course_id = o.course_id
    WHERE o.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND t.id = user_tests.test_id
  )
);

-- Allow users to update their own test results only for courses they have purchased
DROP POLICY IF EXISTS "Allow users to update their own test results" ON user_tests;
CREATE POLICY "Allow users to update their own test results" ON user_tests
FOR UPDATE USING (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM orders o
    JOIN tests t ON t.course_id = o.course_id
    WHERE o.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND t.id = user_tests.test_id
  )
) WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM orders o
    JOIN tests t ON t.course_id = o.course_id
    WHERE o.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND t.id = user_tests.test_id
  )
);

-- User Answers Policies
-- Allow users to view their own answers only for courses they have purchased
DROP POLICY IF EXISTS "Allow users to view their own answers" ON user_answers;
CREATE POLICY "Allow users to view their own answers" ON user_answers
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_tests ut
    JOIN orders o ON o.user_id = ut.user_id
    JOIN tests t ON t.course_id = o.course_id
    WHERE ut.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND ut.id = user_answers.user_test_id
  )
);

-- Allow users to create answers only for courses they have purchased
DROP POLICY IF EXISTS "Allow users to create answers" ON user_answers;
CREATE POLICY "Allow users to create answers" ON user_answers
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_tests ut
    JOIN orders o ON o.user_id = ut.user_id
    JOIN tests t ON t.course_id = o.course_id
    WHERE ut.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND ut.id = user_answers.user_test_id
  )
);

-- Allow users to update their own answers only for courses they have purchased
DROP POLICY IF EXISTS "Allow users to update their own answers" ON user_answers;
CREATE POLICY "Allow users to update their own answers" ON user_answers
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM user_tests ut
    JOIN orders o ON o.user_id = ut.user_id
    JOIN tests t ON t.course_id = o.course_id
    WHERE ut.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND ut.id = user_answers.user_test_id
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_tests ut
    JOIN orders o ON o.user_id = ut.user_id
    JOIN tests t ON t.course_id = o.course_id
    WHERE ut.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND ut.id = user_answers.user_test_id
  )
);

-- User Resources Policies
-- Allow users to view their own resource completion records only for courses they have purchased
DROP POLICY IF EXISTS "Allow users to view their own resource completion records" ON user_resources;
CREATE POLICY "Allow users to view their own resource completion records" ON user_resources
FOR SELECT USING (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM orders o
    JOIN resources r ON r.course_id = o.course_id
    WHERE o.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND r.id = user_resources.resource_id
  )
);

-- Allow users to create resource completion records only for courses they have purchased
DROP POLICY IF EXISTS "Allow users to create resource completion records" ON user_resources;
CREATE POLICY "Allow users to create resource completion records" ON user_resources
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM orders o
    JOIN resources r ON r.course_id = o.course_id
    WHERE o.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND r.id = user_resources.resource_id
  )
);

-- Allow users to update their own resource completion records only for courses they have purchased
DROP POLICY IF EXISTS "Allow users to update their own resource completion records" ON user_resources;
CREATE POLICY "Allow users to update their own resource completion records" ON user_resources
FOR UPDATE USING (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM orders o
    JOIN resources r ON r.course_id = o.course_id
    WHERE o.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND r.id = user_resources.resource_id
  )
) WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM orders o
    JOIN resources r ON r.course_id = o.course_id
    WHERE o.user_id = auth.uid()
    AND o.status = 'SUCCEEDED'
    AND r.id = user_resources.resource_id
  )
);

-- =====================
-- CREATOR APPLICATIONS POLICIES
-- =====================

-- Creator Applications Policies
-- Allow users to view their own applications
DROP POLICY IF EXISTS "Allow users to view their own applications" ON creator_applications;
CREATE POLICY "Allow users to view their own applications" ON creator_applications
FOR SELECT USING (auth.uid() = user_id);

-- Allow users to create their own applications
DROP POLICY IF EXISTS "Allow users to create their own applications" ON creator_applications;
CREATE POLICY "Allow users to create their own applications" ON creator_applications
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow only admins to view all applications
DROP POLICY IF EXISTS "Allow admins to view all applications" ON creator_applications;
CREATE POLICY "Allow admins to view all applications" ON creator_applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- Allow only admins to update application status
DROP POLICY IF EXISTS "Allow admins to update application status" ON creator_applications;
CREATE POLICY "Allow admins to update application status" ON creator_applications
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- Application Logs Policies
-- Allow users to view logs for their own applications
DROP POLICY IF EXISTS "Allow users to view logs for their own applications" ON application_logs;
CREATE POLICY "Allow users to view logs for their own applications" ON application_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM creator_applications ca
    WHERE ca.id = application_logs.application_id
    AND ca.user_id = auth.uid()
  )
);

-- Allow only admins to view all application logs
DROP POLICY IF EXISTS "Allow admins to view all application logs" ON application_logs;
CREATE POLICY "Allow admins to view all application logs" ON application_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- Allow only admins to create application logs
DROP POLICY IF EXISTS "Allow admins to create application logs" ON application_logs;
CREATE POLICY "Allow admins to create application logs" ON application_logs
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- Allow admins to update user roles (for creator role assignment)
DROP POLICY IF EXISTS "Allow admins to update user roles" ON users;
CREATE POLICY "Allow admins to update user roles" ON users
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);