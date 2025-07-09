import { CourseCard, CourseCardContent, CourseHeader, CourseTitle, CourseInstructor, StatusChip, CourseDescription, ProgressSection, ProgressHeader, ProgressText, ProgressPercentage, StyledProgressBar, CourseFooter, LastAccessed, ContinueButton } from '@/components/styles/home-page/home-page.styles'
import { formatDate } from "@/utils/dateUtils";
import React from 'react';
import { useRouter } from 'next/navigation';
import type { CustomCourseProgress } from '../page';

const CourseProgressCard = ({ course }: { course: CustomCourseProgress }) => {
  // Hooks
  const router = useRouter();

  // Handlers
  const handleCourseCardClick = (courseId: string) => {
    router.push(`/courses/${courseId}/materials`);
  };

  const handleCourseCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, courseId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCourseCardClick(courseId);
    }
  };


  return (
    <CourseCard
      key={course.course.id}
      tabIndex={0}
      aria-label={`Course: ${course.course.title}`}
      role="button"
    >
      <CourseCardContent>
        <CourseHeader>
          <div>
            <CourseTitle variant="h3" component="h2">
              {course.course.title}
            </CourseTitle>
            <CourseInstructor>
              {course.course.instructor_name}
            </CourseInstructor>
          </div>
          <StatusChip
            label={
              course.status === "completed"
                ? "Completed"
                : course.status === "in_progress"
                  ? "In Progress"
                  : "Not Started"
            }
            color={
              course.status === "completed"
                ? "success"
                : course.status === "in_progress"
                  ? "warning"
                  : "default"
            }
            aria-label={`Status: ${course.status}`}
          />
        </CourseHeader>
        <CourseDescription>
          {course.course.description}
        </CourseDescription>
        <ProgressSection>
          <ProgressHeader>
            <ProgressText>
              {course.completed_resources} of{" "}
              {course.total_resources} resources completed
            </ProgressText>
            <ProgressPercentage>
              {Math.round(course.progress_percentage)}%
            </ProgressPercentage>
          </ProgressHeader>
          <StyledProgressBar
            variant="determinate"
            value={course.progress_percentage}
            aria-label="Course progress"
          />
        </ProgressSection>
        <CourseFooter>
          <LastAccessed>
            Last accessed: {formatDate(course.last_accessed)}
          </LastAccessed>
          {course.status !== "completed" &&
            course.next_resource && (
              <ContinueButton
                variant="contained"
                onClick={() => handleCourseCardClick(course.course.id)}
                aria-label={`Continue course: ${course.course.title}`}
              >
                Continue
              </ContinueButton>
            )}
        </CourseFooter>
      </CourseCardContent>
    </CourseCard>
  )
}

export default CourseProgressCard