"use client";
import CourseCard from "@/components/courses/courses-list/course-card";
import CourseListPagination from "@/components/courses/courses-list/course-list-pagination";
import LoadingFallback, { EmptyState } from "@/components/loading-fallback";
import {
  CoursesGrid,
  StyledContainer,
} from "@/components/styles/courses/book-marked.styles";
import {
  PageContainer,
  PageTitle,
} from "@/components/styles/infrastructure/layout.styles";
import { trpc } from "@/lib/trpc/client";
import { COURSES_PER_PAGE } from "@/utils/constants";
import { Alert, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BookmarksPage() {
  // General hooks
  const router = useRouter();

  // States
  const [page, setPage] = useState(1);

  // Queries
  const {
    data: coursesData,
    isLoading,
    error,
  } = trpc.courses.getBookmarkedCourses.useQuery({
    page,
    pageSize: COURSES_PER_PAGE,
  });

  // Handlers
  const handleNavigate = (courseId: string) => {
    router.push(`/courses/${courseId}?previousPage=bookmarks`);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Render
  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <StyledContainer>
        <Alert severity="error">
          Error loading bookmarked courses: {error.message}
        </Alert>
      </StyledContainer>
    );
  }

  if (!coursesData || coursesData.data.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          type="bookmarks"
          title="Your Reading List is Empty"
          description="Start building your personal learning library by bookmarking courses that interest you. Your bookmarks will be saved here for easy access."
          buttonText="Discover Courses"
        />
      </PageContainer>
    );
  }

  // Render
  return (
    <PageContainer>
      <Container maxWidth="lg">
        <PageTitle variant="h4" gutterBottom>
          My Bookmarks
        </PageTitle>

        <CoursesGrid>
          {coursesData.data.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              handleNavigate={() => handleNavigate(course.id)}
            />
          ))}
        </CoursesGrid>

        <CourseListPagination
          currentPage={page}
          totalPages={Math.ceil(coursesData.totalRecords / COURSES_PER_PAGE)}
          onChange={handlePageChange}
        />
      </Container>
    </PageContainer>
  );
}
