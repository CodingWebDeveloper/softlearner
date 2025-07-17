'use client';
import { useEffect, useState, ChangeEvent, KeyboardEvent } from 'react';
import {
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CoursesList from '@/components/courses/courses-list/courses-list';
import { CoursesPageContainer, SearchTextField } from '@/components/styles/courses/courses.styles';
import Filter from '@/components/courses/courses-list/filter';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setSearch } from '@/lib/store/features/filterSlice';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const MAX_ENROLLED_DISPLAY = 999;

const CoursesPage = () => {
  // General Hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();

  // Redux filter state
  const { search } = useAppSelector((state) => state.filter);

  // States
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // Handlers
  const handleBookmark = (id: string) => {
    // TODO: Implement bookmark functionality with tRPC mutation
    console.log('Bookmark course:', id);
  };


  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Accessibility: handle Enter/Space for bookmark
  const handleBookmarkKeyDown = (e: KeyboardEvent, id: string) => {
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
        value={searchInput}
        onChange={handleSearchChange}
        aria-label="Search courses"
      />
      {/* Filters */}
      <Filter isMobile={isMobile} />
      {/* Courses List */}
      <CoursesList
        handleBookmark={handleBookmark}
        handleBookmarkKeyDown={handleBookmarkKeyDown}
        MAX_ENROLLED_DISPLAY={MAX_ENROLLED_DISPLAY}
      />
    </CoursesPageContainer>
  );
};

export default CoursesPage; 