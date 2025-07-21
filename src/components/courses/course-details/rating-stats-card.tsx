"use client";

import { Typography } from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import LoadingFallback from "@/components/loading-fallback";
import {
  FilledStarIcon,
  RatingBar,
  RatingRow,
  RatingValue,
} from "@/components/styles/courses/course-reviews.styles";
import { RatingCount } from "@/components/styles/courses/course-reviews.styles";
import { ReviewStarsWrapper } from "@/components/styles/courses/course-reviews.styles";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setSelectedRating } from "@/lib/store/features/reviewFiltersSlice";

interface RatingStatsCardProps {
  courseId: string;
}

export const RatingStatsCard = ({ courseId }: RatingStatsCardProps) => {
  const dispatch = useAppDispatch();
  const selectedRating = useAppSelector(
    (state) => state.reviewFilters.selectedRating
  );
  const {
    data: ratingStats,
    isLoading,
    error,
  } = trpc.reviews.getCourseRatingStats.useQuery(courseId);

  const handleRatingClick = (rating: number) => {
    dispatch(setSelectedRating(rating));
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error || !ratingStats) {
    return null;
  }

  return (
    <>
      <RatingValue>
        <FilledStarIcon sx={{ fontSize: 32 }} />
        {ratingStats.average || 0} course rating
      </RatingValue>
      <RatingCount>
        {ratingStats.total.toLocaleString() || 0} ratings
      </RatingCount>
      <ReviewStarsWrapper>
        {[5, 4, 3, 2, 1].map((star, idx) => (
          <RatingRow
            key={star}
            isActive={selectedRating === star}
            onClick={() => handleRatingClick(star)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleRatingClick(star);
              }
            }}
            aria-label={`Filter by ${star} star reviews${
              selectedRating === star ? " (currently selected)" : ""
            }`}
            sx={{
              fontWeight: selectedRating === star ? "bold" : "normal",
              "& .MuiTypography-root": {
                color:
                  selectedRating === star
                    ? "primary.main"
                    : "custom.text.light",
              },
            }}
          >
            <Typography variant="body2">{star}</Typography>
            <FilledStarIcon
              sx={{
                color:
                  selectedRating === star
                    ? "primary.main"
                    : "custom.accent.yellow",
              }}
            />
            <RatingBar
              variant="determinate"
              value={ratingStats.breakdown[idx] || 0}
              sx={{
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    selectedRating === star
                      ? "primary.main"
                      : "custom.accent.yellow",
                },
              }}
            />
            <Typography variant="body2">
              {ratingStats.breakdown[idx] || 0}%
            </Typography>
          </RatingRow>
        ))}
      </ReviewStarsWrapper>
    </>
  );
};
