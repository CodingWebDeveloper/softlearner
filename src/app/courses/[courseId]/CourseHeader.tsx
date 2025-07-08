import React from 'react';
import { Typography, Avatar, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { InstructorBox, HeaderContainer, CourseTitle, InstructorName, InstructorRole, BackIconButton } from './courseDetails.styled';

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
  const router = useRouter();

  const handleBack = React.useCallback(() => {
    router.push('/courses');
  }, [router]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBack();
    }
  };

  return (
    <HeaderContainer>
      <BackIconButton
        onClick={handleBack}
        onKeyDown={handleKeyDown}
        aria-label="Go back to courses"
        tabIndex={0}
        edge="start"
        size="large"
      >
        <ArrowBackIcon fontSize="large" />
      </BackIconButton>
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