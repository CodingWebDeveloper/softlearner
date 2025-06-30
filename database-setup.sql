-- Database setup for Educational Dashboard
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  instructor_name TEXT NOT NULL,
  total_resources INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('video', 'document', 'quiz', 'assignment')),
  duration INTEGER, -- in minutes
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_courses table (purchases/enrollments)
CREATE TABLE IF NOT EXISTS user_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read access)
CREATE POLICY "Courses are viewable by everyone" ON courses
  FOR SELECT USING (true);

-- RLS Policies for resources (public read access)
CREATE POLICY "Resources are viewable by everyone" ON resources
  FOR SELECT USING (true);

-- RLS Policies for user_courses
CREATE POLICY "Users can view their own course enrollments" ON user_courses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON user_courses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_course_id ON user_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_resource_id ON user_progress(resource_id);
CREATE INDEX IF NOT EXISTS idx_resources_course_id ON resources(course_id);
CREATE INDEX IF NOT EXISTS idx_resources_order_index ON resources(order_index);

-- Insert some sample data
INSERT INTO courses (id, title, description, instructor_name, total_resources) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'React Fundamentals', 'Learn the basics of React including components, props, state, and hooks.', 'Sarah Johnson', 12),
  ('550e8400-e29b-41d4-a716-446655440002', 'Advanced TypeScript', 'Master TypeScript with advanced patterns, generics, and type safety.', 'Mike Chen', 15),
  ('550e8400-e29b-41d4-a716-446655440003', 'Next.js App Router', 'Build modern web applications with Next.js 13+ App Router and Server Components.', 'Alex Rodriguez', 18)
ON CONFLICT DO NOTHING;

-- Insert sample resources
INSERT INTO resources (course_id, title, type, duration, order_index) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Introduction to React', 'video', 15, 1),
  ('550e8400-e29b-41d4-a716-446655440001', 'Components and Props', 'video', 20, 2),
  ('550e8400-e29b-41d4-a716-446655440001', 'State and Lifecycle', 'video', 25, 3),
  ('550e8400-e29b-41d4-a716-446655440001', 'Hooks Basics', 'video', 30, 4),
  ('550e8400-e29b-41d4-a716-446655440001', 'Custom Hooks', 'video', 25, 5),
  ('550e8400-e29b-41d4-a716-446655440002', 'TypeScript Basics', 'video', 20, 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Advanced Types', 'video', 35, 2),
  ('550e8400-e29b-41d4-a716-446655440003', 'App Router Introduction', 'video', 20, 1),
  ('550e8400-e29b-41d4-a716-446655440003', 'Server Components', 'video', 30, 2),
  ('550e8400-e29b-41d4-a716-446655440003', 'Server Components Deep Dive', 'video', 35, 3)
ON CONFLICT DO NOTHING; 