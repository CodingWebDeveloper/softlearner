import { ChangeEvent, KeyboardEvent, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import CourseCard from "./course-card";
import {
  CoursesListContainer,
  CourseGridItem,
  AlertStyled,
  CoursesPageContainer,
  TextLightText,
  StyledPagination,
  PaginationWrapper,
} from "@/components/styles/courses/courses.styles";
import { COURSES_PER_PAGE } from "@/utils/course-list.utils";
import { useAppSelector } from "@/lib/store/hooks";
import {
  selectSearch,
  selectCategoryId,
  selectTags,
} from "@/lib/store/features/filterSlice";
import { trpc } from "@/lib/trpc/client";

interface CoursesListProps {
  handleBookmark: (id: string) => void;
  handleBookmarkKeyDown: (e: KeyboardEvent, id: string) => void;
  MAX_ENROLLED_DISPLAY: number;
}

const CoursesList = ({
  handleBookmark,
  handleBookmarkKeyDown,
  MAX_ENROLLED_DISPLAY,
}: CoursesListProps) => {
  // General Hooks
  const theme = useTheme();

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
              handleBookmark={handleBookmark}
              handleBookmarkKeyDown={handleBookmarkKeyDown}
              MAX_ENROLLED_DISPLAY={MAX_ENROLLED_DISPLAY}
            />
          </CourseGridItem>
        ))}
      </Grid>
      <PaginationWrapper>
        <StyledPagination
          sx={{ color: theme.palette.custom.text.white }}
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </PaginationWrapper>
    </CoursesListContainer>
  );
};

export default CoursesList;
