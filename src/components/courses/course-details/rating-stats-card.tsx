'use client';

import { Box, Card, CardContent, LinearProgress, Rating, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { trpc } from '@/lib/trpc/trpc';
import LoadingFallback from '@/components/loading-fallback';
import { RatingBar, RatingRow, RatingValue, StarIconStyled } from '@/components/styles/courses/course-reviews.styles';
import { RatingCount } from '@/components/styles/courses/course-reviews.styles';
import { ReviewStarsWrapper } from '@/components/styles/courses/course-reviews.styles';

const StyledRatingBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
}));

interface RatingStatsCardProps {
  courseId: string;
}

export const RatingStatsCard = ({ courseId }: RatingStatsCardProps) => {
  const { data: ratingStats, isLoading, error } = trpc.reviews.getCourseRatingStats.useQuery(courseId);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (error || !ratingStats) {
    return null;
  }

  return (
    <>
    <RatingValue>
          <StarIconStyled filled style={{ fontSize: 32 }} />
          {ratingStats.average || 0} course rating
        </RatingValue>
        <RatingCount>
          {ratingStats.total.toLocaleString() || 0} ratings
        </RatingCount>
        <ReviewStarsWrapper>
          {[5, 4, 3, 2, 1].map((star, idx) => (
            <RatingRow key={star}>
              <Typography variant="body2" >{star}</Typography>
              <StarIconStyled filled />
              <RatingBar variant="determinate" value={ratingStats.breakdown[idx] || 0} />
              <Typography variant="body2" >{ratingStats.breakdown[idx] || 0}%</Typography>
            </RatingRow>
          ))}
        </ReviewStarsWrapper>
    </>
    
  );
}; 