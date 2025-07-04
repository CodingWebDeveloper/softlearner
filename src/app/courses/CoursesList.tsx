import React, { Fragment } from 'react';
import { Stack, Typography } from '@mui/material';
import CourseCard from './CourseCard';
import { CoursesListContainer, CourseListItemBox } from './courses.styled';

interface CoursesListProps {
  filteredCourses: any[];
  isMobile: boolean;
  handleBookmark: (id: number) => void;
  handleBookmarkKeyDown: (e: React.KeyboardEvent, id: number) => void;
  MAX_ENROLLED_DISPLAY: number;
}

const CoursesList = ({ filteredCourses, isMobile, handleBookmark, handleBookmarkKeyDown, MAX_ENROLLED_DISPLAY }: CoursesListProps) => (
  <CoursesListContainer>
    {filteredCourses.length === 0 ? (
      <Typography variant="body1" sx={{ mt: 4, textAlign: 'center', color: '#fff' }}>
        No courses found.
      </Typography>
    ) : (
      <Stack spacing={2} sx={{ width: '100%' }}>
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

export default CoursesList; 