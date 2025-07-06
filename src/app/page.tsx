"use client";

import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import { useTheme } from "@mui/material/styles";

import { useSupabase } from "@/contexts/SupabaseContext";

import {
  LoadingContainer,
  ContentContainer,
  DashboardContainer,
  DashboardHeader,
  DashboardTitle,
  DashboardSubtitle,
  DashboardContent,
  CourseGrid,
  CourseCard,
  CourseCardContent,
  CourseHeader,
  CourseTitle,
  CourseInstructor,
  CourseDescription,
  ProgressSection,
  ProgressHeader,
  ProgressText,
  ProgressPercentage,
  StyledProgressBar,
  CourseFooter,
  LastAccessed,
  ContinueButton,
  StatusChip,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
} from "@/components/styled/HomePage.styled";
import {
  getUserCoursesWithProgress,
} from "@/services/courseService";
import type { Course, Resource } from "@/lib/database";
import { formatDate } from "@/utils/dateUtils";

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

const Home = () => {
  const { user, loading } = useSupabase();
  const [courses, setCourses] = useState<CustomCourseProgress[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchCourses = async () => {
      if (user) {
        setCoursesLoading(true);
        // Get user courses with progress from database
        try {
          const userCourses = await getUserCoursesWithProgress(user.id);
          setCourses(userCourses as CustomCourseProgress[]);
        } catch (error) {
          console.error("Error fetching courses:", error);
          setCourses([]);
        } finally {
          setCoursesLoading(false);
        }
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
                    <CourseCard
                      key={course.course.id}
                      tabIndex={0}
                      aria-label={`Course: ${course.course.title}`}
                    >
                      <CourseCardContent>
                        <CourseHeader>
                          <div>
                            <CourseTitle variant="h3" component="h2">
                              {course.course.title}
                            </CourseTitle>
                            <CourseInstructor>
                              {course.course.instructor_name}
                            </CourseInstructor>
                          </div>
                          <StatusChip
                            label={
                              course.status === "completed"
                                ? "Completed"
                                : course.status === "in_progress"
                                ? "In Progress"
                                : "Not Started"
                            }
                            color={
                              course.status === "completed"
                                ? "success"
                                : course.status === "in_progress"
                                ? "warning"
                                : "default"
                            }
                            aria-label={`Status: ${course.status}`}
                          />
                        </CourseHeader>
                        <CourseDescription>
                          {course.course.description}
                        </CourseDescription>
                        <ProgressSection>
                          <ProgressHeader>
                            <ProgressText>
                              {course.completed_resources} of{" "}
                              {course.total_resources} resources completed
                            </ProgressText>
                            <ProgressPercentage>
                              {Math.round(course.progress_percentage)}%
                            </ProgressPercentage>
                          </ProgressHeader>
                          <StyledProgressBar
                            variant="determinate"
                            value={course.progress_percentage}
                            aria-label="Course progress"
                          />
                        </ProgressSection>
                        <CourseFooter>
                          <LastAccessed>
                            Last accessed: {formatDate(course.last_accessed)}
                          </LastAccessed>
                          {course.status !== "completed" &&
                            course.next_resource && (
                              <ContinueButton
                                variant="contained"
                                href={`#/courses/${course.course.id}/resources/${course.next_resource.id}`}
                                aria-label={`Continue course: ${course.course.title}`}
                              >
                                Continue
                              </ContinueButton>
                            )}
                        </CourseFooter>
                      </CourseCardContent>
                    </CourseCard>
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
