"use client";

import { useTheme } from "@mui/material/styles";
import { useSupabase } from "@/contexts/supabase-context";
import { HashLoader } from "react-spinners";
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
import CourseProgressCard from "@/components/courses/course-progress-card";
import { trpc } from "@/lib/trpc/client";

const Home = () => {
  const { user, loading } = useSupabase();
  const theme = useTheme();

  const { data: purchasedCourses, isLoading: coursesLoading } =
    trpc.courses.getPurchasedCourses.useQuery(
      { page: 1, pageSize: 3 },
      {
        enabled: !!user,
        retry: false,
      }
    );

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
            {!purchasedCourses || purchasedCourses.data.length === 0 ? (
              <EmptyState>
                <EmptyStateTitle>No Courses Yet</EmptyStateTitle>
                <EmptyStateText>
                  You haven&apos;t purchased any courses. Browse our catalog to
                  get started!
                </EmptyStateText>
              </EmptyState>
            ) : (
              <CourseGrid>
                {purchasedCourses.data.map((course) => (
                  <CourseProgressCard key={course.id} course={course} />
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
