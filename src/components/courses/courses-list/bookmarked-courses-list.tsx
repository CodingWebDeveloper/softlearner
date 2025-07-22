"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Alert } from "@mui/material";
import CourseCard from "./course-card";
import CourseListPagination from "./course-list-pagination";
import LoadingFallback from "@/components/loading-fallback";
import {
  StyledContainer,
  CoursesGrid,
} from "@/components/styles/courses/book-marked.styles";
import { PageTitle } from "@/components/styles/infrastructure/layout.styles";
import { COURSES_PER_PAGE } from "@/utils/constants";

const BookmarkedCoursesList = () => {
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
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleNavigate = (courseId: string) => {
    router.push(`/courses/${courseId}?previousPage=bookmarks`);
  };

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
      <StyledContainer>
        <PageTitle variant="h4" gutterBottom>
          My Bookmarks
        </PageTitle>

        <Alert severity="info">
          You haven&apos;t bookmarked any courses yet.
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
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
    </StyledContainer>
  );
};

export default BookmarkedCoursesList;
