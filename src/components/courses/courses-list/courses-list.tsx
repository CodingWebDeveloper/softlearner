import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import CourseCard from "./course-card";
import {
  CoursesListContainer,
  CourseGridItem,
  AlertStyled,
  CoursesPageContainer,
  TextLightText,
} from "@/components/styles/courses/courses.styles";
import { COURSES_PER_PAGE } from "@/utils/constants";
import { useAppSelector } from "@/lib/store/hooks";
import {
  selectSearch,
  selectCategoryId,
  selectTags,
} from "@/lib/store/features/filterSlice";
import { trpc } from "@/lib/trpc/client";
import CourseListPagination from "./course-list-pagination";

const CoursesList = () => {
  // General hooks
  const router = useRouter();

  // Selectors
  const search = useAppSelector(selectSearch);
  const categoryId = useAppSelector(selectCategoryId);
  const tags = useAppSelector(selectTags);

  // States
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: coursesData,
    isLoading,
    error,
  } = trpc.courses.getCourses.useQuery({
    page: currentPage,
    pageSize: COURSES_PER_PAGE,
    search: search || undefined,
    categoryId: categoryId || undefined,
    tags: tags.length > 0 ? tags.map((tag) => tag.id) : undefined,
  });

  // Pagination
  const courses = coursesData?.data || [];
  const totalRecord = coursesData?.totalRecords || 0;
  const totalPages = Math.ceil(totalRecord / COURSES_PER_PAGE);

  // Handlers
  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleNavigate = (courseId: string) => {
    router.push(`/courses/${courseId}?previousPage=courses`);
  };

  if (isLoading) {
    return (
      <CoursesPageContainer>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress color="primary" />
        </Box>
      </CoursesPageContainer>
    );
  }

  if (error) {
    return (
      <CoursesPageContainer>
        <AlertStyled severity="error">
          <Typography variant="body1">
            Failed to load courses. Please try again later.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message}
          </Typography>
        </AlertStyled>
      </CoursesPageContainer>
    );
  }

  if (courses.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <TextLightText variant="h6">
          No courses found. Try adjusting your search or filters.
        </TextLightText>
      </Box>
    );
  }

  return (
    <CoursesListContainer>
      <Grid container spacing={2}>
        {courses.map((course) => (
          <CourseGridItem size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
            <CourseCard
              course={course}
              handleNavigate={() => handleNavigate(course.id)}
            />
          </CourseGridItem>
        ))}
      </Grid>
      <CourseListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
    </CoursesListContainer>
  );
};

export default CoursesList;
