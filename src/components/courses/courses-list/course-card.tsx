import { KeyboardEvent } from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import {
  CourseCard as StyledCourseCard,
  CardImage,
  TagChip,
  BottomRow,
  VerticalDivider,
  StyledCardContent,
  CardContentTop,
  TagsContainer,
  RatingContainer,
  PriceBox,
  Price,
  OldPrice,
  DiscountTag,
  CourseCardRating,
} from "@/components/styles/courses/courses.styles";
import { BasicCourse } from "@/services/interfaces/service.interfaces";
import BookmarkCard from "./bookmark-card";

interface CourseCardProps {
  course: BasicCourse;
  handleNavigate: () => void;
}

const CourseCard = ({ course, handleNavigate }: CourseCardProps) => {
  // General hooks
  const theme = useTheme();

  // Handlers

  const handleCardKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigate();
    }
  };

  // Other variables
  const hasDiscount =
    course.new_price !== null && course.new_price !== undefined;
  const displayPrice = hasDiscount ? course.new_price! : course.price;
  const discountPercentage = hasDiscount
    ? Math.round(((course.price - course.new_price!) / course.price) * 100)
    : 0;

  return (
    <StyledCourseCard
      tabIndex={0}
      aria-label={`Course: ${course.name}`}
      onClick={handleNavigate}
      onKeyDown={handleCardKeyDown}
      role="button"
    >
      <CardImage image={course.thumbnail_image_url} />
      <StyledCardContent>
        <CardContentTop>
          <Typography
            variant="h6"
            component="h2"
            fontWeight={700}
            mb={1}
            color={theme.palette.custom.text.white}
          >
            {course.name}
          </Typography>
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
            <CourseCardRating
              value={course.rating || 0}
              precision={0.1}
              readOnly
              size="small"
              aria-label={`Rating: ${course.rating || 0}`}
            />
            <Typography
              variant="body1"
              color={theme.palette.custom.text.white}
              fontWeight={600}
              fontSize={18}
            >
              {course.rating || 0}
            </Typography>
          </RatingContainer>
        </CardContentTop>
        <BottomRow>
          <BookmarkCard
            courseId={course.id}
            initialIsBookmarked={course.isBookmarked}
          />
          <VerticalDivider orientation="vertical" flexItem />
          <PriceBox>
            {hasDiscount && (
              <>
                <OldPrice>${course.price.toFixed(2)}</OldPrice>
                <DiscountTag>-{discountPercentage}%</DiscountTag>
              </>
            )}
            <Price>${displayPrice.toFixed(2)}</Price>
          </PriceBox>
        </BottomRow>
      </StyledCardContent>
    </StyledCourseCard>
  );
};

export default CourseCard;
