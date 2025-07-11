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

-- Sections Policies
-- Allow all users to view sections
CREATE POLICY "Allow all users to view sections" ON sections
FOR SELECT USING (true);
