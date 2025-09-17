"use client";

import { trpc } from "@/lib/trpc/client";
import { Box, Divider, Skeleton, Alert } from "@mui/material";
import PublishToggle from "@/components/courses/publish-toggle";
import { WhiteText } from "@/components/styles/infrastructure/layout.styles";

interface CourseSettingsProps {
  courseId: string | null;
}

const CourseSettings = ({ courseId }: CourseSettingsProps) => {
  const {
    data: course,
    isPending,
    isError,
    error,
  } = trpc.courses.getCourseDataById.useQuery(courseId!, {
    enabled: Boolean(courseId),
  });

  if (isPending || !Boolean(course)) {
    return (
      <Box display="grid" gap={2}>
        <Skeleton variant="text" width={180} />
        <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
        <Skeleton variant="text" width={280} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error instanceof Error
          ? error.message
          : "Failed to load course settings"}
      </Alert>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box>
        <WhiteText variant="h6" fontWeight={700} gutterBottom>
          Visibility
        </WhiteText>
        <WhiteText variant="body2" gutterBottom>
          Toggle whether this course is visible to learners.
        </WhiteText>
        <PublishToggle
          courseId={course?.id as string}
          initialIsPublished={course?.is_published as boolean}
        />
      </Box>

      <Divider />

      <Box>
        <WhiteText variant="h6" fontWeight={700} gutterBottom>
          Course Info
        </WhiteText>
        <WhiteText variant="body2" color="text.secondary">
          Name: {course?.name}
        </WhiteText>
        <WhiteText variant="body2" color="text.secondary">
          Category: {course?.category?.name}
        </WhiteText>
        <WhiteText variant="body2" color="text.secondary">
          Created: {new Date(course?.created_at as string).toLocaleString()}
        </WhiteText>
        <WhiteText variant="body2" color="text.secondary">
          Last Updated:{" "}
          {new Date(course?.updated_at as string).toLocaleString()}
        </WhiteText>
      </Box>
    </Box>
  );
};

export default CourseSettings;
