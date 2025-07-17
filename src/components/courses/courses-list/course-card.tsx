import { KeyboardEvent } from 'react';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import {
  CourseCard as StyledCourseCard,
  CardImage,
  TagChip,
  BottomRow,
  BookmarkButton,
  EnrolledBox,
  VerticalDivider,
  StyledCardContent,
  CardContentTop,
  TagsContainer,
  RatingContainer,
  BookmarkIconStyled,
  PersonIconStyled,
  BookmarkBorderIconStyled,
} from '@/components/styles/courses/courses.styles';
import { RatingStyled } from '../../styles/courses/course-details.styles';
import { BasicCourse } from '@/services/interfaces/service.interfaces';

interface CourseCardProps {
  course: BasicCourse;
  handleBookmark: (id: string) => void;
  handleBookmarkKeyDown: (e: KeyboardEvent, id: string) => void;
  MAX_ENROLLED_DISPLAY: number;
}

const CourseCard = ({ course, handleBookmark, handleBookmarkKeyDown }: CourseCardProps) => {
  const router = useRouter();
  const theme = useTheme();

  const handleNavigate = () => {
    router.push(`/courses/${course.id}`);
  };

  const handleCardKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigate();
    }
  };

  return (
    <StyledCourseCard
      tabIndex={0}
      aria-label={`Course: ${course.name}`}
      onClick={handleNavigate}
      onKeyDown={handleCardKeyDown}
      role="button"
    >
      <CardImage
        image={course.thumbnail_image_url}
      />
      <StyledCardContent>
        <CardContentTop>
          <Typography variant="h6" component="h2" fontWeight={700} mb={1} color={theme.palette.custom.text.white}>
            {course.name}
          </Typography>
          {/* <Typography variant="body2" mb={2} color={theme.palette.custom.text.light} fontWeight={400}>
            {course.description}
          </Typography> */}
          <TagsContainer>
            {course.category && (
              <TagChip
                key={course.category.id}
                label={course.category.name}
                tabIndex={0}
                aria-label={`Category: ${course.category.name}`}
              />
            )}
          </TagsContainer>
          <RatingContainer>
            <RatingStyled
              value={course.rating || 0}
              precision={0.1}
              readOnly
              size="small"
              aria-label={`Rating: ${course.rating || 0} out of 5 (${course.ratings_count} ratings)`}
            />
            <Typography variant="body1" color={theme.palette.custom.text.white} fontWeight={600} fontSize={18}>
              {course.rating || 0}
            </Typography>
            <Typography
              variant="body1"
              color={theme.palette.custom.text.light}
              fontWeight={500}
              fontSize={16}
              ml={1}
            >
              ({course.ratings_count} {course.ratings_count === 1 ? 'rating' : 'ratings'})
            </Typography>
          </RatingContainer>
        </CardContentTop>
        <BottomRow>
          <BookmarkButton
            aria-label="Add bookmark"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); handleBookmark(course.id); }}
            onKeyDown={(e) => { e.stopPropagation(); handleBookmarkKeyDown(e, course.id); }}
          >
            <BookmarkBorderIconStyled />
          </BookmarkButton>
          <VerticalDivider orientation="vertical" flexItem />
          <EnrolledBox>
            <PersonIconStyled />
            <Typography variant="body2" color={theme.palette.custom.text.light} fontWeight={500}>
              {course.creator?.full_name || 'Unknown Instructor'}
            </Typography>
          </EnrolledBox>
        </BottomRow>
      </StyledCardContent>
    </StyledCourseCard>
  );
};

export default CourseCard; 