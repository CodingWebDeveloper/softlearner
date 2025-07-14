-- =====================
-- RLS POLICIES (Categories, Tags, Courses)
-- =====================

-- Categories Policies
-- Allow all users to view categories
CREATE POLICY "Allow all users to view categories" ON categories
FOR SELECT USING (true);
-- Allow only admin to add, update, delete categories
CREATE POLICY "Allow only admin to modify categories" ON categories
FOR ALL USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin');

-- Tags Policies
-- Allow all users to view tags
CREATE POLICY "Allow all users to view tags" ON tags
FOR SELECT USING (true);
-- Allow only admin to add, update, delete tags
CREATE POLICY "Allow only admin to modify tags" ON tags
FOR ALL USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin');

-- Courses Policies
-- Allow all users to view courses
CREATE POLICY "Allow all users to view courses" ON courses
FOR SELECT USING (true);
-- Allow only admin or creator to add, update, delete courses
CREATE POLICY "Allow admin or creator to modify courses" ON courses
FOR ALL USING (auth.role() = 'admin' OR auth.uid() = creator_id) WITH CHECK (auth.role() = 'admin' OR auth.uid() = creator_id);

-- Users Policies
-- Allow all users to view users
CREATE POLICY "Allow all users to view users" ON users
FOR SELECT USING (true);

-- Resources Policies
-- Allow all users to view resources
CREATE POLICY "Allow all users to view resources" ON resources
FOR SELECT USING (true);

-- Reviews Policies
-- Allow all users to view reviews
CREATE POLICY "Allow all users to view reviews" ON reviews
FOR SELECT USING (true);
-- Allow authenticated users to create reviews only for courses they have purchased
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
CREATE POLICY "Allow users to update their own reviews" ON reviews
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Allow users to delete their own reviews
CREATE POLICY "Allow users to delete their own reviews" ON reviews
FOR DELETE USING (auth.uid() = user_id);
