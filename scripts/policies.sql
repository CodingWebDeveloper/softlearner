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
FOR ALL USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin');

-- Tags Policies
-- Allow all users to view tags
DROP POLICY IF EXISTS "Allow all users to view tags" ON tags;
CREATE POLICY "Allow all users to view tags" ON tags
FOR SELECT USING (true);
-- Allow only admin to add, update, delete tags
DROP POLICY IF EXISTS "Allow only admin to modify tags" ON tags;
CREATE POLICY "Allow only admin to modify tags" ON tags
FOR ALL USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin');

-- Course Tags Policies
-- Allow all users to view course tags
DROP POLICY IF EXISTS "Allow all users to view course tags" ON course_tags;
CREATE POLICY "Allow all users to view course tags" ON course_tags
FOR SELECT USING (true);

-- Courses Policies
-- Allow all users to view courses
DROP POLICY IF EXISTS "Allow all users to view courses" ON courses;
CREATE POLICY "Allow all users to view courses" ON courses
FOR SELECT USING (true);
-- Allow only admin or creator to add, update, delete courses
DROP POLICY IF EXISTS "Allow admin or creator to modify courses" ON courses;
CREATE POLICY "Allow admin or creator to modify courses" ON courses
FOR ALL USING (auth.role() = 'admin' OR auth.uid() = creator_id) WITH CHECK (auth.role() = 'admin' OR auth.uid() = creator_id);

-- Users Policies
-- Allow all users to view users
DROP POLICY IF EXISTS "Allow all users to view users" ON users;
CREATE POLICY "Allow all users to view users" ON users
FOR SELECT USING (true);

-- Resources Policies
-- Allow all users to view resources
DROP POLICY IF EXISTS "Allow all users to view resources" ON resources;
CREATE POLICY "Allow all users to view resources" ON resources
FOR SELECT USING (true);

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
