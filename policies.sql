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
DROP POLICY IF EXISTS "Allow all users to create orders" ON orders;
CREATE POLICY "Allow authenticated users to create orders" ON orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own orders
DROP POLICY IF EXISTS "Allow users to update their own orders" ON orders;
CREATE POLICY "Allow users to update their own orders" ON orders
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
