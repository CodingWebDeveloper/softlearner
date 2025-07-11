import { Fragment, useEffect, useState, useMemo, ChangeEvent } from 'react';
import { Typography, InputAdornment, Divider, Grid, Skeleton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import { RatingValue, RatingCount, RatingBar, RatingRow, ReviewsList, ReviewItem, ReviewAvatar, ReviewContent, ReviewHeader, ReviewName, ReviewDate, ReviewText, HelpfulActions, SearchBarContainer, NoReviewsBox, SearchInput, HelpfulText, HelpfulButton, ShowMoreButton, ShowMoreContainer, ReviewStarsContainer, StarIconStyled, ReviewStarsWrapper } from '@/components/styles/courses/course-reviews.styles';

// Review type
type Review = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  notHelpful: number;
};

const reviewsMock: Review[] = [
  {
    id: '1',
    name: 'Bruno Z.',
    initials: 'BZ',
    rating: 5,
    date: 'a month ago',
    text: 'terceiro curso que eu consumo desse professor, todos muito completos e didáticos',
    helpful: 0,
    notHelpful: 0,
  },
];

const ratingSummary = {
  average: 4.7,
  total: 23000,
  breakdown: [70, 24, 4, 1, 1], // percentages for 5,4,3,2,1 stars
};

const REVIEWS_PER_PAGE = 15;

const CourseReviews = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredReviews = useMemo(() => {
    if (!search) return reviewsMock;
    return reviewsMock.filter(r =>
      r.text.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const paginatedReviews = useMemo(() => {
    return filteredReviews.slice(0, page * REVIEWS_PER_PAGE);
  }, [filteredReviews, page]);

  const hasMore = paginatedReviews.length < filteredReviews.length;

  const handleShowMore = () => {
    setPage(p => p + 1);
  };

  if (error) {
    return <NoReviewsBox>Error loading reviews.</NoReviewsBox>;
  }

  return (
    <Grid container spacing={4}>
      {/* Ratings Summary */}
      <Grid size={5}>
        <RatingValue>
          <StarIconStyled filled style={{ fontSize: 32 }} />
          {ratingSummary.average} course rating
        </RatingValue>
        <RatingCount>
          {ratingSummary.total.toLocaleString()} ratings
        </RatingCount>
        <ReviewStarsWrapper>
          {[5, 4, 3, 2, 1].map((star, idx) => (
            <RatingRow key={star}>
              <Typography variant="body2" >{star}</Typography>
              <StarIconStyled filled />
              <RatingBar variant="determinate" value={ratingSummary.breakdown[idx]} />
              <Typography variant="body2" >{ratingSummary.breakdown[idx]}%</Typography>
            </RatingRow>
          ))}
        </ReviewStarsWrapper>
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
        {loading ? (
          <>
            {[1, 2].map(i => (
              <Skeleton key={i} variant="rectangular" height={80} />
            ))}
          </>
        ) : filteredReviews.length === 0 ? (
          <NoReviewsBox>No reviews matched your search. Try searching with another term.</NoReviewsBox>
        ) : (
          <>
            <ReviewsList>
              {paginatedReviews.map(review => (
                <Fragment key={review.id}>
                  <ReviewItem tabIndex={0} aria-label={`Review by ${review.name}`} alignItems="flex-start" disableGutters>
                    <ReviewAvatar>{review.initials}</ReviewAvatar>
                    <ReviewContent>
                      <ReviewHeader>
                        <ReviewName>{review.name}</ReviewName>
                        <ReviewStarsContainer>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIconStyled
                              key={i}
                              filled={i < review.rating}
                              aria-label={i < review.rating ? 'Filled star' : 'Empty star'}
                            />
                          ))}
                        </ReviewStarsContainer>
                        <ReviewDate>{review.date}</ReviewDate>
                      </ReviewHeader>
                      <ReviewText>{review.text}</ReviewText>
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