"use client";

import { useState, useMemo, ChangeEvent } from "react";
import { InputAdornment, Grid, Skeleton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  ReviewsList,
  NoReviewsBox,
  SearchBarContainer,
  SearchInput,
  ShowMoreButton,
  ShowMoreContainer,
} from "@/components/styles/courses/course-reviews.styles";
import { trpc } from "@/lib/trpc/client";
import { BasicReview } from "@/services/interfaces/service.interfaces";
import { RatingStatsCard } from "./rating-stats-card";
import { ReviewCard } from "./review-card";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setSearchTerm } from "@/lib/store/features/reviewFiltersSlice";
import { REVIEWS_PER_PAGE } from "@/utils/constants";

interface CourseReviewsProps {
  courseId: string;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const { searchTerm, selectedRating } = useAppSelector(
    (state) => state.reviewFilters
  );

  const {
    data: reviewsData,
    isLoading,
    error,
  } = trpc.reviews.getCourseReviews.useQuery(
    {
      courseId,
      page,
      pageSize: REVIEWS_PER_PAGE,
      search: searchTerm || undefined,
      rating: selectedRating || undefined,
    },
    {
      enabled: !!courseId,
    }
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
    setPage(1); // Reset to first page when searching
  };

  const filteredReviews = useMemo(() => {
    return reviewsData?.reviews || [];
  }, [reviewsData]);

  const hasMore = reviewsData
    ? page * REVIEWS_PER_PAGE < reviewsData.totalRecord
    : false;

  const handleShowMore = () => {
    setPage((p) => p + 1);
  };

  if (error) {
    return <NoReviewsBox>Error loading reviews: {error.message}</NoReviewsBox>;
  }

  return (
    <Grid container spacing={4}>
      {/* Ratings Summary */}
      <Grid size={{ xs: 12, md: 5 }}>
        <RatingStatsCard courseId={courseId} />
      </Grid>

      {/* Reviews List */}
      <Grid size={{ xs: 12, md: 7 }}>
        <SearchBarContainer>
          <SearchInput
            value={searchTerm}
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
              "aria-label": "Search reviews",
            }}
            variant="outlined"
            tabIndex={0}
          />
        </SearchBarContainer>
        {isLoading ? (
          <>
            {[1, 2].map((i) => (
              <Skeleton key={i} variant="rectangular" height={80} />
            ))}
          </>
        ) : filteredReviews.length === 0 ? (
          <NoReviewsBox>
            {searchTerm || selectedRating
              ? `No reviews matched your ${searchTerm ? "search" : ""}${
                  searchTerm && selectedRating ? " and " : ""
                }${selectedRating ? `${selectedRating}-star filter` : ""}.`
              : "No reviews yet for this course."}
          </NoReviewsBox>
        ) : (
          <>
            <ReviewsList>
              {filteredReviews.map((review: BasicReview) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </ReviewsList>
            {hasMore && (
              <ShowMoreContainer>
                <ShowMoreButton
                  onClick={handleShowMore}
                  aria-label="Show more reviews"
                >
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
