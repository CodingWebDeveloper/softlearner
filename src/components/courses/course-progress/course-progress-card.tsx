import { KeyboardEvent, useState } from "react";
import type { FormikHelpers } from "formik";
import { Button, useTheme } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  CourseCard,
  CourseCardContent,
  CourseHeader,
  CourseTitle,
  CourseInstructor,
  StatusChip,
  ProgressSection,
  ProgressHeader,
  ProgressText,
  ProgressPercentage,
  StyledProgressBar,
  CourseFooter,
  LastAccessed,
} from "@/components/styles/home-page/home-page.styles";
import { formatDate } from "@/utils/date.utils";
import { useRouter } from "next/navigation";
import { PurchasedCourse } from "@/services/interfaces/service.interfaces";
import ContinueCard from "./continue-card";
import ReviewModal, {
  ReviewFormValues,
} from "@/components/reviews/review-modal";
import { trpc } from "@/lib/trpc/client";
import { useSnackbar } from "notistack";

const CourseProgressCard = ({ course }: { course: PurchasedCourse }) => {
  // General hooks
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // States
  const [reviewed, setReviewed] = useState(course.isReviewed);

  // Queries
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

  // States
  const [openReview, setOpenReview] = useState(false);

  // Handlers
  const handleClick = (courseId: string) => {
    router.push(`/courses/${courseId}/materials`);
  };

  const handleCourseCardKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    courseId: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(courseId);
    }
  };

  const handleCloseReview = () => {
    setOpenReview(false);
  };

  const handleReviewSubmit = async (
    values: ReviewFormValues,
    { setSubmitting }: FormikHelpers<ReviewFormValues>
  ) => {
    try {
      setSubmitting(true);
      // Optimistic update to hide the banner immediately
      await createReview({
        courseId: course.id,
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

  const completedResources =
    course.resources.filter((r) => r.completed).length ?? 0;
  const totalResources = course.resources.length ?? 0;
  const progressPercentage = (completedResources / totalResources) * 100;
  const status =
    completedResources === totalResources
      ? "completed"
      : completedResources > 0
      ? "in_progress"
      : "not_started";

  return (
    <>
      <CourseCard
        key={course.id}
        tabIndex={0}
        aria-label={`Course: ${course.name}`}
        role="button"
        onClick={() => handleClick(course.id)}
        onKeyDown={(e) => handleCourseCardKeyDown(e, course.id)}
      >
        <CourseCardContent>
          <CourseHeader>
            <div>
              <CourseTitle variant="h3" component="h2">
                {course.name}
              </CourseTitle>
              <CourseInstructor>
                {course.creator?.full_name || "Unknown"}
              </CourseInstructor>
            </div>
            <StatusChip
              label={
                status === "completed"
                  ? "Completed"
                  : status === "in_progress"
                  ? "In Progress"
                  : "Not Started"
              }
              color={
                status === "completed"
                  ? "success"
                  : status === "in_progress"
                  ? "warning"
                  : "default"
              }
              aria-label={`Status: ${status}`}
            />
          </CourseHeader>
          <ProgressSection>
            <ProgressHeader>
              <ProgressText>
                {completedResources} of {totalResources} resources completed
              </ProgressText>
              <ProgressPercentage>
                {progressPercentage ? Math.round(progressPercentage) : 0}%
              </ProgressPercentage>
            </ProgressHeader>
            <StyledProgressBar
              variant="determinate"
              value={progressPercentage ?? 0}
              aria-label="Course progress"
            />
          </ProgressSection>
          <CourseFooter>
            <LastAccessed>
              Purchased: {formatDate(course.orderCreatedAt)}
            </LastAccessed>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {status !== "completed" ? (
                <ContinueCard course={course} />
              ) : (
                !reviewed && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<StarBorderIcon />}
                    sx={{
                      color: theme.palette.custom.accent.yellow,
                      borderColor: theme.palette.custom.accent.yellow,
                      textTransform: "none",
                      "&:hover": {
                        borderColor: theme.palette.custom.accent.yellow,
                        color: theme.palette.custom.accent.yellow,
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenReview(true);
                    }}
                    aria-label="Leave a review"
                  >
                    Leave a Review
                  </Button>
                )
              )}
            </div>
          </CourseFooter>
        </CourseCardContent>
      </CourseCard>
      {openReview && (
        <ReviewModal
          open={openReview}
          onClose={() => setOpenReview(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
};

export default CourseProgressCard;
