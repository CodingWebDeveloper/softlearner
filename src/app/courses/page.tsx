'use client';
import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useFormik } from 'formik';
import {
  useMediaQuery,
  useTheme,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import Filter from '@/components/courses/filter';
import CoursesList from '@/components/courses/courses-list';
import Pagination from '@/components/courses/pagination';
import { trpc } from '@/lib/trpc/trpc';
import { AlertStyled, CoursesPageContainer, SearchTextField, TextLightText } from '@/components/styles/courses/courses.styles';

const MAX_ENROLLED_DISPLAY = 999;
const COURSES_PER_PAGE = 15;

const allCategories = ['Design', 'Marketing', 'Development'];
const allTags = ['UX Design', 'UI Design', 'Web Design'];
const priceRange = [0, 100];

const CoursesPage = () => {
  // General Hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // States
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Formik
  const formik = useFormik({
    initialValues: {
      category: '',
      tags: [] as string[],
      price: priceRange,
    },
    onSubmit: () => {},
  });

  // tRPC Query for courses
  const { data: coursesData, isLoading, error } = trpc.course.getCourses.useQuery({
    page: currentPage,
    pageSize: COURSES_PER_PAGE,
    search: search || undefined,
    category: formik.values.category || undefined,
    tags: formik.values.tags.length > 0 ? formik.values.tags : undefined,
  });

  // Data
  const courses = coursesData?.courses || [];
  const totalRecord = coursesData?.totalRecord || 0;

  // Pagination
  const totalPages = Math.ceil(totalRecord / COURSES_PER_PAGE);

  // Loading state
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

  // Error state
  if (error) {  
    return (
      <CoursesPageContainer>
        <AlertStyled severity="error" >
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

  // Handlers
  const handleBookmark = (id: number) => {
    // TODO: Implement bookmark functionality with tRPC mutation
    console.log('Bookmark course:', id);
  };

  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Accessibility: handle Enter/Space for bookmark
  const handleBookmarkKeyDown = (e: KeyboardEvent, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleBookmark(id);
    }
  };

  return (
    <CoursesPageContainer>
      {/* Search */}
      <SearchTextField
        fullWidth
        variant="outlined"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search courses"
      />
      {/* Filters */}
      <Filter formik={formik} allCategories={allCategories} allTags={allTags} isMobile={isMobile} />
      {/* Courses List */}
      {courses.length === 0 ? (
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
      ) : (
        <>
          <CoursesList
            filteredCourses={courses}
            isMobile={isMobile}
            handleBookmark={handleBookmark}
            handleBookmarkKeyDown={handleBookmarkKeyDown}
            MAX_ENROLLED_DISPLAY={MAX_ENROLLED_DISPLAY}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </>
      )}
    </CoursesPageContainer>
  );
};

export default CoursesPage; 