import { useCallback, FC, KeyboardEvent } from 'react';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { InstructorBox, HeaderContainer, CourseTitle, InstructorName, InstructorRole, BackIconButton, InstructorAvatar } from '@/components/styles/courses/course-details.styles';

interface Instructor {
  name: string;
  role: string;
  avatar: string;
}

interface CourseHeaderProps {
  title: string;
  instructor: Instructor;
}

const CourseHeader: FC<CourseHeaderProps> = ({ title, instructor }) => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.push('/courses');
  }, [router]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
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
        <InstructorAvatar src={instructor.avatar} alt={instructor.name} />
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