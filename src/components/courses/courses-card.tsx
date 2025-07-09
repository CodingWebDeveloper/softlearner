
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
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
import { RatingStyled } from '../styles/courses/course-details.styles';

interface CourseCardProps {
  course: any;
  isMobile: boolean;
  handleBookmark: (id: number) => void;
  handleBookmarkKeyDown: (e: React.KeyboardEvent, id: number) => void;
  MAX_ENROLLED_DISPLAY: number;
}

const CourseCard = ({ course, isMobile, handleBookmark, handleBookmarkKeyDown, MAX_ENROLLED_DISPLAY }: CourseCardProps) => {
  const router = useRouter();
  const theme = useTheme();

  const handleNavigate = () => {
    router.push(`/courses/${course.id}`);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigate();
    }
  };

  return (
    <StyledCourseCard
      tabIndex={0}
      aria-label={`Course: ${course.title}`}
      isMobile={isMobile}
      onClick={handleNavigate}
      onKeyDown={handleCardKeyDown}
      role="button"
    >
      <CardImage
        image={course.image}
        isMobile={isMobile}
      />
      <StyledCardContent>
        <CardContentTop>
          <Typography variant="h6" component="h2" fontWeight={700} mb={1} color={theme.palette.custom.text.white}>
            {course.title}
          </Typography>
          <Typography variant="body2" mb={2} color={theme.palette.custom.text.light} fontWeight={400}>
            {course.description}
          </Typography>
          <TagsContainer>
            {course.tags.map((tag: string) => (
              <TagChip
                key={tag}
                label={tag}
                tabIndex={0}
                aria-label={`Tag: ${tag}`}
              />
            ))}
          </TagsContainer>
          <RatingContainer>
            <RatingStyled
              value={course.rating}
              precision={0.1}
              readOnly
              size="small"
              aria-label={`Rating: ${course.rating}`}
            />
            <Typography variant="body1" color={theme.palette.custom.text.white} fontWeight={600} fontSize={18}>
              {course.rating.toFixed(1)}
            </Typography>
            <Typography
              variant="body1"
              color={theme.palette.custom.text.light}
              fontWeight={500}
              fontSize={16}
              ml={1}
            >
              ({course.ratingsCount.toLocaleString()} ratings)
            </Typography>
          </RatingContainer>
        </CardContentTop>
        <BottomRow>
          <BookmarkButton
            aria-label={course.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); handleBookmark(course.id); }}
            onKeyDown={(e) => { e.stopPropagation(); handleBookmarkKeyDown(e, course.id); }}
          >
            {course.isBookmarked ? 
              <BookmarkIconStyled /> : 
              <BookmarkBorderIconStyled />
            }
          </BookmarkButton>
          <VerticalDivider orientation="vertical" flexItem />
          <EnrolledBox>
            <PersonIconStyled />
            <Typography variant="body2" color={theme.palette.custom.text.light} fontWeight={500}>
              {course.enrolled > MAX_ENROLLED_DISPLAY ? `${MAX_ENROLLED_DISPLAY}+` : course.enrolled}
            </Typography>
          </EnrolledBox>
        </BottomRow>
      </StyledCardContent>
    </StyledCourseCard>
  );
};

export default CourseCard; 