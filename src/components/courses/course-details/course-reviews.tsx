import { Fragment, useState, useMemo, ChangeEvent } from 'react';
import { Typography, InputAdornment, Divider, Grid, Skeleton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import { ReviewsList, ReviewItem, ReviewAvatar, ReviewContent, ReviewHeader, ReviewName, ReviewDate, ReviewText, HelpfulActions, SearchBarContainer, NoReviewsBox, SearchInput, HelpfulText, HelpfulButton, ShowMoreButton, ShowMoreContainer, ReviewStarsContainer, StarIconStyled } from '@/components/styles/courses/course-reviews.styles';
import { trpc } from '@/lib/trpc/trpc';
import { BasicReview } from '@/services/interfaces/service.interfaces';
import { RatingStatsCard } from './rating-stats-card';

interface CourseReviewsProps {
  courseId: string;
}

const REVIEWS_PER_PAGE = 15;

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: reviewsData, isLoading, error } = trpc.reviews.getCourseReviews.useQuery({
    courseId,
    page,
    pageSize: REVIEWS_PER_PAGE,
    search: search || undefined,
  }, {
    enabled: !!courseId,
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const filteredReviews = useMemo(() => {
    return reviewsData?.reviews || [];
  }, [reviewsData]);

  const hasMore = reviewsData ? (page * REVIEWS_PER_PAGE) < reviewsData.totalRecord : false;

  const handleShowMore = () => {
    setPage(p => p + 1);
  };

  if (error) {
    return <NoReviewsBox>Error loading reviews: {error.message}</NoReviewsBox>;
  }

  return (
    <Grid container spacing={4}>
      {/* Ratings Summary */}
      <Grid size={5}>
        <RatingStatsCard courseId={courseId} />
      </Grid>

      {/* Reviews List */}
      <Grid size={7}>
        <SearchBarContainer>
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search reviews"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              'aria-label': 'Search reviews',
            }}
            variant="outlined"
            tabIndex={0}
          />
        </SearchBarContainer>
        {isLoading ? (
          <>
            {[1, 2].map(i => (
              <Skeleton key={i} variant="rectangular" height={80} />
            ))}
          </>
        ) : filteredReviews.length === 0 ? (
          <NoReviewsBox>
            {search ? 'No reviews matched your search. Try searching with another term.' : 'No reviews yet for this course.'}
          </NoReviewsBox>
        ) : (
          <>
            <ReviewsList>
              {filteredReviews.map((review: BasicReview) => (
                <Fragment key={review.id}>
                  <ReviewItem tabIndex={0} aria-label={`Review by ${review.user?.full_name || 'Anonymous'}`} alignItems="flex-start" disableGutters>
                    <ReviewAvatar>
                      {review.user?.full_name ? review.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'A'}
                    </ReviewAvatar>
                    <ReviewContent>
                      <ReviewHeader>
                        <ReviewName>{review.user?.full_name || 'Anonymous'}</ReviewName>
                        <ReviewStarsContainer>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIconStyled
                              key={i}
                              filled={i < review.rating}
                              aria-label={i < review.rating ? 'Filled star' : 'Empty star'}
                            />
                          ))}
                        </ReviewStarsContainer>
                        <ReviewDate>
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </ReviewDate>
                      </ReviewHeader>
                      <ReviewText>{review.content}</ReviewText>
                      <HelpfulActions>
                        <HelpfulText>Helpful?</HelpfulText>
                        <HelpfulButton aria-label="Thumbs up" size="small" tabIndex={0}>
                          <ThumbUpAltOutlinedIcon fontSize="small" />
                        </HelpfulButton>
                        <HelpfulButton aria-label="Thumbs down" size="small" tabIndex={0}>
                          <ThumbDownAltOutlinedIcon fontSize="small" />
                        </HelpfulButton>
                      </HelpfulActions>
                    </ReviewContent>
                  </ReviewItem>
                  <Divider component="li" />
                </Fragment>
              ))}
            </ReviewsList>
            {hasMore && (
              <ShowMoreContainer>
                <ShowMoreButton onClick={handleShowMore} aria-label="Show more reviews">
                  Show more reviews
                </ShowMoreButton>
              </ShowMoreContainer>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default CourseReviews; 