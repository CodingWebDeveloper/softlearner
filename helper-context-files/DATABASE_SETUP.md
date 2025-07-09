# Database Setup Guide for SoftLearner

This guide explains how to set up the complete database schema for the SoftLearner educational platform using Supabase.

## Overview

The database schema is based on the specifications in `database.txt` and includes all the necessary tables for a comprehensive educational platform:

- **User Management**: Users, profiles, and authentication
- **Course Management**: Courses, resources, and content
- **Order System**: Purchase tracking and course access
- **Review System**: User reviews and voting
- **Bookmarking**: User course bookmarks
- **Testing System**: Tests, questions, answers, and user attempts

## Database Schema

### Core Tables

1. **users** - User profiles extending Supabase auth
2. **courses** - Course information and metadata
3. **orders** - Course purchase records
4. **resources** - Course materials and files
5. **reviews** - User course reviews
6. **votes** - Review voting system
7. **bookmarks** - User course bookmarks
8. **tests** - Course assessments
9. **questions** - Test questions
10. **answer_options** - Question answer choices
11. **user_tests** - User test attempts
12. **user_answers** - Individual question responses

## Setup Instructions

### 1. Supabase Project Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Schema Setup

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the entire content of `database-setup.sql`
4. Run the SQL script

This will create:
- All necessary tables with proper relationships
- Row Level Security (RLS) policies
- Database indexes for performance
- Automatic timestamp triggers
- Sample data for testing

### 3. Storage Buckets Setup

Create the following storage buckets in Supabase:

```sql
-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('course-thumbnails', 'course-thumbnails', true),
  ('course-resources', 'course-resources', true);
```

### 4. Environment Configuration

Ensure your environment variables are properly configured:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Functions

The `src/lib/database.ts` file provides comprehensive TypeScript functions for all database operations:

### User Management
- `getUser(userId)` - Get user profile
- `createUser(userId, fullName)` - Create new user profile
- `updateUser(userId, updates)` - Update user profile

### Course Management
- `getCourses()` - Get all courses
- `getCourse(courseId)` - Get specific course
- `createCourse(course)` - Create new course
- `updateCourse(courseId, updates)` - Update course
- `deleteCourse(courseId)` - Delete course

### Order Management
- `getUserOrders(userId)` - Get user's orders
- `createOrder(order)` - Create new order
- `updateOrderStatus(orderId, status)` - Update order status

### Resource Management
- `getCourseResources(courseId)` - Get course resources
- `createResource(resource)` - Add resource to course
- `deleteResource(resourceId)` - Remove resource

### Review System
- `getCourseReviews(courseId)` - Get course reviews
- `createReview(review)` - Create review
- `updateReview(reviewId, content)` - Update review
- `deleteReview(reviewId)` - Delete review

### Voting System
- `getReviewVotes(reviewId)` - Get review votes
- `createVote(vote)` - Create/update vote
- `deleteVote(voteId)` - Remove vote

### Bookmarking
- `getUserBookmarks(userId)` - Get user bookmarks
- `createBookmark(bookmark)` - Add bookmark
- `deleteBookmark(bookmarkId)` - Remove bookmark
- `isBookmarked(userId, courseId)` - Check if bookmarked

### Testing System
- `getCourseTests(courseId)` - Get course tests
- `getTest(testId)` - Get test with questions
- `createTest(test)` - Create new test
- `createQuestion(question)` - Add question to test
- `createAnswerOption(answerOption)` - Add answer option

### User Testing
- `getUserTests(userId)` - Get user's test attempts
- `createUserTest(userTest)` - Start test attempt
- `updateUserTestScore(userTestId, score)` - Update test score
- `createUserAnswer(userAnswer)` - Submit answer
- `getUserTestAnswers(userTestId)` - Get test answers
- `calculateTestScore(userTestId)` - Calculate test score

### Utility Functions
- `getUserPurchasedCourses(userId)` - Get user's purchased courses
- `uploadFile(file, bucket)` - Upload file to storage

## Row Level Security (RLS)

The database includes comprehensive RLS policies to ensure data security:

- **Users**: Can only access their own profile
- **Courses**: Public read access, creators can modify
- **Orders**: Users can only access their own orders
- **Reviews**: Public read access, users can manage their own
- **Votes**: Public read access, users can manage their own
- **Bookmarks**: Users can only access their own bookmarks
- **Tests**: Public read access, course creators can manage
- **User Tests**: Users can only access their own attempts

## Sample Data

The setup script includes sample data for testing:

- 3 sample courses (React, TypeScript, Next.js)
- Sample resources for each course
- Sample tests with questions and answer options

## Usage Examples

### Creating a Course
```typescript
import { createCourse } from '@/lib/database'

const newCourse = await createCourse({
  name: 'Advanced React Patterns',
  description: 'Learn advanced React patterns and best practices',
  price: 89.99,
  video_url: 'https://example.com/course-video',
  thumbnail_image_url: 'https://example.com/thumbnail.jpg',
  creator_id: userId
})
```

### Getting User's Purchased Courses
```typescript
import { getUserPurchasedCourses } from '@/lib/database'

const purchasedCourses = await getUserPurchasedCourses(userId)
```

### Creating a Test with Questions
```typescript
import { createTest, createQuestion, createAnswerOption } from '@/lib/database'

// Create test
const test = await createTest({
  title: 'React Fundamentals Quiz',
  description: 'Test your React knowledge',
  course_id: courseId
})

// Create question
const question = await createQuestion({
  text: 'What is a React component?',
  type: 'single',
  points: 5,
  test_id: test.id
})

// Create answer options
await createAnswerOption({
  question_id: question.id,
  text: 'A reusable piece of UI',
  is_correct: true
})
```

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Ensure you're authenticated and have proper permissions
2. **Foreign Key Errors**: Check that referenced records exist
3. **Storage Upload Errors**: Verify bucket permissions and file size limits

### Debugging

Enable Supabase logging in your project settings to debug database operations:

```typescript
// Enable debug logging
const supabase = createClient()
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session)
})
```

## Performance Considerations

- Database indexes are created for frequently queried columns
- Use pagination for large result sets
- Consider caching frequently accessed data
- Monitor query performance in Supabase dashboard

## Security Best Practices

- Always use RLS policies
- Validate input data before database operations
- Use parameterized queries (handled by Supabase client)
- Regularly review and update security policies
- Monitor database access logs

## Next Steps

After setting up the database:

1. Test all CRUD operations
2. Implement authentication flow
3. Create UI components for data management
4. Add error handling and loading states
5. Implement real-time features if needed

For more information, refer to the [Supabase documentation](https://supabase.com/docs). 