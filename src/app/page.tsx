"use client";

import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import { useTheme } from "@mui/material/styles";
import { useSupabase } from "@/contexts/supabase-context";

import {
  LoadingContainer,
  ContentContainer,
  DashboardContainer,
  DashboardHeader,
  DashboardTitle,
  DashboardSubtitle,
  DashboardContent,
  CourseGrid,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
} from "@/components/styles/home-page/home-page.styles";
import {
  getUserCoursesWithProgress,
} from "@/services/courseService";
import type { Course, Resource } from "@/lib/database/database.types";
import CourseProgressCard from "@/components/courses/course-progress-card";


// Extended course interface for the transformed data
interface ExtendedCourse extends Course {
  title: string;
  instructor_name: string;
  total_resources: number;
}

// Custom course progress interface
interface CustomCourseProgress {
  course: ExtendedCourse;
  total_resources: number;
  completed_resources: number;
  progress_percentage: number;
  last_accessed: string;
  status: 'not_started' | 'in_progress' | 'completed';
  next_resource?: Resource;
}

// MOCK DATA FOR COURSES
const MOCK_COURSES: CustomCourseProgress[] = [
  {
    course: {
      id: "1",
      name: "react-fundamentals",
      title: "React Fundamentals",
      instructor_name: "Jane Doe",
      description: "Learn the basics of React, including components, hooks, and state management.",
      total_resources: 10,
      price: 49.99,
      created_at: new Date(Date.now() - 100000000).toISOString(),
      updated_at: new Date(Date.now() - 50000000).toISOString(),
    } as ExtendedCourse,
    total_resources: 10,
    completed_resources: 3,
    progress_percentage: 30,
    last_accessed: new Date().toISOString(),
    status: "in_progress",
    next_resource: {
      id: "101",
      url: "https://example.com/resource/101",
      name: "React useState Hook",
      course_id: "1",
      created_at: new Date(Date.now() - 90000000).toISOString(),
      updated_at: new Date(Date.now() - 80000000).toISOString(),
    },
  },
  {
    course: {
      id: "2",
      name: "advanced-typescript",
      title: "Advanced TypeScript",
      instructor_name: "John Smith",
      description: "Master advanced TypeScript features and patterns.",
      total_resources: 8,
      price: 59.99,
      created_at: new Date(Date.now() - 200000000).toISOString(),
      updated_at: new Date(Date.now() - 100000000).toISOString(),
    } as ExtendedCourse,
    total_resources: 8,
    completed_resources: 8,
    progress_percentage: 100,
    last_accessed: new Date(Date.now() - 86400000).toISOString(),
    status: "completed",
    next_resource: undefined,
  },
  {
    course: {
      id: "3",
      name: "ui-ux-design-principles",
      title: "UI/UX Design Principles",
      instructor_name: "Emily Clark",
      description: "Understand the fundamentals of UI/UX design for web applications.",
      total_resources: 5,
      price: 39.99,
      created_at: new Date(Date.now() - 300000000).toISOString(),
      updated_at: new Date(Date.now() - 200000000).toISOString(),
    } as ExtendedCourse,
    total_resources: 5,
    completed_resources: 0,
    progress_percentage: 0,
    last_accessed: new Date(Date.now() - 172800000).toISOString(),
    status: "not_started",
    next_resource: {
      id: "201",
      url: "https://example.com/resource/201",
      name: "Introduction to UI/UX",
      course_id: "3",
      created_at: new Date(Date.now() - 290000000).toISOString(),
      updated_at: new Date(Date.now() - 280000000).toISOString(),
    },
  },
];

const Home = () => {
  const { user, loading } = useSupabase();
  const [courses, setCourses] = useState<CustomCourseProgress[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchCourses = async () => {
      if (user) {
        setCoursesLoading(true);
        // Use mock data for now
        setCourses(MOCK_COURSES);
        setCoursesLoading(false);
        // Uncomment below to use real data later
        // try {
        //   const userCourses = await getUserCoursesWithProgress(user.id);
        //   setCourses(userCourses as CustomCourseProgress[]);
        // } catch (error) {
        //   console.error("Error fetching courses:", error);
        //   setCourses([]);
        // } finally {
        //   setCoursesLoading(false);
        // }
      }
    };

    fetchCourses();
  }, [user]);

  // Show loading spinner while loading
  if (loading || coursesLoading) {
    return (
      <LoadingContainer>
        <HashLoader color={theme.palette.custom.accent.teal} size={50} />
      </LoadingContainer>
    );
  }

  return (
      <ContentContainer maxWidth="xl">
        {user && (
          <DashboardContainer>
            <DashboardHeader>
              <DashboardTitle>My Courses</DashboardTitle>
              <DashboardSubtitle>
                Track your progress and continue learning
              </DashboardSubtitle>
            </DashboardHeader>
            <DashboardContent>
              {courses.length === 0 ? (
                <EmptyState>
                  <EmptyStateTitle>No Courses Yet</EmptyStateTitle>
                  <EmptyStateText>
                    You haven&apos;t purchased any courses. Browse our catalog
                    to get started!
                  </EmptyStateText>
                </EmptyState>
              ) : (
                <CourseGrid>
                  {courses.map((course) => (
                    <CourseProgressCard key={course.course.id} course={course} />
                  ))}
                </CourseGrid>
              )}
            </DashboardContent>
          </DashboardContainer>
        )}
      </ContentContainer>
  );
};

export default Home;
