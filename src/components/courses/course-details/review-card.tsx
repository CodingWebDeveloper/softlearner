"use client";

import { Fragment, useCallback, useEffect } from "react";
import { Divider } from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
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
  OutlinedStarIcon,
  VoteCount,
} from "@/components/styles/courses/course-reviews.styles";
import {
  BasicReview,
  VoteType,
} from "@/services/interfaces/service.interfaces";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  optimisticallyUpdateVote,
  revertVoteUpdate,
  setVotes,
} from "@/lib/store/features/reviewVotesSlice";
import { trpc } from "@/lib/trpc/client";

interface ReviewCardProps {
  review: BasicReview;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const dispatch = useAppDispatch();
  const votes = useAppSelector((state) => state.reviewVotes.votes[review.id]);

  const { mutate: upsertVote } = trpc.votes.upsertVote.useMutation({
    onError: () => {
      // If the mutation fails, revert the optimistic update
      if (votes) {
        dispatch(
          revertVoteUpdate({
            reviewId: review.id,
            ...votes,
          })
        );
      }
    },
  });

  const { data: voteData } = trpc.votes.getReviewVotes.useQuery({
    reviewId: review.id,
  });

  useEffect(() => {
    if (voteData) {
      dispatch(
        setVotes({
          reviewId: review.id,
          upvotes: voteData.vote_counts.upvotes,
          downvotes: voteData.vote_counts.downvotes,
          userVote: voteData.user_vote,
        })
      );
    }
  }, [dispatch, review.id, voteData]);

  const handleVote = useCallback(
    (voteType: VoteType) => {
      const isRemovingVote = votes?.userVote === voteType;

      // Optimistically update the UI
      dispatch(
        optimisticallyUpdateVote({
          reviewId: review.id,
          voteType,
          isRemovingVote,
        })
      );

      // Make the API call
      upsertVote({
        reviewId: review.id,
        voteType,
      });
    },
    [dispatch, review.id, upsertVote, votes?.userVote]
  );

  return (
    <Fragment>
      <ReviewItem
        tabIndex={0}
        aria-label={`Review by ${review.user?.full_name || "Anonymous"}`}
        alignItems="flex-start"
        disableGutters
      >
        <ReviewAvatar>
          {review.user?.full_name
            ? review.user.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : "A"}
        </ReviewAvatar>
        <ReviewContent>
          <ReviewHeader>
            <ReviewName>{review.user?.full_name || "Anonymous"}</ReviewName>
            <ReviewStarsContainer>
              {Array.from({ length: 5 }).map((_, i) => {
                const isFilled = i < review.rating;
                return isFilled ? (
                  <FilledStarIcon key={i} />
                ) : (
                  <OutlinedStarIcon key={i} />
                );
              })}
            </ReviewStarsContainer>
            <ReviewDate>
              {new Date(review.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </ReviewDate>
          </ReviewHeader>
          <ReviewText>{review.content}</ReviewText>
          <HelpfulActions>
            <HelpfulText>Helpful?</HelpfulText>
            <HelpfulButton
              aria-label="Thumbs up"
              size="small"
              tabIndex={0}
              onClick={() => handleVote("Up")}
            >
              {votes?.userVote === "Up" ? (
                <ThumbUpIcon fontSize="small" />
              ) : (
                <ThumbUpAltOutlinedIcon fontSize="small" />
              )}
              <VoteCount>{votes?.upvotes || 0}</VoteCount>
            </HelpfulButton>
            <HelpfulButton
              aria-label="Thumbs down"
              size="small"
              tabIndex={0}
              onClick={() => handleVote("Down")}
            >
              {votes?.userVote === "Down" ? (
                <ThumbDownIcon fontSize="small" />
              ) : (
                <ThumbDownAltOutlinedIcon fontSize="small" />
              )}
              <VoteCount>{votes?.downvotes || 0}</VoteCount>
            </HelpfulButton>
          </HelpfulActions>
        </ReviewContent>
      </ReviewItem>
      <Divider component="li" />
    </Fragment>
  );
};
