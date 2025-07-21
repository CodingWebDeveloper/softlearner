export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "created_at" | "updated_at">;
        Update: Partial<Omit<User, "id" | "created_at" | "updated_at">>;
      };
      courses: {
        Row: Course;
        Insert: Omit<Course, "created_at" | "updated_at">;
        Update: Partial<Omit<Course, "id" | "created_at" | "updated_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "created_at" | "updated_at">;
        Update: Partial<Omit<Order, "id" | "created_at" | "updated_at">>;
      };
      resources: {
        Row: Resource;
        Insert: Omit<Resource, "created_at" | "updated_at">;
        Update: Partial<Omit<Resource, "id" | "created_at" | "updated_at">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "created_at" | "updated_at">;
        Update: Partial<Omit<Review, "id" | "created_at" | "updated_at">>;
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, "created_at" | "updated_at">;
        Update: Partial<Omit<Vote, "id" | "created_at" | "updated_at">>;
      };
      bookmarks: {
        Row: Bookmark;
        Insert: Omit<Bookmark, "created_at" | "updated_at">;
        Update: Partial<Omit<Bookmark, "id" | "created_at" | "updated_at">>;
      };
      tests: {
        Row: Test;
        Insert: Omit<Test, "created_at" | "updated_at">;
        Update: Partial<Omit<Test, "id" | "created_at" | "updated_at">>;
      };
      questions: {
        Row: Question;
        Insert: Omit<Question, "created_at" | "updated_at">;
        Update: Partial<Omit<Question, "id" | "created_at" | "updated_at">>;
      };
      answer_options: {
        Row: AnswerOption;
        Insert: Omit<AnswerOption, "created_at" | "updated_at">;
        Update: Partial<Omit<AnswerOption, "id" | "created_at" | "updated_at">>;
      };
      user_tests: {
        Row: UserTest;
        Insert: Omit<UserTest, "created_at" | "updated_at">;
        Update: Partial<Omit<UserTest, "id" | "created_at" | "updated_at">>;
      };
      user_answers: {
        Row: UserAnswer;
        Insert: Omit<UserAnswer, "created_at" | "updated_at">;
        Update: Partial<Omit<UserAnswer, "id" | "created_at" | "updated_at">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id">;
        Update: Partial<Omit<Category, "id">>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, "id">;
        Update: Partial<Omit<Tag, "id">>;
      };
      course_tags: {
        Row: {
          course_id: string;
          tag_id: string;
        };
        Insert: {
          course_id: string;
          tag_id: string;
        };
        Update: {
          course_id?: string;
          tag_id?: string;
        };
      };
      user_resources: {
        Row: UserResource;
        Insert: UserResource;
        Update: Partial<UserResource>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Type definitions based on database.txt schema

// Category interface
export interface Category {
  id: string;
  name: string;
}

// Tag interface
export interface Tag {
  id: string;
  name: string;
}

// UserResource interface
export interface UserResource {
  user_id: string;
  resource_id: string;
  completed: boolean;
}

// Update User interface
export interface User {
  id: string;
  full_name?: string;
  avatar_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Update Course interface
export interface Course {
  id: string;
  name: string;
  description?: string;
  video_url?: string;
  price: number;
  new_price?: number;
  thumbnail_image_url?: string;
  creator_id: string;
  category: string;
  currency: string;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

// Order interface
export interface Order {
  id: string;
  user_id: string;
  course_id: string;
  total_amount: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED";
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

// Resource interface
export interface Resource {
  id: string;
  url: string;
  name: string;
  short_summary?: string;
  type?: "video" | "downloadable file";
  course_id: string;
  order_index?: number;
  duration?: string;
  created_at: string;
  updated_at: string;
}

// Review interface
export interface Review {
  id: string;
  content: string;
  user_id: string;
  course_id: string;
  created_at: string;
  updated_at: string;
}

// Vote interface
export interface Vote {
  id: string;
  user_id: string;
  review_id: string;
  vote_type: "Up" | "Down";
  created_at: string;
  updated_at: string;
}

// Bookmark interface
export interface Bookmark {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
  updated_at: string;
}

// Test interface
export interface Test {
  id: string;
  title: string;
  description?: string;
  course_id: string;
  created_at: string;
  updated_at: string;
}

// Question interface
export interface Question {
  id: string;
  text: string;
  type: "single" | "multiple";
  points: number;
  test_id: string;
  created_at: string;
  updated_at: string;
}

// AnswerOption interface
export interface AnswerOption {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
}

// UserTest interface
export interface UserTest {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  created_at: string;
  updated_at: string;
}

// UserAnswer interface
export interface UserAnswer {
  id: string;
  user_test_id: string;
  question_id: string;
  answer_option_id: string;
  created_at: string;
  updated_at: string;
}

// Extended interfaces for related data
export interface CourseWithCreator extends Course {
  creator?: User;
}

export interface ReviewWithUser extends Review {
  user?: User;
}

export interface QuestionWithOptions extends Question {
  answer_options?: AnswerOption[];
}

export interface TestWithQuestions extends Test {
  questions?: QuestionWithOptions[];
}

export interface UserTestWithDetails extends UserTest {
  test?: Test;
  user_answers?: UserAnswer[];
}

// Course progress interface for dashboard
export interface CourseProgress {
  course: Course;
  total_resources: number;
  completed_resources: number;
  progress_percentage: number;
  last_accessed: string;
  status: "not_started" | "in_progress" | "completed";
  next_resource?: Resource;
}

export type PreviewResource = {
  id: string;
  name: string;
  short_summary?: string;
  type?: "video" | "downloadable file";
  course_id: string;
  order_index?: number;
  duration?: string;
  created_at: string;
  updated_at: string;
};
