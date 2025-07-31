"use client";

import { Typography, Grid, Container } from "@mui/material";
import {
  PageContainer,
  PageTitle,
} from "@/components/styles/infrastructure/layout.styles";
import { trpc } from "@/lib/trpc/client";
import LoadingFallback, { EmptyState } from "@/components/loading-fallback";
import CourseProgressCard from "@/components/courses/course-progress/course-progress-card";

const MyCoursesPage = () => {
  const {
    data: purchasedCourses,
    isLoading,
    error,
  } = trpc.courses.getPurchasedCourses.useQuery(
    { page: 1, pageSize: 15 },
    {
      retry: false,
    }
  );

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <PageContainer>
        <Typography variant="h5" color="error">
          Error loading courses: {error.message}
        </Typography>
      </PageContainer>
    );
  }

  if (!purchasedCourses || purchasedCourses.data.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          type="courses"
          title="Your Learning Journey Awaits"
          description="Start your educational adventure by exploring our curated collection of courses. From programming to design, we have something for every learner."
          buttonText="Explore Courses"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <PageTitle variant="h4" color="textPrimary" gutterBottom>
          My Courses
        </PageTitle>
        <Grid container spacing={3}>
          {purchasedCourses.data.map((course) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
              <CourseProgressCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default MyCoursesPage;
