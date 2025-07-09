import React, { Fragment } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CourseCard from './courses-card';
import { CoursesListContainer, CourseListItemBox, NoCoursesMessage } from '@/components/styles/courses/courses.styles';

interface CoursesListProps {
  filteredCourses: any[];
  isMobile: boolean;
  handleBookmark: (id: number) => void;
  handleBookmarkKeyDown: (e: React.KeyboardEvent, id: number) => void;
  MAX_ENROLLED_DISPLAY: number;
}

const CoursesList = ({ filteredCourses, isMobile, handleBookmark, handleBookmarkKeyDown, MAX_ENROLLED_DISPLAY }: CoursesListProps) => {
  const theme = useTheme();
  
  return (
    <CoursesListContainer>
      {filteredCourses.length === 0 ? (
        <NoCoursesMessage variant="body1" color={theme.palette.custom.text.white}>
          No courses found.
        </NoCoursesMessage>
      ) : (
        <Stack spacing={2}>
          {filteredCourses.map((course) => (
            <CourseListItemBox key={course.id}>
              <CourseCard
                course={course}
                isMobile={isMobile}
                handleBookmark={handleBookmark}
                handleBookmarkKeyDown={handleBookmarkKeyDown}
                MAX_ENROLLED_DISPLAY={MAX_ENROLLED_DISPLAY}
              />
            </CourseListItemBox>
          ))}
        </Stack>
      )}
    </CoursesListContainer>
  );
};

export default CoursesList; 