'use client';

import { Fragment } from 'react';
import { Divider } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import { 
  ReviewItem, 
  ReviewAvatar, 
  ReviewContent, 
  ReviewHeader, 
  ReviewName, 
  ReviewDate, 
  ReviewText, 
  HelpfulActions, 
  HelpfulText, 
  HelpfulButton,
  ReviewStarsContainer,
  FilledStarIcon,
  OutlinedStarIcon
} from '@/components/styles/courses/course-reviews.styles';
import { BasicReview } from '@/services/interfaces/service.interfaces';

interface ReviewCardProps {
  review: BasicReview;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Fragment>
      <ReviewItem 
        tabIndex={0} 
        aria-label={`Review by ${review.user?.full_name || 'Anonymous'}`} 
        alignItems="flex-start" 
        disableGutters
      >
        <ReviewAvatar>
          {review.user?.full_name 
            ? review.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() 
            : 'A'
          }
        </ReviewAvatar>
        <ReviewContent>
          <ReviewHeader>
            <ReviewName>{review.user?.full_name || 'Anonymous'}</ReviewName>
            <ReviewStarsContainer>
              {Array.from({ length: 5 }).map((_, i) => {
                const isFilled = i < review.rating;
                return isFilled 
                  ? <FilledStarIcon key={i} /> 
                  : <OutlinedStarIcon key={i} />;
              })}
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
  );
}; 