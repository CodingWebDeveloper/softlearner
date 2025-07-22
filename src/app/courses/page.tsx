"use client";
import { useEffect, useState, ChangeEvent } from "react";
import CoursesList from "@/components/courses/courses-list/courses-list";
import {
  CoursesPageContainer,
  SearchTextField,
} from "@/components/styles/courses/courses.styles";
import Filter from "@/components/courses/courses-list/filter";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setSearch } from "@/lib/store/features/filterSlice";
import TagsList from "@/components/courses/courses-list/tags-list";

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

const CoursesPage = () => {
  // General Hooks
  const dispatch = useAppDispatch();

  // Redux filter state
  const { search } = useAppSelector((state) => state.filter);

  // States
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
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
      <Filter />
      <TagsList />
      {/* Courses List */}
      <CoursesList />
    </CoursesPageContainer>
  );
};

export default CoursesPage;
