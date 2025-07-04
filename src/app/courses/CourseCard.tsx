import React from 'react';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
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
} from './courses.styled';

interface CourseCardProps {
  course: any;
  isMobile: boolean;
  handleBookmark: (id: number) => void;
  handleBookmarkKeyDown: (e: React.KeyboardEvent, id: number) => void;
  MAX_ENROLLED_DISPLAY: number;
}

const CourseCard = ({ course, isMobile, handleBookmark, handleBookmarkKeyDown, MAX_ENROLLED_DISPLAY }: CourseCardProps) => (
  <StyledCourseCard
    tabIndex={0}
    aria-label={`Course: ${course.title}`}
    isMobile={isMobile}
  >
    <CardImage
      component="img"
      image={course.image}
      alt={course.title}
      isMobile={isMobile}
    />
    <StyledCardContent>
      <CardContentTop>
        <Typography variant="h6" component="h2" fontWeight={700} mb={1} color="#fff">
          {course.title}
        </Typography>
        <Typography variant="body2" mb={2} color="#b0b3b8" fontWeight={400}>
          {course.description}
        </Typography>
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {course.tags.map((tag: string) => (
            <TagChip
              key={tag}
              label={tag}
              tabIndex={0}
              aria-label={`Tag: ${tag}`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <Rating
            value={course.rating}
            precision={0.1}
            readOnly
            size="small"
            aria-label={`Rating: ${course.rating}`}
            sx={{ color: '#fbc02d', mr: 1 }}
          />
          <Typography variant="body1" color="#fff" fontWeight={600} fontSize={18}>
            {course.rating.toFixed(1)}
          </Typography>
          <Typography
            variant="body1"
            color="#b0b3b8"
            fontWeight={500}
            fontSize={16}
            ml={1}
          >
            ({course.ratingsCount.toLocaleString()} ratings)
          </Typography>
        </div>
      </CardContentTop>
      <BottomRow>
        <BookmarkButton
          aria-label={course.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          tabIndex={0}
          onClick={() => handleBookmark(course.id)}
          onKeyDown={(e) => handleBookmarkKeyDown(e, course.id)}
        >
          {course.isBookmarked ? <BookmarkIcon sx={{ color: '#4ecdc4' }} /> : <BookmarkBorderIcon sx={{ color: '#4ecdc4' }} />}
        </BookmarkButton>
        <VerticalDivider orientation="vertical" flexItem />
        <EnrolledBox>
          <PersonIcon sx={{ color: '#b0b3b8', mr: 1 }} />
          <Typography variant="body2" color="#b0b3b8" fontWeight={500}>
            {course.enrolled > MAX_ENROLLED_DISPLAY ? `${MAX_ENROLLED_DISPLAY}+` : course.enrolled}
          </Typography>
        </EnrolledBox>
      </BottomRow>
    </StyledCardContent>
  </StyledCourseCard>
);

export default CourseCard; 