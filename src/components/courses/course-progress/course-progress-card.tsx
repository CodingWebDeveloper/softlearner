import { KeyboardEvent } from "react";
import { Button } from "@mui/material";
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

const CourseProgressCard = ({ course }: { course: PurchasedCourse }) => {
  // Hooks
  const router = useRouter();

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

  const completedResources = course.resources.filter((r) => r.completed).length;
  const totalResources = course.resources.length;
  const progressPercentage = (completedResources / totalResources) * 100;
  const status =
    completedResources === totalResources
      ? "completed"
      : completedResources > 0
      ? "in_progress"
      : "not_started";

  // Reviews visibility flag (placeholder logic)
  const canAddReview: boolean = true;

  return (
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
              {Math.round(progressPercentage)}%
            </ProgressPercentage>
          </ProgressHeader>
          <StyledProgressBar
            variant="determinate"
            value={progressPercentage}
            aria-label="Course progress"
          />
        </ProgressSection>
        <CourseFooter>
          <LastAccessed>
            Purchased: {formatDate(course.orderCreatedAt)}
          </LastAccessed>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {status !== "completed" && <ContinueCard course={course} />}          
            {canAddReview && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<StarBorderIcon />}
                sx={{
                  color: "primary.main",
                  borderColor: "primary.main",
                  textTransform: "none",
                  '&:hover': { borderColor: "secondary.main", color: "secondary.main" }
                }}
                aria-label="Leave a review"
              >
                Leave a Review
              </Button>
            )}
          </div>
        </CourseFooter>
      </CourseCardContent>
    </CourseCard>
  );
};

export default CourseProgressCard;
