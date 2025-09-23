"use client";

import { Box, useTheme } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  LightText,
  StyledButton,
  WhiteText,
} from "@/components/styles/infrastructure/layout.styles";
import { BannerContainer } from "@/components/styles/courses/materials.styles";
import { trpc } from "@/lib/trpc/client";
import ReviewModal, {
  ReviewFormValues,
} from "@/components/reviews/review-modal";
import { useState } from "react";
import { FormikHelpers } from "formik";
import { useSnackbar } from "notistack";

interface ReviewBannerProps {
  courseId: string;
  isReviewed: boolean;
}

const ReviewBanner = ({ courseId, isReviewed }: ReviewBannerProps) => {
  // General hooks
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // States
  const [openReview, setOpenReview] = useState(false);
  const [reviewed, setReviewed] = useState(isReviewed);

  // Mutations
  const { mutateAsync: createReview } = trpc.reviews.createReview.useMutation({
    onSuccess: () => {
      setReviewed(true);
      enqueueSnackbar("Thanks for your feedback!", {
        variant: "success",
      });
    },
    onError: () => {
      setReviewed(false); // Revert optimistic update
      enqueueSnackbar("Failed to submit review", {
        variant: "error",
      });
    },
  });

  // Queries
  const { data: resources } =
    trpc.resources.getResourceMaterialsByCourseId.useQuery(
      {
        courseId: courseId!,
      },
      { enabled: Boolean(courseId) }
    );

  // Other variables
  const isCourseCompleted = resources?.every((r) => r.completed);

  // Handlers
  const handleOpenReview = () => {
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
  };

  const handleSubmitReview = async (
    values: ReviewFormValues,
    { setSubmitting }: FormikHelpers<ReviewFormValues>
  ) => {
    try {
      setSubmitting(true);
      // Optimistic update to hide the banner immediately
      await createReview({
        courseId: courseId!,
        rating: values.rating,
        content: values.content,
      });

      handleCloseReview();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isCourseCompleted || reviewed) return null;

  return (
    <BannerContainer role="region" aria-label="Course completed review prompt">
      <StarBorderIcon
        sx={{ color: theme.palette.custom.accent.yellow, mt: 0.5 }}
      />
      <Box sx={{ flex: 1 }}>
        <WhiteText variant="h6" fontWeight={700} gutterBottom>
          You&apos;ve completed the course!
        </WhiteText>
        <LightText
          variant="body2"
          color={theme.palette.custom.text.light}
          sx={{ mb: 1.5 }}
        >
          What did you think? Help other students by leaving a review.
        </LightText>
        <StyledButton
          size="small"
          variant="contained"
          startIcon={<StarBorderIcon />}
          aria-label="Leave a review"
          onClick={handleOpenReview}
        >
          Leave a Review
        </StyledButton>
      </Box>
      {openReview && (
        <ReviewModal
          open={openReview}
          onClose={handleCloseReview}
          onSubmit={handleSubmitReview}
        />
      )}
    </BannerContainer>
  );
};

export default ReviewBanner;
