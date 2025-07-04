'use client';
import React, { useState, useMemo } from 'react';
import {
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useFormik } from 'formik';
import {
  CoursesPageContainer,
  SearchTextField,
} from './courses.styled';
import Filter from './Filter';
import CoursesList from './CoursesList';
import Pagination from './Pagination';

const MAX_ENROLLED_DISPLAY = 999;
const COURSES_PER_PAGE = 15;

// Mock data
const mockCourses = [
  {
    id: 1,
    image: '/globe.svg',
    title: 'Strategy, Design, Development',
    description: 'Learn how to apply User Experience (UX) principles to your website designs...',
    creator: 'Lina Blacksmith',
    tags: ['UX Design', 'UI Design', 'Web Design'],
    category: 'Design',
    price: 49,
    rating: 4.0,
    ratingsCount: 3500,
    isBookmarked: false,
    enrolled: 1200,
  },
  {
    id: 2,
    image: '/next.svg',
    title: 'Web Design: from Figma to Webflow',
    description: 'Learn to design websites with Figma, build with webflow and make a living freelancing.',
    creator: 'Lina Blacksmith',
    tags: ['UX Design', 'UI Design'],
    category: 'Design',
    price: 59,
    rating: 4.0,
    ratingsCount: 3500,
    isBookmarked: false,
    enrolled: 850,
  },
  {
    id: 3,
    image: '/window.svg',
    title: 'Landing Page Design & conversion Rate',
    description: 'Triple your conversion rate with these laning page design prinsiples and build a landing page',
    creator: 'Lina Blacksmith',
    tags: ['UX Design', 'UI Design', 'Web Design'],
    category: 'Marketing',
    price: 39,
    rating: 4.0,
    ratingsCount: 3500,
    isBookmarked: false,
    enrolled: 2100,
  },
];

const allCategories = ['Design', 'Marketing', 'Development'];
const allTags = ['UX Design', 'UI Design', 'Web Design'];
const priceRange = [0, 100];

const CoursesPage = () => {
  const [courses, setCourses] = useState(mockCourses);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formik = useFormik({
    initialValues: {
      category: '',
      tags: [] as string[],
      price: priceRange,
    },
    onSubmit: () => {},
  });

  // Filtering logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search
      if (
        search &&
        !course.title.toLowerCase().includes(search.toLowerCase()) &&
        !course.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      // Category
      if (formik.values.category && course.category !== formik.values.category) {
        return false;
      }
      // Tags
      if (
        formik.values.tags.length > 0 &&
        !formik.values.tags.every((tag) => course.tags.includes(tag))
      ) {
        return false;
      }
      // Price
      if (
        course.price < formik.values.price[0] ||
        course.price > formik.values.price[1]
      ) {
        return false;
      }
      return true;
    });
  }, [courses, search, formik.values]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * COURSES_PER_PAGE,
    currentPage * COURSES_PER_PAGE
  );

  // Reset to page 1 on filter/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, formik.values.category, formik.values.tags]);

  // Handlers
  const handleBookmark = (id: number) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c
      )
    );
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Accessibility: handle Enter/Space for bookmark
  const handleBookmarkKeyDown = (e: React.KeyboardEvent, id: number) => {
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
      <CoursesList
        filteredCourses={paginatedCourses}
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
    </CoursesPageContainer>
  );
};

export default CoursesPage; 