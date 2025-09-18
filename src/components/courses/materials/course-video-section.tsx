"use client";

import { FC } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  VideoSection,
  VideoEmbed,
  InstructorBox,
  DownloadSection,
} from "@/components/styles/courses/materials.styles";
import BookmarkCard from "../courses-list/bookmark-card";
import { FullCourse } from "@/services/interfaces/service.interfaces";
import { useAppSelector } from "@/lib/store/hooks";
import { trpc } from "@/lib/trpc/client";
import { selectResource } from "@/lib/store/features/resourceSlice";
import CourseTags from "../course-details/course-tags";
import CategoryIcon from "@mui/icons-material/Category";
import { CategoryChip } from "@/components/styles/courses/course-details.styles";
import CompleteCard from "./complete-card";
import DownloadIcon from "@mui/icons-material/Download";
import { RESOURCE_TYPES } from "@/lib/constants/database-constants";
import { AvatarImage } from "@/components/profile/avatar-image";
import { getInitials } from "@/utils/utils";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface CourseVideoSectionProps {
  course: FullCourse;
}

const CourseVideoSection: FC<CourseVideoSectionProps> = ({ course }) => {
  // General hooks
  const theme = useTheme();

  // Selectors
  const selectedResource = useAppSelector(selectResource);

  // tRPC hooks
  const { mutateAsync: downloadResourceFile, isPending: isResourceLoading } =
    trpc.resources.downloadResourceFile.useMutation();

  // Reviews visibility flag (placeholder logic)
  const canAddReview: boolean = true;

  const handleDownload = async () => {
    if (!selectedResource) return;

    try {
      const result = await downloadResourceFile({
        resourceId: selectedResource.id,
      });

      // Convert base64 back to blob
      const binaryString = atob(result.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: result.type });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedResource.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const renderContent = () => {
    if (!selectedResource) {
      return (
        <VideoEmbed>
          <iframe
            width="100%"
            height="360"
            src={course.video_url}
            title={course.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoEmbed>
      );
    }

    if (selectedResource.type === RESOURCE_TYPES.VIDEO) {
      return (
        <VideoEmbed>
          <iframe
            width="100%"
            height="360"
            src={selectedResource.url}
            title={selectedResource.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoEmbed>
      );
    }

    return (
      <DownloadSection>
        <Button
          variant="contained"
          onClick={handleDownload}
          disabled={isResourceLoading}
          startIcon={
            isResourceLoading ? (
              <CircularProgress size={20} />
            ) : (
              <DownloadIcon />
            )
          }
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            "&:disabled": {
              backgroundColor: theme.palette.action.disabled,
            },
          }}
        >
          {isResourceLoading ? "Downloading..." : "Download Resource"}
        </Button>
      </DownloadSection>
    );
  };

  // No extra logic: show review UI only based on canAddReview

  return (
    <VideoSection>
      {canAddReview && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            backgroundColor: theme.palette.custom.background.tertiary,
            border: `1px solid ${theme.palette.custom.accent.yellow}`,
            boxShadow: `0 2px 8px rgba(0,0,0,0.25)`,
          }}
          role="region"
          aria-label="Course completed review prompt"
        >
          <StarBorderIcon
            sx={{ color: theme.palette.custom.accent.yellow, mt: 0.5 }}
          />
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              color={theme.palette.custom.text.white}
            >
              You&apos;ve completed {course.name}!
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.custom.text.light}
            >
              What did you think? Help other students by leaving a review.
            </Typography>
          </Box>
        </Box>
      )}
      <Typography
        variant="h5"
        fontWeight={600}
        style={{ color: theme.palette.custom.text.white }}
      >
        {course.name}
      </Typography>
      
      {renderContent()}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={2}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          style={{ color: theme.palette.custom.text.white }}
        >
          {selectedResource?.name}
        </Typography>
        <Box display="flex" gap={2}>
          {selectedResource && (
            <CompleteCard resourceId={selectedResource.id} />
          )}
          <BookmarkCard
            courseId={course.id}
            initialIsBookmarked={course.isBookmarked}
          />
        </Box>
      </Box>

      <Box mt={1}>
        <CategoryChip label={course.category.name} icon={<CategoryIcon />} />
      </Box>
      <Typography
        variant="body1"
        style={{ color: theme.palette.custom.text.light }}
        mt={2}
      >
        {selectedResource?.short_summary || course.description}
      </Typography>
      <CourseTags courseId={course.id} />

      <InstructorBox>
        <AvatarImage
          avatarUrl={course.creator?.avatar_url || undefined}
          alt={course.creator?.full_name || "Instructor"}
          size="small"
        >
          {course.creator?.full_name
            ? getInitials(course.creator.full_name)
            : "U"}
        </AvatarImage>
        <Box ml={2}>
          <Typography
            variant="subtitle1"
            fontWeight={500}
            style={{ color: theme.palette.custom.text.white }}
          >
            {course.creator?.full_name || "Unknown"}
          </Typography>
        </Box>
      </InstructorBox>
    </VideoSection>
  );
};

export default CourseVideoSection;
