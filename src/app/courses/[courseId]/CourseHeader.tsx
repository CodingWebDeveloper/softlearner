import React from 'react';
import { Typography, Avatar, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { InstructorBox, HeaderContainer, CourseTitle, InstructorName, InstructorRole } from './courseDetails.styled';

interface Instructor {
  name: string;
  role: string;
  avatar: string;
}

interface CourseHeaderProps {
  title: string;
  instructor: Instructor;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ title, instructor }) => {
  const theme = useTheme();
  
  return (
    <HeaderContainer>
      <CourseTitle variant="h3" fontWeight={700} gutterBottom tabIndex={0} aria-label="Course Title">
        {title}
      </CourseTitle>
      <InstructorBox>
        <Avatar src={instructor.avatar} alt={instructor.name} sx={{ width: 56, height: 56 }} />
        <Box>
          <InstructorName variant="h6" fontWeight={600} tabIndex={0} aria-label="Instructor Name">
            {instructor.name}
          </InstructorName>
          <InstructorRole variant="body2" tabIndex={0} aria-label="Instructor Role">
            {instructor.role}
          </InstructorRole>
        </Box>
      </InstructorBox>
    </HeaderContainer>
  );
};

export default CourseHeader; 